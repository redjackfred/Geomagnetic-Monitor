const KP_1M_URL =
  'https://services.swpc.noaa.gov/json/planetary_k_index_1m.json'
const KP_3H_URL =
  'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'
const KP_FORECAST_URL =
  'https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json'
const ALERTS_URL = 'https://services.swpc.noaa.gov/products/alerts.json'
const SOLAR_PROB_URL =
  'https://services.swpc.noaa.gov/json/solar_probabilities.json'
const F107_URL = 'https://services.swpc.noaa.gov/json/f107_cm_flux.json'

export interface KpReading1m {
  time_tag: string
  kp_index: number
  estimated_kp?: number
  kp?: number
}

export interface KpReading3h {
  time_tag: string
  Kp: number
  a_running: number
  station_count: number
}

export interface KpForecastReading {
  time_tag: string
  kp: number
  observed: 'observed' | 'estimated' | 'predicted' | string
  noaa_scale: string | null
}

export interface SolarProbabilities {
  date: string
  c_class_1_day: number
  m_class_1_day: number
  x_class_1_day: number
  '10mev_protons_1_day': number
  polar_cap_absorption: string
}

export interface F107Reading {
  time_tag: string
  flux: number
  ninety_day_mean: number | null
}

export interface SpaceWeatherAlert {
  product_id: string
  issue_datetime: string
  type: 'alert' | 'watch' | 'warning' | 'other'
  summary: string
  isGeomagnetic: boolean
  message: string
}

export interface SpaceWeatherData {
  latest1m: KpReading1m
  recent1m: KpReading1m[]
  history3h: KpReading3h[]
  forecast: KpForecastReading[]
  alerts: SpaceWeatherAlert[]
  solar: SolarProbabilities | null
  f107: F107Reading | null
  fetchedAt: Date
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`NOAA request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

function normalize1mReading(raw: KpReading1m): KpReading1m {
  const kp = raw.kp_index ?? raw.estimated_kp ?? raw.kp ?? 0
  return { ...raw, kp_index: Number(kp) }
}

function parseAlert(raw: {
  product_id: string
  issue_datetime: string
  message: string
}): SpaceWeatherAlert {
  const { message } = raw
  let type: SpaceWeatherAlert['type'] = 'other'
  if (message.includes('WATCH:')) type = 'watch'
  else if (message.includes('WARNING:')) type = 'warning'
  else if (message.includes('ALERT:')) type = 'alert'

  const match = message.match(/(?:ALERT|WATCH|WARNING):\s*([^\n\r]+)/)
  const summary = match?.[1]?.trim() ?? 'Space weather bulletin'
  const isGeomagnetic = /geomagnetic|k-index|k index|\bkp\b|G[1-5]\b/i.test(message)

  return { ...raw, type, summary, isGeomagnetic }
}

function latestSolarProbabilities(
  entries: SolarProbabilities[],
): SolarProbabilities | null {
  if (entries.length === 0) return null
  return entries.reduce((latest, entry) =>
    new Date(entry.date) > new Date(latest.date) ? entry : latest,
  )
}

export async function fetchSpaceWeather(): Promise<SpaceWeatherData> {
  const [raw1m, history3h, forecastRaw, alertsRaw, solarRaw, f107Raw] =
    await Promise.all([
      fetchJson<KpReading1m[]>(KP_1M_URL),
      fetchJson<KpReading3h[]>(KP_3H_URL),
      fetchJson<KpForecastReading[]>(KP_FORECAST_URL),
      fetchJson<{ product_id: string; issue_datetime: string; message: string }[]>(
        ALERTS_URL,
      ),
      fetchJson<SolarProbabilities[]>(SOLAR_PROB_URL),
      fetchJson<F107Reading[]>(F107_URL),
    ])

  const recent1m = raw1m.map(normalize1mReading)
  const latest1m = recent1m[recent1m.length - 1]

  if (!latest1m) {
    throw new Error('No Kp readings available')
  }

  const forecast = forecastRaw.filter((r) => r.observed !== 'observed')
  const alerts = alertsRaw
    .map(parseAlert)
    .sort((a, b) => {
      if (a.isGeomagnetic !== b.isGeomagnetic) return a.isGeomagnetic ? -1 : 1
      return (
        new Date(b.issue_datetime).getTime() -
        new Date(a.issue_datetime).getTime()
      )
    })
    .slice(0, 8)

  return {
    latest1m,
    recent1m,
    history3h,
    forecast,
    alerts,
    solar: latestSolarProbabilities(solarRaw),
    f107: f107Raw[0] ?? null,
    fetchedAt: new Date(),
  }
}

export function get24hMaxKp(history3h: KpReading3h[]): number {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000
  const recent = history3h.filter(
    (r) => new Date(r.time_tag).getTime() >= cutoff,
  )
  if (recent.length === 0) return 0
  return Math.max(...recent.map((r) => r.Kp))
}

export function getLatest3hReading(
  history3h: KpReading3h[],
): KpReading3h | null {
  return history3h.length > 0 ? history3h[history3h.length - 1] : null
}

export function getForecastMaxKp(forecast: KpForecastReading[]): number {
  const predicted = forecast.filter((r) => r.observed === 'predicted')
  if (predicted.length === 0) return 0
  return Math.max(...predicted.map((r) => r.kp))
}

export function getDailyForecastSummary(
  forecast: KpForecastReading[],
): { date: string; maxKp: number; scale: string | null }[] {
  const predicted = forecast.filter((r) => r.observed === 'predicted')
  const byDay = new Map<string, KpForecastReading[]>()

  for (const reading of predicted) {
    const day = reading.time_tag.slice(0, 10)
    const group = byDay.get(day) ?? []
    group.push(reading)
    byDay.set(day, group)
  }

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 3)
    .map(([date, readings]) => {
      const max = readings.reduce(
        (best, r) => (r.kp > best.kp ? r : best),
        readings[0],
      )
      return { date, maxKp: max.kp, scale: max.noaa_scale }
    })
}

export function auroraLatitude(kp: number): number {
  if (kp >= 9) return 40
  if (kp >= 8) return 44
  if (kp >= 7) return 48
  if (kp >= 6) return 52
  if (kp >= 5) return 56
  if (kp >= 4) return 60
  if (kp >= 3) return 64
  if (kp >= 2) return 67
  return 70
}

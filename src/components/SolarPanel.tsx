import type { F107Reading, SolarProbabilities } from '../lib/noaa'
import { getDailyForecastSummary, type KpForecastReading } from '../lib/noaa'
import { formatKp } from '../lib/storm'
import { getStormInfo } from '../lib/stormI18n'
import { useI18n, interpolate } from '../i18n/context'
import { InlineTerm, PanelHeading, TermTip } from './Hint'

interface SolarPanelProps {
  solar: SolarProbabilities | null
  f107: F107Reading | null
  forecast: KpForecastReading[]
}

function pcaColor(level: string): string {
  if (level === 'red') return '#f87171'
  if (level === 'yellow') return '#facc15'
  return '#4ade80'
}

export function SolarPanel({ solar, f107, forecast }: SolarPanelProps) {
  const { t, locale } = useI18n()
  const dailyForecast = getDailyForecastSummary(forecast)

  function formatDay(iso: string): string {
    return new Date(iso + 'T12:00:00').toLocaleDateString(locale === 'zh' ? 'zh-TW' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="solar-panel">
      <PanelHeading title={t.panels.solar} hint={t.glossary.solarPanel} />

      <div className="solar-grid">
        {f107 && (
          <div className="solar-card">
            <span className="solar-card-label">
              <InlineTerm label={t.panels.f107} hint={t.glossary.f107} />
            </span>
            <span className="solar-card-value">{f107.flux.toFixed(0)} sfu</span>
            <span className="solar-card-sub">
              {f107.ninety_day_mean
                ? interpolate(t.panels.avg90, { value: f107.ninety_day_mean.toFixed(0) })
                : <InlineTerm label="sfu" hint={t.glossary.sfu} />}
            </span>
          </div>
        )}

        {solar && (
          <>
            <div className="solar-card">
              <span className="solar-card-label">{t.panels.flareProb}</span>
              <div className="prob-bars">
                <ProbBar label={t.panels.mClass} hint={t.glossary.flareM} value={solar.m_class_1_day} color="#fb923c" />
                <ProbBar label={t.panels.xClass} hint={t.glossary.flareX} value={solar.x_class_1_day} color="#f87171" />
              </div>
            </div>
            <div className="solar-card">
              <span className="solar-card-label">
                <InlineTerm label={t.panels.proton} hint={t.glossary.proton} />
              </span>
              <span className="solar-card-value">{solar['10mev_protons_1_day']}%</span>
              <span className="solar-card-sub">
                {t.panels.pca}{' '}
                <span style={{ color: pcaColor(solar.polar_cap_absorption) }}>
                  {solar.polar_cap_absorption}
                </span>
                <TermTip entry={t.glossary.pca} />
              </span>
            </div>
          </>
        )}
      </div>

      {dailyForecast.length > 0 && (
        <div className="daily-forecast">
          <span className="solar-card-label">
            <InlineTerm label={t.panels.stormByDay} hint={t.glossary.stormPeak} />
          </span>
          <div className="daily-forecast-row">
            {dailyForecast.map((day) => {
              const storm = getStormInfo(day.maxKp, t.storm)
              return (
                <div key={day.date} className="daily-forecast-item">
                  <span className="daily-date">{formatDay(day.date)}</span>
                  <span className="daily-kp" style={{ color: storm.color }}>
                    Kp {formatKp(day.maxKp)}
                  </span>
                  <span className="daily-scale">
                    {day.scale ?? storm.shortLabel}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function ProbBar({
  label,
  hint,
  value,
  color,
}: {
  label: string
  hint: import('../i18n/glossaryTypes').GlossaryEntry
  value: number
  color: string
}) {
  return (
    <div className="prob-bar-row">
      <span className="prob-bar-label">
        <InlineTerm label={label} hint={hint} />
      </span>
      <div className="prob-bar-track">
        <div className="prob-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="prob-bar-value">{value}%</span>
    </div>
  )
}

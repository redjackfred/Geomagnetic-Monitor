import { useCallback, useEffect, useState } from 'react'
import { fetchSpaceWeather, type SpaceWeatherData } from '../lib/noaa'

const REFRESH_MS = 60_000

export function useSpaceWeather() {
  const [data, setData] = useState<SpaceWeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const result = await fetchSpaceWeather()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    const id = window.setInterval(() => void refresh(), REFRESH_MS)
    return () => window.clearInterval(id)
  }, [refresh])

  return { data, loading, error, refresh }
}

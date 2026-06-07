import type { CSSProperties } from 'react'
import { formatKp } from '../lib/storm'
import { getStormInfo, useFormatTime } from '../lib/stormI18n'
import type { KpReading3h } from '../lib/noaa'
import { useI18n, interpolate } from '../i18n/context'
import { LabelWithHint, InlineTerm } from './Hint'

interface StatsGridProps {
  currentKp: number
  max24h: number
  forecastMax: number
  f107: number | null
  latest3h: KpReading3h | null
  lastUpdated: Date
}

export function StatsGrid({
  currentKp,
  max24h,
  forecastMax,
  f107,
  latest3h,
  lastUpdated,
}: StatsGridProps) {
  const { t } = useI18n()
  const formatTime = useFormatTime()
  const maxStorm = getStormInfo(max24h, t.storm)
  const forecastStorm = getStormInfo(forecastMax, t.storm)
  const currentStorm = getStormInfo(currentKp, t.storm)

  const stats = [
    {
      key: 'currentKp',
      label: t.stats.currentKp,
      hint: t.glossary.kp1m,
      value: formatKp(currentKp),
      sub: currentStorm.shortLabel,
      accent: currentStorm.color,
    },
    {
      key: 'max24h',
      label: t.stats.max24h,
      hint: t.glossary.kp3h,
      value: formatKp(max24h),
      sub: maxStorm.shortLabel,
      accent: maxStorm.color,
    },
    {
      key: 'forecastPeak',
      label: t.stats.forecastPeak,
      hint: t.glossary.forecastKp,
      value: forecastMax > 0 ? formatKp(forecastMax) : '—',
      sub: forecastMax > 0 ? forecastStorm.shortLabel : t.stats.noForecast,
      accent: forecastMax > 0 ? forecastStorm.color : undefined,
    },
    {
      key: 'period3h',
      label: t.stats.period3h,
      hint: t.glossary.kp3h,
      value: latest3h ? formatKp(latest3h.Kp) : '—',
      sub: latest3h
        ? interpolate(t.stats.aIndex, { value: latest3h.a_running })
        : t.stats.noData,
      subHint: latest3h ? t.glossary.aIndex : undefined,
      accent: latest3h ? getStormInfo(latest3h.Kp, t.storm).color : undefined,
    },
    {
      key: 'f107',
      label: t.stats.f107,
      hint: t.glossary.f107,
      value: f107 !== null ? f107.toFixed(0) : '—',
      sub: t.stats.sfuSub,
      subHint: t.glossary.sfu,
    },
    {
      key: 'lastUpdated',
      label: t.stats.lastUpdated,
      value: lastUpdated.toLocaleTimeString(t.locale, {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      sub: formatTime(lastUpdated.toISOString()),
    },
  ]

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="stat-card"
          style={stat.accent ? ({ '--stat-accent': stat.accent } as CSSProperties) : undefined}
        >
          <LabelWithHint label={stat.label} hint={stat.hint} />
          <span className="stat-value">{stat.value}</span>
          <span className="stat-sub">
            {'subHint' in stat && stat.subHint ? (
              <InlineTerm label={stat.sub} hint={stat.subHint} />
            ) : (
              stat.sub
            )}
          </span>
        </div>
      ))}
    </div>
  )
}

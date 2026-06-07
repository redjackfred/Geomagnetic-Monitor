import { formatKp } from '../lib/storm'
import { useStormInfo } from '../lib/stormI18n'
import type { KpReading1m } from '../lib/noaa'
import { useI18n, interpolate } from '../i18n/context'
import { PanelHeading } from './Hint'

interface KpSparklineProps {
  data: KpReading1m[]
}

export function KpSparkline({ data }: KpSparklineProps) {
  const { t } = useI18n()
  const recent = data.slice(-60)
  const latestKp = recent.length > 0 ? recent[recent.length - 1].kp_index : 0
  const storm = useStormInfo(latestKp)

  if (recent.length < 2) return null

  const width = 400
  const height = 80
  const pad = { x: 8, y: 8 }
  const innerW = width - pad.x * 2
  const innerH = height - pad.y * 2
  const maxKp = 9

  const points = recent.map((r, i) => {
    const x = pad.x + (i / (recent.length - 1)) * innerW
    const y = pad.y + innerH - (r.kp_index / maxKp) * innerH
    return { x, y, kp: r.kp_index }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const latest = points[points.length - 1]

  return (
    <div className="sparkline-panel">
      <PanelHeading
        title={t.panels.sparkline}
        hint={t.glossary.kp1m}
        caption={interpolate(t.panels.sparklineCaption, { count: recent.length })}
      />
      <div className="sparkline-body">
        <svg viewBox={`0 0 ${width} ${height}`} className="sparkline-svg" role="img" aria-label={t.charts.sparklineAria}>
          <line
            x1={pad.x}
            y1={pad.y + innerH - (5 / maxKp) * innerH}
            x2={pad.x + innerW}
            y2={pad.y + innerH - (5 / maxKp) * innerH}
            className="sparkline-threshold"
          />
          <path d={linePath} className="sparkline-line" style={{ stroke: storm.color }} />
          <circle cx={latest.x} cy={latest.y} r={4} fill={storm.color} className="sparkline-dot" />
        </svg>
        <div className="sparkline-stat">
          <span className="sparkline-value" style={{ color: storm.color }}>
            {formatKp(latest.kp)}
          </span>
          <span className="sparkline-label">{t.panels.sparklineCurrent}</span>
        </div>
      </div>
    </div>
  )
}

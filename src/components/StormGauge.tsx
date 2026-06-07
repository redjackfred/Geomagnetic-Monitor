import type { CSSProperties } from 'react'
import { formatKp } from '../lib/storm'
import { useStormInfo } from '../lib/stormI18n'
import { useI18n } from '../i18n/context'
import { TermTip } from './Hint'

interface StormGaugeProps {
  kp: number
}

export function StormGauge({ kp }: StormGaugeProps) {
  const { t } = useI18n()
  const storm = useStormInfo(kp)
  const fillPercent = Math.min(100, (kp / 9) * 100)

  return (
    <div className="storm-gauge" style={{ '--storm-color': storm.color, '--storm-glow': storm.glow } as CSSProperties}>
      <div className="gauge-ring">
        <svg viewBox="0 0 200 200" className="gauge-svg">
          <circle cx="100" cy="100" r="88" className="gauge-track" />
          <circle
            cx="100"
            cy="100"
            r="88"
            className="gauge-fill"
            style={{
              strokeDasharray: `${(fillPercent / 100) * 553} 553`,
            }}
          />
        </svg>
        <div className="gauge-center">
          <span className="gauge-kp">{formatKp(kp)}</span>
          <span className="gauge-unit">
            Kp
            <TermTip entry={t.glossary.kp} />
          </span>
        </div>
      </div>
      <div className="gauge-meta">
        <span className="storm-badge">{storm.shortLabel}</span>
        <h2 className="storm-title">{storm.label}</h2>
        <p className="storm-desc">{storm.description}</p>
      </div>
    </div>
  )
}

import type { CSSProperties } from 'react'
import { G_SCALE, kpToStormLevel, type StormLevel } from '../lib/storm'
import { getStormInfo } from '../lib/stormI18n'
import { useI18n } from '../i18n/context'
import { PanelHeading } from './Hint'

interface GScaleBarProps {
  currentKp: number
}

export function GScaleBar({ currentKp }: GScaleBarProps) {
  const { t } = useI18n()
  const active = kpToStormLevel(currentKp)

  function levelInfo(level: StormLevel) {
    const kp = level === 'quiet' ? 0 : level === 'G1' ? 5 : level === 'G2' ? 6 : level === 'G3' ? 7 : level === 'G4' ? 8 : 9
    const info = getStormInfo(kp, t.storm)
    if (level === 'quiet') return { ...info, shortLabel: 'G0' }
    return info
  }

  return (
    <div className="g-scale">
      <PanelHeading title={t.panels.gScale} hint={t.glossary.gScale} />
      <div className="g-scale-track">
        {G_SCALE.map((level) => {
          const info = levelInfo(level)
          const isActive = level === active
          return (
            <div
              key={level}
              className={`g-scale-segment ${isActive ? 'active' : ''}`}
              style={{ '--seg-color': info.color } as CSSProperties}
            >
              <span className="g-scale-label">{level === 'quiet' ? 'G0' : level}</span>
              <span className="g-scale-name">{info.shortLabel}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

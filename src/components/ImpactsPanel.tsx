import type { CSSProperties } from 'react'
import { useStormInfo } from '../lib/stormI18n'
import { useI18n } from '../i18n/context'
import { PanelHeading } from './Hint'

interface ImpactsPanelProps {
  kp: number
}

export function ImpactsPanel({ kp }: ImpactsPanelProps) {
  const { t } = useI18n()
  const storm = useStormInfo(kp)

  return (
    <div className="impacts-panel">
      <PanelHeading title={t.panels.impacts} hint={t.glossary.impacts} />
      <ul className="impacts-list">
        {storm.impacts.map((impact) => (
          <li key={impact} style={{ '--impact-color': storm.color } as CSSProperties}>
            {impact}
          </li>
        ))}
      </ul>
      <div className="human-impacts">
        <h4 className="human-impacts-heading">{t.panels.humanImpacts}</h4>
        <div className="human-impact-block">
          <span className="human-impact-tag">{t.panels.humanPhysical}</span>
          <p className="human-impact-text">{storm.humanImpacts.physical}</p>
        </div>
        <div className="human-impact-block">
          <span className="human-impact-tag human-impact-tag--mental">{t.panels.humanMental}</span>
          <p className="human-impact-text">{storm.humanImpacts.mental}</p>
        </div>
      </div>
    </div>
  )
}

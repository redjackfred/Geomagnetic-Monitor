import { formatKp } from '../lib/storm'
import { useStormInfo } from '../lib/stormI18n'
import { auroraLatitude, type SpaceWeatherAlert } from '../lib/noaa'
import { useI18n, interpolate } from '../i18n/context'
import { InlineTerm, PanelHeading, TermTip } from './Hint'

interface AlertsPanelProps {
  alerts: SpaceWeatherAlert[]
}

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const { t, locale } = useI18n()

  function formatAlertTime(iso: string): string {
    return new Date(iso.replace(' ', 'T') + 'Z').toLocaleString(locale === 'zh' ? 'zh-TW' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (alerts.length === 0) {
    return (
      <div className="alerts-panel">
        <PanelHeading title={t.panels.alerts} hint={t.glossary.alerts} />
        <p className="empty-note">{t.panels.noAlerts}</p>
      </div>
    )
  }

  return (
    <div className="alerts-panel">
      <PanelHeading title={t.panels.alerts} hint={t.glossary.alerts} />
      <ul className="alerts-list">
        {alerts.map((alert) => (
          <li key={`${alert.product_id}-${alert.issue_datetime}`} className={`alert-item alert-${alert.type}`}>
            <div className="alert-meta">
              <span className={`alert-type badge-${alert.type}`}>
                {t.alerts[alert.type]}
              </span>
              {alert.isGeomagnetic && (
                <span className="alert-geo-tag">
                  {t.alerts.geomagnetic}
                  <TermTip entry={t.glossary.geomagneticTag} />
                </span>
              )}
              <time className="alert-time">{formatAlertTime(alert.issue_datetime)}</time>
            </div>
            <p className="alert-summary">{alert.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface AuroraPanelProps {
  kp: number
}

export function AuroraPanel({ kp }: AuroraPanelProps) {
  const { t } = useI18n()
  const lat = auroraLatitude(kp)
  const storm = useStormInfo(kp)

  const visibility =
    kp >= 7 ? t.aurora.highMid :
    kp >= 5 ? t.aurora.highMaybeMid :
    kp >= 3 ? t.aurora.polarOnly :
    t.aurora.unlikely

  return (
    <div className="aurora-panel">
      <PanelHeading title={t.panels.aurora} hint={t.glossary.aurora} />
      <div className="aurora-stats">
        <div className="aurora-stat">
          <span className="aurora-stat-value" style={{ color: storm.color }}>
            ~{lat}°
          </span>
          <span className="aurora-stat-label">
            <InlineTerm
              label={interpolate(t.panels.auroraMinLat, { lat: String(lat), kp: formatKp(kp) })}
              hint={t.glossary.auroraLat}
            />
          </span>
        </div>
        <p className="aurora-desc">{visibility}</p>
        <p className="aurora-note">{t.panels.auroraNote}</p>
      </div>
    </div>
  )
}

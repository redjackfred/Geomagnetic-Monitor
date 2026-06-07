import { useI18n } from '../i18n/context'
import {
  STORM_COLORS,
  kpToStormLevel,
  type StormInfo,
} from './storm'
import type { Translations } from '../i18n/types'

export function getStormInfo(kp: number, storm: Translations['storm']): StormInfo {
  const level = kpToStormLevel(kp)
  const text = storm[level]
  return {
    level,
    ...STORM_COLORS[level],
    ...text,
    impacts: [...text.impacts],
    humanImpacts: { ...text.humanImpacts },
  }
}

export function useStormInfo(kp: number): StormInfo {
  const { t } = useI18n()
  return getStormInfo(kp, t.storm)
}

export { kpToStormLevel, formatKp, G_SCALE } from './storm'
export type { StormLevel, StormInfo } from './storm'

export function useFormatTime() {
  const { t } = useI18n()
  return (iso: string) =>
    new Date(iso).toLocaleString(t.locale, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
}

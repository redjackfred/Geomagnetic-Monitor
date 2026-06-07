export interface HumanEffects {
  physical: string
  mental: string
}

export interface GlossaryEntry {
  desc: string
  impacts: string
  human?: HumanEffects
}

export type GlossaryKey =
  | 'kp'
  | 'kp1m'
  | 'kp3h'
  | 'gScale'
  | 'aIndex'
  | 'f107'
  | 'sfu'
  | 'flareM'
  | 'flareX'
  | 'proton'
  | 'pca'
  | 'aurora'
  | 'auroraLat'
  | 'forecastKp'
  | 'estimated'
  | 'predicted'
  | 'swpc'
  | 'alerts'
  | 'impacts'
  | 'stormPeak'
  | 'solarPanel'
  | 'geomagneticTag'

export type Glossary = Record<GlossaryKey, GlossaryEntry>

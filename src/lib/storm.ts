export type StormLevel = 'quiet' | 'G1' | 'G2' | 'G3' | 'G4' | 'G5'

export interface HumanImpacts {
  physical: string
  mental: string
}

export interface StormInfo {
  level: StormLevel
  label: string
  shortLabel: string
  description: string
  impacts: string[]
  humanImpacts: HumanImpacts
  color: string
  glow: string
}

export const STORM_COLORS: Record<
  StormLevel,
  { color: string; glow: string }
> = {
  quiet: { color: '#4ade80', glow: 'rgba(74, 222, 128, 0.35)' },
  G1: { color: '#a3e635', glow: 'rgba(163, 230, 53, 0.35)' },
  G2: { color: '#facc15', glow: 'rgba(250, 204, 21, 0.35)' },
  G3: { color: '#fb923c', glow: 'rgba(251, 146, 60, 0.4)' },
  G4: { color: '#f87171', glow: 'rgba(248, 113, 113, 0.45)' },
  G5: { color: '#e879f9', glow: 'rgba(232, 121, 249, 0.5)' },
}

export function kpToStormLevel(kp: number): StormLevel {
  if (kp >= 9) return 'G5'
  if (kp >= 8) return 'G4'
  if (kp >= 7) return 'G3'
  if (kp >= 6) return 'G2'
  if (kp >= 5) return 'G1'
  return 'quiet'
}

export const G_SCALE: StormLevel[] = ['quiet', 'G1', 'G2', 'G3', 'G4', 'G5']

export function formatKp(kp: number): string {
  return kp.toFixed(kp % 1 === 0 ? 0 : 1)
}

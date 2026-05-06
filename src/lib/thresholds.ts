import type { SiteConfig } from './types'

export type ResultLevel = 0 | 1 | 2 | 3 | 4 | 5

export function pickResultLevel(
  guestCount: number,
  thresholds: SiteConfig['calendar_thresholds']
): ResultLevel {
  if (guestCount >= thresholds.r5) return 5
  if (guestCount >= thresholds.r4) return 4
  if (guestCount >= thresholds.r3) return 3
  if (guestCount >= thresholds.r2) return 2
  if (guestCount >= thresholds.r1) return 1
  return 0
}

export const DEFAULT_THRESHOLDS: SiteConfig['calendar_thresholds'] = {
  r0: 0,
  r1: 3,
  r2: 6,
  r3: 10,
  r4: 15,
  r5: 20,
}

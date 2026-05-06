/**
 * tokens.ts — デザインの真ソース
 *
 * 直書き禁止。色・フォント・余白・ブレイクポイントはここを参照。
 * 追加するときは type を併用して全体に伝播させる。
 */

export const COLOR = {
  bg: '#ffffff',
  fg: '#0a0a0a',
  muted: '#6b7280',
  line: '#e5e7eb',
  border: '#000000',
  accent: '#1b2244',     // 紺（ロゴ TINO 文字色）
  danger: '#c8102e',     // 赤（ロゴ Girl's Bar）
  surface: '#ffffff',
  noBusiness: 'rgb(220,220,220)',
  copyrightBg: '#000000',
  copyrightFg: '#ffffff',
} as const

export const FONT = {
  xs: 'text-[10px]',
  sm: 'text-xs',          // 12
  base: 'text-sm',        // 14
  md: 'text-base',        // 16
  lg: 'text-lg',          // 18
  xl: 'text-xl',          // 20
  tracking: {
    wide: 'tracking-[0.2em]',
    extraWide: 'tracking-[0.3em]',
  },
} as const

export const SPACE = {
  pageX: 'px-3 sm:px-4',
  sectionY: 'py-4 sm:py-8',
  cardGap: 'gap-2 sm:gap-3',
} as const

/** Tailwind ブレイクポイントに揃える（変更しない） */
export const BREAK = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

/** 出勤情報など、ぱっと見の情報密度コントロール */
export const LAYOUT = {
  pageMaxW: 'max-w-[1100px]',
  contentMaxW: 'max-w-[600px]',
  castGrid: 'grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5',
  calendarMaxW: 'max-w-[600px]',
  floorMapMaxW: 'max-w-[600px]',
} as const

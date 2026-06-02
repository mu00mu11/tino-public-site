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

/** 出勤情報など、ぱっと見の情報密度コントロール（実物互換・自然幅で中央寄せ） */
export const LAYOUT = {
  pageMaxW: 'max-w-[1100px]',
  contentMaxW: 'max-w-[600px]',
  castListMaxW: 'max-w-[360px]',          // 実物 table自然幅相当
  calendarMaxW: 'max-w-[400px]',          // 実物カレンダー幅相当
  floorMapMaxW: 'max-w-[400px]',          // 椅子↔猫10席は実物25×50で約280px
} as const

/** サイズ定数（実物互換） */
export const SIZE = {
  castPhoto: 100,                          // 実物 100x100 と一致
  seatIcon: { w: 25, h: 50 },              // 実物 25x50 と一致
  resultIcon: 30,                          // 実物 30x30 と一致
} as const

/**
 * 本日出勤キャストの順位枠（写真の外側に額縁として描く背景）
 * 1位=パステル虹 / 2位=金 / 3位=銀 / 4位=銅。5位以下は枠なし。
 * cast-rank.ts の RankFrameKey と1:1で対応させる。
 */
export const RANK_FRAME = {
  rainbow: 'linear-gradient(135deg,#ff9aa2,#ffd8a8,#fdffb6,#caffbf,#9bf6ff,#bdb2ff,#ffc6ff)',
  gold: '#d4af37',
  silver: '#c0c0c0',
  bronze: '#cd7f32',
} as const

/** 順位枠の太さ(px)。写真の外側に出す額縁幅 */
export const RANK_FRAME_WIDTH = 3

/**
 * event-palette.ts — カレンダーイベントの色・サイズ定義（真ソース）
 *
 * 背景色・文字色は同じパレットキーから選ぶ。グラデ系(虹/金)は globals.css の
 * クラスを使い、単色はここの hex をインラインで適用する。
 * POS 側 (HpEventsSection 用) の constants/event-palette.ts と色を揃えること。
 */

export type PaletteKey =
  | 'black' | 'white' | 'rainbow' | 'rainbow_vivid'
  | 'red' | 'yellow' | 'gold' | 'blue'
  | 'sakura' | 'purple' | 'tiffany' | 'champagne'
  | 'neon_pink' | 'neon_blue'

export type FontSizeKey = 'sm' | 'md' | 'lg'

export type PaletteEntry = {
  label: string
  /** 背景がグラデの場合のCSSクラス（globals.css） */
  bgClass?: string
  /** 背景が単色の場合の色 */
  bg?: string
  /** 文字色として選んだ時: グラデならクラス */
  textClass?: string
  /** 文字色として選んだ時: 単色の色 */
  text?: string
  /** ピッカーのスウォッチ表示（CSS background 値） */
  swatch: string
}

const RAINBOW_SWATCH =
  'linear-gradient(135deg,#ff6161,#e9b22d 22%,#c0ca4b 42%,#35b338 60%,#566ef3 80%,#9a27ee)'
const GOLD_SWATCH = 'linear-gradient(135deg,#b67b03,#fee9a0 60%,#b67b03)'

export const EVENT_PALETTE: Record<PaletteKey, PaletteEntry> = {
  black:         { label: '黒',           bg: '#111111', text: '#000000', swatch: '#000000' },
  white:         { label: '白',           bg: '#ffffff', text: '#ffffff', swatch: '#ffffff' },
  rainbow:       { label: '虹色(薄)',     bgClass: 'event-cell-rainbow', textClass: 'event-text-rainbow', swatch: RAINBOW_SWATCH },
  rainbow_vivid: { label: '濃い虹色',     bgClass: 'rank-rainbow',       textClass: 'event-text-rainbow', swatch: RAINBOW_SWATCH },
  red:           { label: '赤',           bg: '#fca5a5', text: '#dc2626', swatch: '#ef4444' },
  yellow:        { label: '黄色',         bg: '#fde68a', text: '#b45309', swatch: '#facc15' },
  gold:          { label: '金',           bgClass: 'event-cell-gold',    textClass: 'event-text-gold',    swatch: GOLD_SWATCH },
  blue:          { label: '青',           bg: '#93c5fd', text: '#2563eb', swatch: '#3b82f6' },
  sakura:        { label: '桜ピンク',     bg: '#fbcfe8', text: '#db2777', swatch: '#f9a8d4' },
  purple:        { label: '紫',           bg: '#ddd6fe', text: '#7c3aed', swatch: '#a855f7' },
  tiffany:       { label: 'ティファニー', bg: '#9be8dd', text: '#0d9488', swatch: '#5eead4' },
  champagne:     { label: 'シャンパン銀', bg: '#ece6d6', text: '#8a7f5c', swatch: '#e4dcc4' },
  neon_pink:     { label: 'ネオンピンク', bg: '#ff7ac1', text: '#ff1493', swatch: '#ff2d95' },
  neon_blue:     { label: 'ネオン青',     bg: '#7fe9ff', text: '#0091b8', swatch: '#00e5ff' },
}

/** 背景色で選べるキー順（Sho指定7色 → AI推奨6色） */
export const BG_KEYS: PaletteKey[] = [
  'rainbow', 'rainbow_vivid', 'red', 'yellow', 'gold', 'white', 'blue',
  'sakura', 'purple', 'tiffany', 'champagne', 'neon_pink', 'neon_blue',
]

/** 文字色で選べるキー順（黒・白を先頭に） */
export const TEXT_KEYS: PaletteKey[] = [
  'black', 'white', 'red', 'yellow', 'gold', 'blue', 'rainbow', 'rainbow_vivid',
  'sakura', 'purple', 'tiffany', 'champagne', 'neon_pink', 'neon_blue',
]

export const FONT_SIZE_CLASS: Record<FontSizeKey, string> = {
  sm: 'text-[10px] leading-tight sm:text-[11px]',
  md: 'text-sm leading-tight sm:text-base',
  lg: 'text-xl leading-tight sm:text-2xl',
}

export const FONT_SIZE_LABEL: Record<FontSizeKey, string> = { sm: '小', md: '中', lg: '大' }

function entry(key: string): PaletteEntry {
  return EVENT_PALETTE[key as PaletteKey] ?? EVENT_PALETTE.rainbow
}

/** 背景: グラデならクラス名・単色なら '' */
export function bgClassOf(key: string): string {
  return entry(key).bgClass ?? ''
}
/** 背景: 単色の色（グラデなら undefined） */
export function bgColorOf(key: string): string | undefined {
  const e = entry(key)
  return e.bgClass ? undefined : e.bg
}
/** 文字: グラデ文字クラス（単色なら ''） */
export function textClassOf(key: string): string {
  return entry(key).textClass ?? ''
}
/** 文字: 単色の色（グラデなら undefined） */
export function textColorOf(key: string): string | undefined {
  const e = entry(key)
  return e.textClass ? undefined : e.text
}
/** フォントサイズクラス */
export function fontSizeClassOf(key: string): string {
  return FONT_SIZE_CLASS[(key as FontSizeKey)] ?? FONT_SIZE_CLASS.md
}

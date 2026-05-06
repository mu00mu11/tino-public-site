/**
 * sales-rank.ts — カレンダー日次レベル仕様（参照用ドキュメント）
 *
 * 実際の判定ロジックは Supabase ビュー `public_daily_stats_view` 内の CASE文。
 * 売上額は anon に漏らさないため、ビューで level/bg だけ計算して公開。
 *
 * 閾値変更したいときは 以下2箇所:
 *   1. POS 側 migration (`pos-app/supabase/migrations/`) で view を CREATE OR REPLACE
 *   2. このコメントを最新値に書き換え
 */

export const SALES_THRESHOLDS_DOC = {
  rainbow:    { minYen: 400000, level: 5, face: 'pink-smile', bg: 'rainbow' },
  gold:       { minYen: 300000, level: 5, face: 'pink-smile', bg: 'gold' },
  yellow:     { minYen: 100000, maxYen: 199999, level: 4, face: 'yellow-smile', bg: null },
  light_blue: { maxYen: 49999,  level: 2, face: 'sad-cyan', bg: null },
  normal:     { level: 3, face: 'plain', bg: null, note: '上記以外（5万超〜10万・20万〜30万）' },
  closed:     { level: 0, face: null, bg: null, note: '営業なし日' },
} as const

export type CalendarLevel = 0 | 2 | 3 | 4 | 5
export type CalendarBg = 'rainbow' | 'gold' | null

/** result png ファイル番号への変換 (level → result?.png) */
export function levelToResultIndex(level: CalendarLevel): number {
  // result0=白, result2=水色, result3=普通, result4=黄ニコ, result5=ピンクニコ
  return level
}

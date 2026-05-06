/**
 * cast-rank.ts — キャスト個別の「今日の表情」スコア計算
 *
 * Sho 指示 (2026-05-07):
 *  - 表情は 黄色ニコ(result4) と ピンクニコニコ(result5) の2種だけ使う
 *  - 他の表情（つらい/しょんぼり/普通）は使わない（モチベ下がる）
 *  - スコア計算式は未確定 → 仮置き
 *  - 当面は非表示。Sho が表示したくなったら CastSection の hidden を外す
 */

import type { TodayAttendance } from '@/lib/types'

/** 仮スコア式: ドリンク + ショット + ボトル×3 (Sho 確認後に確定) */
export const CAST_SCORE = {
  drink: 1,
  shot: 1,
  bottle: 3,
} as const

/** スコア閾値 (Sho 確認後に確定) */
export const CAST_FACE_THRESHOLD = {
  pink: 8,    // この値以上で result5 (ピンクニコニコ)
  yellow: 1,  // この値以上で result4 (黄色ニコ)
  // 未満 → 表情なし
} as const

export type CastFace = 4 | 5 | null

export function calcCastFace(att: Pick<TodayAttendance, 'drink_count' | 'shot_count' | 'bottle_count'>): CastFace {
  const score =
    att.drink_count * CAST_SCORE.drink +
    att.shot_count  * CAST_SCORE.shot +
    att.bottle_count * CAST_SCORE.bottle
  if (score >= CAST_FACE_THRESHOLD.pink)   return 5
  if (score >= CAST_FACE_THRESHOLD.yellow) return 4
  return null
}

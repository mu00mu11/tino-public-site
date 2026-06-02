/**
 * cast-rank.ts — 本日出勤キャストのスコア計算と順位付け
 *
 * 2つの用途を1つのスコア式で賄う:
 *  1. 順位枠 (calcCastRanks) … ドリンク/ショット/シャンパンの多い順に 1〜4位へ色枠
 *  2. 表情     (calcCastFace) … 黄色ニコ / ピンクニコ（当面 CastSection 側で非表示）
 *
 * Sho 指示:
 *  - 2026-05-07: 表情は result4(黄) / result5(ピンク) の2種のみ。当面非表示
 *  - 2026-06-02: 順位枠を新設。シャンパン1本 = ドリンク5杯ぶん (bottle:5) で重み付け
 */

import type { TodayAttendance } from '@/lib/types'

/** スコア式: ドリンク + ショット + シャンパン(ボトル)×5 */
export const CAST_SCORE = {
  drink: 1,
  shot: 1,
  bottle: 5,
} as const

type ScoreSource = Pick<TodayAttendance, 'drink_count' | 'shot_count' | 'bottle_count'>

/** 1キャストの合計スコア（順位・表情で共通利用） */
export function calcCastScore(att: ScoreSource): number {
  return (
    att.drink_count * CAST_SCORE.drink +
    att.shot_count * CAST_SCORE.shot +
    att.bottle_count * CAST_SCORE.bottle
  )
}

/* ── 順位枠 ─────────────────────────────────── */

/** 色枠を付ける最上位。これを超える順位は枠なし（5位以下は印なし） */
export const RANK_FRAME_MAX = 4

export type RankFrameKey = 'rainbow' | 'gold' | 'silver' | 'bronze'

const RANK_TO_FRAME: Record<number, RankFrameKey> = {
  1: 'rainbow',
  2: 'gold',
  3: 'silver',
  4: 'bronze',
}

/** 順位 → 枠キー。5位以下・null はキーなし（枠を出さない） */
export function rankToFrameKey(rank: number | null): RankFrameKey | null {
  if (rank === null || rank > RANK_FRAME_MAX) return null
  return RANK_TO_FRAME[rank] ?? null
}

/**
 * slug → 順位 の Map を返す。
 *  - スコア0は順位なし（飲んでいない子に枠を付けない）
 *  - 同点は同順位（2人が1位なら両方1位、次は3位）= 競技順位方式
 *  - 入力は破壊しない（コピーしてソート）
 */
export function calcCastRanks(
  casts: ReadonlyArray<TodayAttendance>,
): Map<string, number> {
  const ranked = casts
    .map(c => ({ slug: c.slug, score: calcCastScore(c) }))
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)

  const result = new Map<string, number>()
  let prevScore: number | null = null
  let prevRank = 0

  ranked.forEach((c, index) => {
    const rank = c.score === prevScore ? prevRank : index + 1
    result.set(c.slug, rank)
    prevScore = c.score
    prevRank = rank
  })

  return result
}

/* ── 表情（当面非表示）─────────────────────────── */

/** スコア閾値 (Sho 確認後に確定) */
export const CAST_FACE_THRESHOLD = {
  pink: 8, // この値以上で result5 (ピンクニコニコ)
  yellow: 1, // この値以上で result4 (黄色ニコ)
} as const

export type CastFace = 4 | 5 | null

export function calcCastFace(att: ScoreSource): CastFace {
  const score = calcCastScore(att)
  if (score >= CAST_FACE_THRESHOLD.pink) return 5
  if (score >= CAST_FACE_THRESHOLD.yellow) return 4
  return null
}

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { COLOR, FONT, SIZE, RANK_FRAME, RANK_FRAME_WIDTH } from '@/lib/tokens'
import { calcCastFace, calcCastRanks, rankToFrameKey } from '@/lib/cast-rank'
import type { TodayAttendance, SiteConfig } from '@/lib/types'

const CELL_BORDER = `1px solid ${COLOR.border}`
// 縦余白は順位枠ぶんゆとりを持たせる（横は実物 SUMMARY.md L92 と一致）
const CELL_PADDING = '7px 8px'

/**
 * Sho 指示 (2026-05-07):
 *  - キャスト表情(result4=黄ニコ / result5=ピンクニコ) を実装するが当面は非表示
 *  - スコア閾値が決まったら SHOW_CAST_FACE=true で起動
 */
const SHOW_CAST_FACE = false

/** 写真セル: 順位枠 + 写真 + (任意で)表情オーバーレイ */
function CastPhoto({
  cast,
  frameBg,
}: {
  cast: TodayAttendance
  frameBg: string | null
}) {
  const photo = (
    <div className="relative bg-white" style={{ width: SIZE.castPhoto, height: SIZE.castPhoto }}>
      <Image
        src={cast.photo_url || '/logo.jpg'}
        alt={cast.display_name}
        fill
        sizes={`${SIZE.castPhoto}px`}
        className={cast.photo_url ? 'object-cover' : 'object-contain p-2'}
        unoptimized
      />
      {SHOW_CAST_FACE && <CastFaceOverlay cast={cast} />}
    </div>
  )

  if (!frameBg) return photo

  // 写真の外側に額縁（padding ぶんが枠として見える）
  return (
    <div style={{ display: 'inline-block', lineHeight: 0, padding: RANK_FRAME_WIDTH, background: frameBg }}>
      {photo}
    </div>
  )
}

/** 表情ニコちゃん（当面非表示・SHOW_CAST_FACE=true で起動） */
function CastFaceOverlay({ cast }: { cast: TodayAttendance }) {
  const face = calcCastFace(cast)
  if (face === null) return null
  return (
    <div className="pointer-events-none absolute right-0 top-0">
      <Image src={`/result/result${face}.png`} alt="" width={28} height={28} className="block" unoptimized />
    </div>
  )
}

/** 名前・出勤時刻・ドリンク/ショット/ボトル本数 */
function CastInfo({
  cast,
  showDrink,
  showShot,
}: {
  cast: TodayAttendance
  showDrink: boolean
  showShot: boolean
}) {
  return (
    <>
      <div className={FONT.base}>
        <b>{cast.display_name}</b>
        {cast.display_age != null && <> ({cast.display_age})</>}
      </div>
      {cast.clock_in && <div className={FONT.sm}>出勤 {cast.clock_in}〜</div>}
      {showDrink && <div className={FONT.sm}>ドリンク：{cast.drink_count}</div>}
      {showShot && <div className={FONT.sm}>ショット：{cast.shot_count}</div>}
      {cast.bottle_count > 0 && <div className={FONT.sm}>ボトル：{cast.bottle_count}</div>}
    </>
  )
}

const cellStyle: CSSProperties = {
  border: CELL_BORDER,
  padding: CELL_PADDING,
  textAlign: 'center',
  verticalAlign: 'middle',
}

export function CastSection({
  todayCasts,
  config,
}: {
  todayCasts: TodayAttendance[]
  config: SiteConfig
}) {
  if (todayCasts.length === 0) {
    return null
  }

  const ranks = calcCastRanks(todayCasts)

  return (
    <section className="px-3 py-4">
      <SectionHeading>TODAY · CAST</SectionHeading>
      <table className="mx-auto" style={{ borderCollapse: 'collapse', margin: '15px auto' }}>
        <tbody>
          {todayCasts.map(cast => {
            const frameKey = rankToFrameKey(ranks.get(cast.slug) ?? null)
            const frameBg = frameKey ? RANK_FRAME[frameKey] : null
            return (
              <tr key={cast.slug}>
                <td style={cellStyle}>
                  <CastPhoto cast={cast} frameBg={frameBg} />
                </td>
                <td style={cellStyle}>
                  <CastInfo cast={cast} showDrink={config.show_drink_count} showShot={config.show_shot_count} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

import Image from 'next/image'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { COLOR, FONT, SIZE } from '@/lib/tokens'
import { calcCastFace } from '@/lib/cast-rank'
import type { TodayAttendance, SiteConfig } from '@/lib/types'

const CELL_BORDER = `1px solid ${COLOR.border}`
const CELL_PADDING = '3px 8px'  // 実物 SUMMARY.md L92 と一致

/**
 * Sho 指示 (2026-05-07):
 *  - キャスト表情(result4=黄ニコ / result5=ピンクニコ) を実装するが当面は非表示
 *  - スコア閾値が決まったら SHOW_CAST_FACE=true で起動
 */
const SHOW_CAST_FACE = false

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

  const showDrink = config.show_drink_count
  const showShot = config.show_shot_count

  return (
    <section className="px-3 py-4">
      <SectionHeading>TODAY · CAST</SectionHeading>
      <table className="mx-auto" style={{ borderCollapse: 'collapse', margin: '15px auto' }}>
        <tbody>
          {todayCasts.map(cast => (
            <tr key={cast.slug}>
              <td style={{ border: CELL_BORDER, padding: CELL_PADDING, textAlign: 'center', verticalAlign: 'middle' }}>
                <div className="relative bg-white" style={{ width: SIZE.castPhoto, height: SIZE.castPhoto }}>
                  <Image
                    src={cast.photo_url || '/logo.jpg'}
                    alt={cast.display_name}
                    fill
                    sizes={`${SIZE.castPhoto}px`}
                    className={cast.photo_url ? 'object-cover' : 'object-contain p-2'}
                    unoptimized
                  />
                  {/* Sho 指示: 当面非表示 (SHOW_CAST_FACE=true で起動) */}
                  {SHOW_CAST_FACE && (() => {
                    const face = calcCastFace(cast)
                    if (face === null) return null
                    return (
                      <div className="pointer-events-none absolute right-0 top-0">
                        <Image
                          src={`/result/result${face}.png`}
                          alt=""
                          width={28}
                          height={28}
                          className="block"
                          unoptimized
                        />
                      </div>
                    )
                  })()}
                </div>
              </td>
              <td style={{ border: CELL_BORDER, padding: CELL_PADDING, textAlign: 'center', verticalAlign: 'middle' }}>
                <div className={FONT.base}>
                  <b>{cast.display_name}</b>
                  {cast.display_age != null && <> ({cast.display_age})</>}
                </div>
                {cast.clock_in && (
                  <div className={FONT.sm}>出勤 {cast.clock_in}〜</div>
                )}
                {showDrink && <div className={FONT.sm}>ドリンク：{cast.drink_count}</div>}
                {showShot && <div className={FONT.sm}>ショット：{cast.shot_count}</div>}
                {cast.bottle_count > 0 && <div className={FONT.sm}>ボトル：{cast.bottle_count}</div>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

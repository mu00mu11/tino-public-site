import Image from 'next/image'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { COLOR, FONT, SIZE } from '@/lib/tokens'
import type { TodayAttendance, SiteConfig } from '@/lib/types'

const CELL_BORDER = `1px solid ${COLOR.border}`
const CELL_PADDING = '3px 8px'  // 実物 SUMMARY.md L92 と一致

export function CastSection({
  todayCasts,
  config,
}: {
  todayCasts: TodayAttendance[]
  config: SiteConfig
}) {
  if (todayCasts.length === 0) {
    return (
      <section className="px-4 py-6 text-center text-sm" style={{ color: COLOR.muted }}>
        本日の出勤情報は更新中です
      </section>
    )
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
                    unoptimized={!cast.photo_url}
                  />
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

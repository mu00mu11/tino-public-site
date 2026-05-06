import Image from 'next/image'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { COLOR, FONT, LAYOUT, SIZE } from '@/lib/tokens'
import type { TodayAttendance, SiteConfig } from '@/lib/types'

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
    <section className="px-3 py-4 sm:py-6">
      <div className={`mx-auto w-full ${LAYOUT.castListMaxW}`}>
        <SectionHeading>TODAY · CAST</SectionHeading>
        <ul className="flex flex-col" style={{ borderColor: COLOR.border }}>
          {todayCasts.map((cast, idx) => (
            <li
              key={cast.slug}
              className="flex items-stretch gap-2 sm:gap-3"
              style={{
                borderTop: `1px solid ${COLOR.border}`,
                borderBottom: idx === todayCasts.length - 1 ? `1px solid ${COLOR.border}` : 'none',
              }}
            >
              <div
                className="relative shrink-0 bg-white"
                style={{
                  width: SIZE.castPhoto,
                  height: SIZE.castPhoto,
                  borderRight: `1px solid ${COLOR.border}`,
                }}
              >
                <Image
                  src={cast.photo_url || '/logo.jpg'}
                  alt={cast.display_name}
                  fill
                  sizes={`${SIZE.castPhoto}px`}
                  className={cast.photo_url ? 'object-cover' : 'object-contain p-2'}
                  unoptimized={!cast.photo_url}
                />
              </div>
              <div className="flex flex-1 flex-col justify-center py-1.5 pr-2">
                <div className={`${FONT.base} sm:${FONT.md}`}>
                  <b>{cast.display_name}</b>
                  {cast.display_age != null && (
                    <span className={`ml-1 ${FONT.sm} font-normal`}>({cast.display_age})</span>
                  )}
                </div>
                {cast.clock_in && (
                  <div className={`${FONT.sm}`} style={{ color: COLOR.muted }}>
                    出勤 {cast.clock_in}〜
                  </div>
                )}
                {(showDrink || showShot) && (
                  <div className={`flex flex-wrap gap-x-2 ${FONT.sm}`}>
                    {showDrink && <span>ドリンク：{cast.drink_count}</span>}
                    {showShot && <span>ショット：{cast.shot_count}</span>}
                    {cast.bottle_count > 0 && <span>ボトル：{cast.bottle_count}</span>}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

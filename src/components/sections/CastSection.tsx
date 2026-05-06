import Image from 'next/image'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { COLOR, FONT, LAYOUT } from '@/lib/tokens'
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
      <div className={`mx-auto w-full ${LAYOUT.pageMaxW}`}>
        <SectionHeading>TODAY · CAST</SectionHeading>
        <ul className={LAYOUT.castGrid}>
          {todayCasts.map(cast => (
            <li
              key={cast.slug}
              className="overflow-hidden border bg-white"
              style={{ borderColor: COLOR.border }}
            >
              <div className="relative aspect-[3/4] w-full bg-white">
                <Image
                  src={cast.photo_url || '/logo.jpg'}
                  alt={cast.display_name}
                  fill
                  sizes="(max-width:640px) 50vw, (max-width:768px) 33vw, (max-width:1024px) 25vw, 20vw"
                  className={cast.photo_url ? 'object-cover' : 'object-contain p-3'}
                  unoptimized={!cast.photo_url}
                />
              </div>
              <div className="border-t px-2 py-1.5 text-center sm:py-2"
                   style={{ borderColor: COLOR.border }}>
                <div className={`${FONT.base} font-bold sm:${FONT.md}`}>
                  {cast.display_name}
                  {cast.display_age != null && (
                    <span className={`ml-1 ${FONT.sm} font-normal`}>({cast.display_age})</span>
                  )}
                </div>
                {cast.clock_in && (
                  <div className={`mt-0.5 ${FONT.xs} sm:${FONT.sm}`} style={{ color: COLOR.muted }}>
                    出勤 {cast.clock_in}〜
                  </div>
                )}
                {(showDrink || showShot) && (
                  <div className={`mt-1 flex flex-wrap justify-center gap-x-2 ${FONT.xs}`}>
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

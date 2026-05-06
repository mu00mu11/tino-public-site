import Image from 'next/image'
import type { TodayAttendance } from '@/lib/types'

export function CastGrid({ todayCasts }: { todayCasts: TodayAttendance[] }) {
  if (todayCasts.length === 0) {
    return (
      <section className="px-4 py-6 text-center text-sm text-[#6b7280]">
        本日の出勤情報は更新中です
      </section>
    )
  }

  return (
    <section className="px-3 py-4 sm:py-6">
      <div className="mx-auto w-full max-w-[1100px]">
        <h2 className="mb-3 text-center text-xs tracking-[0.3em] text-[#6b7280] sm:text-sm">
          TODAY · CAST
        </h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5">
          {todayCasts.map(cast => (
            <li
              key={cast.slug}
              className="overflow-hidden border border-black bg-white"
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
              <div className="border-t border-black px-2 py-1.5 text-center sm:py-2">
                <div className="text-sm font-bold sm:text-base">
                  {cast.display_name}
                  {cast.display_age != null && (
                    <span className="ml-1 text-xs font-normal">({cast.display_age})</span>
                  )}
                </div>
                {cast.clock_in && (
                  <div className="mt-0.5 text-[10px] text-[#6b7280] sm:text-xs">
                    出勤 {cast.clock_in}〜
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

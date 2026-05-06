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
    <section className="px-3 py-4">
      <table className="mx-auto border-collapse">
        <tbody>
          {todayCasts.map(cast => (
            <tr key={cast.slug} className="border border-black">
              <td className="border border-black p-1 align-middle">
                <div className="relative w-[100px] h-[100px] bg-white">
                  <Image
                    src={cast.photo_url || '/logo.jpg'}
                    alt={cast.display_name}
                    fill
                    sizes="100px"
                    className={cast.photo_url ? 'object-cover' : 'object-contain p-2'}
                    unoptimized={!cast.photo_url}
                  />
                </div>
              </td>
              <td className="border border-black p-2 text-left align-middle min-w-[180px]">
                <b>{cast.display_name}</b>
                {cast.display_age != null && <> ({cast.display_age})</>}
                {cast.clock_in && (
                  <>
                    <br />
                    <span className="text-xs text-[#6b7280]">
                      出勤 {cast.clock_in}〜
                    </span>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

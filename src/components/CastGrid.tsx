'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { PublicCast, TodayAttendance } from '@/lib/types'

type Tab = 'all' | 'today'

export function CastGrid({
  allCasts,
  todayCasts,
}: {
  allCasts: PublicCast[]
  todayCasts: TodayAttendance[]
}) {
  const [tab, setTab] = useState<Tab>('today')

  const todaySlugs = useMemo(
    () => new Set(todayCasts.map(c => c.slug)),
    [todayCasts]
  )

  const display = tab === 'today'
    ? allCasts.filter(c => todaySlugs.has(c.slug))
    : allCasts

  return (
    <section className="px-4 py-8 bg-[#f5f6fa]">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-medium tracking-[0.2em]">CAST</h2>
          <div className="flex gap-1 rounded-full border border-[#e5e7eb] bg-white p-1 text-xs">
            <button
              onClick={() => setTab('today')}
              className={`px-3 py-1 rounded-full transition ${
                tab === 'today'
                  ? 'bg-[#1b2244] text-white'
                  : 'text-[#6b7280] hover:text-[#0a0a0a]'
              }`}
            >
              本日出勤
            </button>
            <button
              onClick={() => setTab('all')}
              className={`px-3 py-1 rounded-full transition ${
                tab === 'all'
                  ? 'bg-[#1b2244] text-white'
                  : 'text-[#6b7280] hover:text-[#0a0a0a]'
              }`}
            >
              全員
            </button>
          </div>
        </div>

        {display.length === 0 ? (
          <p className="text-center text-sm text-[#6b7280] py-12">
            {tab === 'today' ? '本日出勤予定のキャスト情報は更新中です' : 'キャスト情報は準備中です'}
          </p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {display.map(cast => (
              <li
                key={cast.slug}
                className="bg-white rounded-md overflow-hidden border border-[#e5e7eb]"
              >
                <div className="relative w-full aspect-[3/4] bg-[#f5f6fa]">
                  <Image
                    src={cast.photo_url || '/logo.jpg'}
                    alt={cast.display_name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className={cast.photo_url ? 'object-cover' : 'object-contain p-6'}
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">
                    {cast.display_name}
                    {cast.display_age != null && (
                      <span className="ml-1 text-xs text-[#6b7280]">
                        ({cast.display_age})
                      </span>
                    )}
                  </p>
                  {tab === 'today' && (
                    <p className="text-[10px] text-[#1b2244] mt-1">
                      ● 本日出勤
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

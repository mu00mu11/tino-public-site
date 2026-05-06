import Image from 'next/image'
import { pickResultLevel, type ResultLevel } from '@/lib/thresholds'
import type { DailyStats, SiteConfig } from '@/lib/types'

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

function buildMonthGrid(year: number, month0: number): Array<{ date: number; isCurrentMonth: boolean; iso: string; weekday: number }> {
  const first = new Date(year, month0, 1)
  const last = new Date(year, month0 + 1, 0)
  const startWeekday = first.getDay()
  const endDate = last.getDate()
  const cells: Array<{ date: number; isCurrentMonth: boolean; iso: string; weekday: number }> = []
  for (let i = 0; i < startWeekday; i++) {
    cells.push({ date: 0, isCurrentMonth: false, iso: '', weekday: i })
  }
  for (let d = 1; d <= endDate; d++) {
    const dt = new Date(year, month0, d)
    cells.push({
      date: d,
      isCurrentMonth: true,
      iso: `${year}-${String(month0 + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      weekday: dt.getDay(),
    })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ date: 0, isCurrentMonth: false, iso: '', weekday: cells.length % 7 })
  }
  return cells
}

export function ProfitCalendar({
  stats,
  thresholds,
}: {
  stats: DailyStats[]
  thresholds: SiteConfig['calendar_thresholds']
}) {
  const today = new Date()
  const year = today.getFullYear()
  const month0 = today.getMonth()
  const cells = buildMonthGrid(year, month0)
  const statsMap = new Map(stats.map(s => [s.business_date, s]))
  const monthLabel = `${year}年${month0 + 1}月`
  const todayIso = `${year}-${String(month0 + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // 月最高客数（rank-best 虹色用）
  const monthPrefix = `${year}-${String(month0 + 1).padStart(2, '0')}`
  const maxGuest = Math.max(0, ...stats
    .filter(s => s.business_date.startsWith(monthPrefix))
    .map(s => s.guest_count))

  return (
    <section className="px-3 py-4">
      <div className="text-center mb-2 text-sm">{monthLabel}</div>
      <table className="mx-auto border-collapse">
        <thead>
          <tr>
            {WEEKDAY_LABELS.map((w, i) => (
              <th
                key={`h-${i}`}
                className="border border-black px-2 py-1 text-xs"
              >
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, weekIdx) => {
            const week = cells.slice(weekIdx * 7, weekIdx * 7 + 7)
            return (
              <tr key={`w-${weekIdx}`}>
                {week.map((cell, i) => {
                  if (!cell.isCurrentMonth) {
                    return (
                      <td
                        key={`b-${weekIdx}-${i}`}
                        className="border border-black w-12 h-14"
                        style={{ background: 'rgb(220,220,220)' }}
                      />
                    )
                  }
                  const stat = statsMap.get(cell.iso)
                  const hasData = !!stat
                  const level: ResultLevel = stat ? pickResultLevel(stat.guest_count, thresholds) : 0
                  const isFriday = cell.weekday === 5
                  const isBest = hasData && stat.guest_count > 0 && stat.guest_count === maxGuest
                  const isFuture = cell.iso > todayIso
                  const cellClass = isBest ? 'rank-best' : isFriday ? 'rank-friday' : ''
                  return (
                    <td
                      key={`d-${weekIdx}-${i}`}
                      className={`border border-black w-12 h-14 text-center align-top ${cellClass}`}
                      style={
                        !hasData && !isFuture && !isFriday && !isBest
                          ? { background: 'rgb(220,220,220)' }
                          : undefined
                      }
                    >
                      <div className="text-[10px] leading-tight pt-1">
                        {cell.date}
                      </div>
                      {hasData && !isFuture ? (
                        <div className="flex flex-col items-center justify-center mt-0.5">
                          <Image
                            src={`/result/result${level}.png`}
                            alt={`level ${level}`}
                            width={30}
                            height={30}
                            className="block"
                            unoptimized
                          />
                          <span className="text-[10px] leading-none mt-0.5">
                            {stat.guest_count}人
                          </span>
                        </div>
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

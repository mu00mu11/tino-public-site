import { pickResultLevel, type ResultLevel } from '@/lib/thresholds'
import type { DailyStats, SiteConfig } from '@/lib/types'

const RESULT_EMOJI: Record<ResultLevel, string> = {
  0: '😞',
  1: '😐',
  2: '🙂',
  3: '😊',
  4: '😄',
  5: '😍',
}

const RESULT_LABEL: Record<ResultLevel, string> = {
  0: '少',
  1: 'やや少',
  2: '普通',
  3: '好調',
  4: '繁盛',
  5: '満員',
}

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

  // Find max guest count for current month (for "best day" highlight)
  const maxGuest = Math.max(0, ...stats
    .filter(s => s.business_date.startsWith(`${year}-${String(month0 + 1).padStart(2, '0')}`))
    .map(s => s.guest_count))

  return (
    <section className="px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-medium tracking-[0.2em]">CALENDAR</h2>
          <span className="text-xs text-[#6b7280]">{monthLabel}</span>
        </div>
        <div className="grid grid-cols-7 gap-px bg-[#e5e7eb] rounded-md overflow-hidden border border-[#e5e7eb]">
          {WEEKDAY_LABELS.map((w, i) => (
            <div
              key={`h-${i}`}
              className={`bg-white text-center text-[10px] py-1 ${
                i === 0 ? 'text-[#c8102e]' : i === 6 ? 'text-[#1b2244]' : 'text-[#6b7280]'
              }`}
            >
              {w}
            </div>
          ))}
          {cells.map((cell, i) => {
            if (!cell.isCurrentMonth) {
              return <div key={`b-${i}`} className="bg-[#fafafa] aspect-square" />
            }
            const stat = statsMap.get(cell.iso)
            const hasData = !!stat
            const level = stat ? pickResultLevel(stat.guest_count, thresholds) : 0
            const isFriday = cell.weekday === 5
            const isBest = hasData && stat.guest_count > 0 && stat.guest_count === maxGuest
            const isFuture = cell.iso > new Date().toISOString().slice(0, 10)
            return (
              <div
                key={`d-${i}`}
                className={`relative aspect-square bg-white flex flex-col items-center justify-center ${
                  isBest ? 'rank-best' : isFriday ? 'rank-friday' : ''
                }`}
                title={hasData ? `${cell.iso} · ${stat.guest_count}人 · ${RESULT_LABEL[level]}` : cell.iso}
              >
                <span className={`absolute top-1 left-1 text-[9px] ${
                  isBest || isFriday ? 'text-white' : cell.weekday === 0 ? 'text-[#c8102e]' : 'text-[#0a0a0a]'
                }`}>
                  {cell.date}
                </span>
                {hasData ? (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-base sm:text-lg" aria-hidden>
                      {RESULT_EMOJI[level]}
                    </span>
                    <span className={`text-[9px] sm:text-[10px] ${
                      isBest || isFriday ? 'text-white' : 'text-[#6b7280]'
                    }`}>
                      {stat.guest_count}人
                    </span>
                  </div>
                ) : (
                  <span className={`text-[10px] ${
                    isFuture ? 'text-[#d1d5db]' : 'text-[#9ca3af]'
                  }`}>
                    {isFuture ? '' : '休'}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

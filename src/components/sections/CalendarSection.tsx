import Image from 'next/image'
import { pickResultLevel, type ResultLevel } from '@/lib/thresholds'
import { COLOR, LAYOUT } from '@/lib/tokens'
import type { DailyStats, SiteConfig } from '@/lib/types'

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

function buildMonthGrid(year: number, month0: number) {
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

export function CalendarSection({
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
  const monthPrefix = `${year}-${String(month0 + 1).padStart(2, '0')}`
  const maxGuest = Math.max(0, ...stats.filter(s => s.business_date.startsWith(monthPrefix)).map(s => s.guest_count))

  return (
    <section className="px-3 py-5 sm:py-8">
      <div className={`mx-auto w-full ${LAYOUT.calendarMaxW}`}>
        <div className="mb-2 text-center text-sm tracking-wider sm:text-base">{monthLabel}</div>
        <div className="grid grid-cols-7 border" style={{ borderColor: COLOR.border }}>
          {WEEKDAY_LABELS.map((w, i) => (
            <div
              key={`h-${i}`}
              className={`bg-white py-1 text-center text-[10px] sm:text-xs ${i < 6 ? 'border-r' : ''}`}
              style={{
                borderColor: COLOR.border,
                borderBottom: `1px solid ${COLOR.border}`,
                color: i === 0 ? COLOR.danger : i === 6 ? COLOR.accent : COLOR.fg,
              }}
            >
              {w}
            </div>
          ))}
          {cells.map((cell, i) => {
            const isLastCol = (i + 1) % 7 === 0
            const isLastRow = i >= cells.length - 7
            const borderRight = !isLastCol ? `1px solid ${COLOR.border}` : 'none'
            const borderBottom = !isLastRow ? `1px solid ${COLOR.border}` : 'none'
            if (!cell.isCurrentMonth) {
              return (
                <div
                  key={`b-${i}`}
                  className="aspect-square"
                  style={{ background: COLOR.noBusiness, borderRight, borderBottom }}
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
            const dateColor = isBest || isFriday
              ? '#fff'
              : cell.weekday === 0 ? COLOR.danger
              : cell.weekday === 6 ? COLOR.accent
              : COLOR.fg
            const cellBg = !hasData && !isFuture && !isFriday && !isBest ? COLOR.noBusiness : undefined
            return (
              <div
                key={`d-${i}`}
                className={`relative aspect-square overflow-hidden ${cellClass}`}
                style={{ background: cellBg, borderRight, borderBottom }}
              >
                <div className="absolute left-1 top-0.5 text-[9px] sm:text-[10px]" style={{ color: dateColor }}>
                  {cell.date}
                </div>
                {hasData && !isFuture ? (
                  <div className="flex h-full flex-col items-center justify-center pt-2">
                    <div className="relative aspect-square w-[55%] max-w-[30px]">
                      <Image
                        src={`/result/result${level}.png`}
                        alt={`level ${level}`}
                        fill
                        sizes="30px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span
                      className="text-[9px] leading-none sm:text-[10px]"
                      style={{ color: isBest || isFriday ? '#fff' : COLOR.fg }}
                    >
                      {stat.guest_count}人
                    </span>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

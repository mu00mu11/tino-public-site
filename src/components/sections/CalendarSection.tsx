import Image from 'next/image'
import { COLOR, LAYOUT } from '@/lib/tokens'
import { eventsInMonth, eventOnDate } from '@/lib/calendar-events'
import { bgClassOf, bgColorOf, textClassOf, textColorOf, fontSizeClassOf } from '@/lib/event-palette'
import type { DailyStats, SiteEvent } from '@/lib/types'

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

function salesBgClass(bg: DailyStats['bg']): string {
  if (bg === 'rainbow') return 'rank-rainbow'
  if (bg === 'gold') return 'rank-gold'
  return ''
}

export function CalendarSection({ stats, events = [] }: { stats: DailyStats[]; events?: SiteEvent[] }) {
  const today = new Date()
  const year = today.getFullYear()
  const month0 = today.getMonth()
  const cells = buildMonthGrid(year, month0)
  const statsMap = new Map(stats.map(s => [s.business_date, s]))
  const monthLabel = `${year}年${month0 + 1}月`
  const todayIso = `${year}-${String(month0 + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const monthEvents = eventsInMonth(events, year, month0)

  return (
    <section className="px-3 py-5 sm:py-8">
      <div className={`mx-auto w-full ${LAYOUT.calendarMaxW}`}>
        <div className="mb-2 text-center text-sm tracking-wider sm:text-base">{monthLabel}</div>

        <div className="grid grid-cols-7 border" style={{ borderColor: COLOR.border }}>
          {WEEKDAY_LABELS.map((w, i) => (
            <div
              key={`h-${i}`}
              className="bg-white py-1 text-center text-[10px] sm:text-xs"
              style={{
                borderRight: i < 6 ? `1px solid ${COLOR.border}` : 'none',
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
            const isFuture = cell.iso > todayIso
            // 灰色(営業外)は「過去の休みの日」だけ。今日はデータが溜まるまで白＝営業中に見せる
            const isPast = cell.iso < todayIso
            const ev = eventOnDate(monthEvents, cell.iso)
            const hideLevel = !!ev?.hide_level
            const hasData = !!stat && stat.level > 0 && !hideLevel
            // イベント日: パレット背景 / それ以外: 売上ランク背景
            const cellClass = ev ? bgClassOf(ev.bg_color) : (stat ? salesBgClass(stat.bg) : '')
            const eventCellBg = ev ? bgColorOf(ev.bg_color) : undefined
            // 売上ランク（濃い虹/金）の日だけ日付を白に
            const isSalesHighlight = !ev && !!stat?.bg
            const dateColor = isSalesHighlight
              ? '#fff'
              : cell.weekday === 0 ? COLOR.danger
              : cell.weekday === 6 ? COLOR.accent
              : COLOR.fg
            const cellBg = ev
              ? eventCellBg
              : (!hasData && isPast && !isSalesHighlight ? COLOR.noBusiness : undefined)
            return (
              <div
                key={`d-${i}`}
                className={`relative aspect-square overflow-hidden ${cellClass}`}
                style={{ background: cellBg, borderRight, borderBottom }}
              >
                <div className="absolute left-1 top-0.5 text-[9px] sm:text-[10px]" style={{ color: dateColor }}>
                  {cell.date}
                </div>

                {ev ? (
                  // イベント日: タイトルを選択色・太字・選択サイズで表示
                  <div className="flex h-full flex-col items-center justify-center px-0.5 pt-2">
                    <span
                      className={`break-words text-center font-bold ${fontSizeClassOf(ev.font_size)} ${textClassOf(ev.text_color)}`}
                      style={{ color: textColorOf(ev.text_color) }}
                    >
                      {ev.title}
                    </span>
                    {!hideLevel && hasData && !isFuture ? (
                      <span className="mt-0.5 text-[9px] leading-none" style={{ color: COLOR.fg }}>
                        {stat!.guest_count}人
                      </span>
                    ) : null}
                  </div>
                ) : hasData && !isFuture ? (
                  <div className="flex h-full flex-col items-center justify-center pt-2">
                    <div className="relative aspect-square w-[55%] max-w-[30px]">
                      <Image
                        src={`/result/result${stat!.level}.png`}
                        alt={`level ${stat!.level}`}
                        fill
                        sizes="30px"
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span
                      className="text-[9px] leading-none sm:text-[10px]"
                      style={{ color: isSalesHighlight ? '#fff' : COLOR.fg }}
                    >
                      {stat!.guest_count}人
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

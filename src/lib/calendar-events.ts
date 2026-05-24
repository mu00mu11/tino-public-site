/**
 * calendar-events.ts — カレンダーイベントの期間判定（純ロジック）
 *
 * 色・サイズのマッピングは event-palette.ts、CSSグラデは globals.css に集約。
 * ここは日付範囲の抽出のみ（描画なし・テスト容易）。
 */
import type { SiteEvent } from '@/lib/types'

/** 指定月（month0 は 0-indexed）に期間が重なるイベントのみ抽出 */
export function eventsInMonth(events: SiteEvent[], year: number, month0: number): SiteEvent[] {
  const mm = String(month0 + 1).padStart(2, '0')
  const monthStart = `${year}-${mm}-01`
  const lastDay = new Date(year, month0 + 1, 0).getDate()
  const monthEnd = `${year}-${mm}-${String(lastDay).padStart(2, '0')}`
  return events.filter(e => e.start_date <= monthEnd && e.end_date >= monthStart)
}

/** ISO日付（YYYY-MM-DD）にかかるイベント（先頭1件） */
export function eventOnDate(events: SiteEvent[], iso: string): SiteEvent | undefined {
  if (!iso) return undefined
  return events.find(e => iso >= e.start_date && iso <= e.end_date)
}

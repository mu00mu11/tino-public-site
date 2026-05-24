/**
 * calendar-events.ts — カレンダーイベント（アニバーサリー）の純ロジック
 *
 * 表示色は globals.css の rank-* / event-*-text クラスに集約（gradient定義の真ソース）。
 * ここではクラス名のマッピングと日付範囲判定のみを持つ（描画なし・テスト容易）。
 */
import type { SiteEvent } from '@/lib/types'

/** style → カレンダーセル背景クラス（売上ランクの rank-* を流用） */
export function eventBgClass(style: SiteEvent['style']): string {
  if (style === 'rainbow') return 'rank-rainbow'
  if (style === 'gold') return 'rank-gold'
  return ''
}

/** style → バナー文字グラデクラス（plain は装飾なし） */
export function eventTextClass(style: SiteEvent['style']): string {
  if (style === 'rainbow') return 'event-rainbow-text'
  if (style === 'gold') return 'event-gold-text'
  return ''
}

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

import { LAYOUT } from '@/lib/tokens'
import type { SiteConfig } from '@/lib/types'

/**
 * カレンダー上部ポップ画像（告知バナー）。
 * - 未設定 / OFF のときは何も表示しない（null）
 * - 表示開始日・終了日（JST）の範囲外なら表示しない
 * 画像比率は不問。カレンダー幅に合わせて横いっぱい・高さ自動。
 */
function jstToday(): string {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export function CalendarPopup({ config }: { config: SiteConfig }) {
  if (!config.calendar_popup_enabled || !config.calendar_popup_url) return null

  const today = jstToday()
  const { calendar_popup_start_date: start, calendar_popup_end_date: end } = config
  if (start && today < start) return null
  if (end && today > end) return null

  return (
    <section className="px-3 pt-5 sm:pt-8">
      <div className={`mx-auto w-full ${LAYOUT.calendarMaxW}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- 比率不問のバナーは natural sizing が最適 */}
        <img
          src={config.calendar_popup_url}
          alt="お知らせ"
          className="block h-auto w-full"
        />
      </div>
    </section>
  )
}

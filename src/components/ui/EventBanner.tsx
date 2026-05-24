import { COLOR } from '@/lib/tokens'
import { eventTextClass } from '@/lib/calendar-events'
import type { SiteEvent } from '@/lib/types'

/**
 * カレンダー上部のイベント告知バナー（再利用atom）。
 * 絵文字でタイトルを囲み、style に応じて文字を虹色/金色グラデにする。
 */
export function EventBanner({ event }: { event: SiteEvent }) {
  const lead = event.emoji ? `${event.emoji} ` : ''
  const tail = event.emoji ? ` ${event.emoji}` : ''
  return (
    <div
      className="mb-2 flex items-center justify-center gap-1 rounded border px-2 py-1.5 text-center"
      style={{ borderColor: COLOR.border, background: COLOR.surface }}
    >
      <span className={`text-sm sm:text-base ${eventTextClass(event.style)}`}>
        {lead}{event.title}{tail}
      </span>
    </div>
  )
}

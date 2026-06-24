import { LAYOUT } from '@/lib/tokens'

/**
 * カレンダー上部ポップ画像（告知バナー・複数枚）。
 * - 空配列のときは何も表示しない（null）
 * - 受け取った URL を縦並び（間隔あり）で並べる
 * 表示有無・期間判定は公開ビュー側で完結済み（ここでは判定しない）。
 * 画像比率は不問。カレンダー幅に合わせて横いっぱい・高さ自動。
 */
export function CalendarPopup({ popups }: { popups: string[] }) {
  if (popups.length === 0) return null

  return (
    <section className="px-3 pt-5 sm:pt-8">
      <div className={`mx-auto flex w-full flex-col gap-3 ${LAYOUT.calendarMaxW}`}>
        {popups.map((url) => (
          /* eslint-disable-next-line @next/next/no-img-element -- 比率不問のバナーは natural sizing が最適 */
          <img key={url} src={url} alt="お知らせ" className="block h-auto w-full" />
        ))}
      </div>
    </section>
  )
}

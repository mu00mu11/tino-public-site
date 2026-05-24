/**
 * types.ts — Supabase公開ビューと1:1の型定義
 *
 * ビューの列を増やしたら、ここに追加する。
 * 詳しくは docs/ADDING_FIELDS.md を参照。
 */

export type PublicCast = {
  cast_id: string
  slug: string
  display_name: string
  display_age: number | null
  bio: string | null
  photo_url: string | null
  sns_instagram: string | null
  sns_x: string | null
  sns_tiktok: string | null
  sort_order: number
}

export type FloorSeat = {
  seat_id: string
  label: string
  x: number
  y: number
  type: 'table' | 'counter' | 'sofa' | 'private_room'
  capacity: number
  sort_order: number
  is_occupied: boolean
}

export type TodayAttendance = {
  slug: string
  display_name: string
  display_age: number | null
  photo_url: string | null
  clock_in: string | null
  is_active: boolean
  drink_count: number
  shot_count: number
  bottle_count: number
}

export type DailyStats = {
  business_date: string
  guest_count: number
  /** 0=営業外/2=水色/3=普通/4=黄色ニコ/5=ピンクニコニコ */
  level: 0 | 2 | 3 | 4 | 5
  /** 5の特別背景。'rainbow'=虹色(売上最高)・'gold'=金色(高売上)・null=通常 */
  bg: 'rainbow' | 'gold' | null
}

export type SiteEvent = {
  id: string
  title: string
  emoji: string | null
  start_date: string   // 'YYYY-MM-DD'
  end_date: string     // 'YYYY-MM-DD'
  /** 背景色パレットキー（event-palette.ts 参照） */
  bg_color: string
  /** 文字色パレットキー（event-palette.ts 参照） */
  text_color: string
  /** フォントサイズ 'sm' | 'md' | 'lg' */
  font_size: string
  /** 期間中はカレンダーの結果ニコ(level画像)を隠す */
  hide_level: boolean
  sort_order: number
}

export type SiteConfig = {
  is_published: boolean
  calendar_thresholds: {
    r0: number; r1: number; r2: number; r3: number; r4: number; r5: number
  }
  show_drink_count: boolean
  show_shot_count: boolean
  /** カレンダーセクションの表示ON/OFF（マスタHP設定で切替） */
  show_calendar: boolean
}

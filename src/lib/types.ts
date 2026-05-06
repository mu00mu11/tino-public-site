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
}

export type SiteConfig = {
  is_published: boolean
  calendar_thresholds: {
    r0: number; r1: number; r2: number; r3: number; r4: number; r5: number
  }
  show_drink_count: boolean
  show_shot_count: boolean
}

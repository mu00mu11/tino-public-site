import { supabase } from '@/lib/supabase'
import type { TodayAttendance, PublicCast } from '@/lib/types'

export async function fetchTodayAttendance(): Promise<TodayAttendance[]> {
  const { data } = await supabase
    .from('public_today_attendance_view')
    .select('slug, display_name, display_age, photo_url, clock_in, is_active, drink_count, shot_count, bottle_count')
  return (data ?? []) as TodayAttendance[]
}

export async function fetchPublicCasts(): Promise<PublicCast[]> {
  const { data } = await supabase
    .from('public_casts_view')
    .select('cast_id, slug, display_name, display_age, bio, photo_url, sns_instagram, sns_x, sns_tiktok, sort_order')
    .order('sort_order', { ascending: true })
  return (data ?? []) as PublicCast[]
}

import { supabase } from '@/lib/supabase'
import type { TodayAttendance, PublicCast } from '@/lib/types'

export async function fetchTodayAttendance(): Promise<TodayAttendance[]> {
  const { data } = await supabase
    .from('public_today_attendance_view')
    .select('*')
  return (data ?? []) as TodayAttendance[]
}

export async function fetchPublicCasts(): Promise<PublicCast[]> {
  const { data } = await supabase
    .from('public_casts_view')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []) as PublicCast[]
}

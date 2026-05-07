import { supabase } from '@/lib/supabase'
import type { TodayAttendance, PublicCast } from '@/lib/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const PHOTO_PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/cast-photos/`

/** photo_url が Storage path だけのとき public URL に変換 */
function resolvePhotoUrl(p: string | null): string | null {
  if (!p) return null
  if (p.startsWith('http')) return p
  return PHOTO_PUBLIC_PREFIX + p
}

export async function fetchTodayAttendance(): Promise<TodayAttendance[]> {
  const { data } = await supabase
    .from('public_today_attendance_view')
    .select('slug, display_name, display_age, photo_url, clock_in, is_active, drink_count, shot_count, bottle_count')
  return (data ?? []).map(c => ({ ...c, photo_url: resolvePhotoUrl(c.photo_url) })) as TodayAttendance[]
}

export async function fetchPublicCasts(): Promise<PublicCast[]> {
  const { data } = await supabase
    .from('public_casts_view')
    .select('cast_id, slug, display_name, display_age, bio, photo_url, sns_instagram, sns_x, sns_tiktok, sort_order')
    .order('sort_order', { ascending: true })
  return (data ?? []).map(c => ({ ...c, photo_url: resolvePhotoUrl(c.photo_url) })) as PublicCast[]
}

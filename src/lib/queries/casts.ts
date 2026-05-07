import { supabase } from '@/lib/supabase'
import type { TodayAttendance, PublicCast } from '@/lib/types'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const PHOTO_PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/cast-photos/`
const ALLOWED_PHOTO_ORIGIN = SUPABASE_URL  // 外部URLは Supabase ドメインのみ許可

/** photo_url が Storage path だけのとき public URL に変換・外部URLはホワイトリストで弾く */
function resolvePhotoUrl(p: string | null): string | null {
  if (!p) return null
  if (p.startsWith('http')) {
    return p.startsWith(ALLOWED_PHOTO_ORIGIN) ? p : null
  }
  return PHOTO_PUBLIC_PREFIX + p
}

export async function fetchTodayAttendance(): Promise<TodayAttendance[]> {
  const { data, error } = await supabase
    .from('public_today_attendance_view')
    .select('slug, display_name, display_age, photo_url, clock_in, is_active, drink_count, shot_count, bottle_count')
  if (error) {
    console.error('[fetchTodayAttendance]', error.message, error.code)
    return []
  }
  return (data ?? []).map(c => ({ ...c, photo_url: resolvePhotoUrl(c.photo_url) })) as TodayAttendance[]
}

export async function fetchPublicCasts(): Promise<PublicCast[]> {
  const { data, error } = await supabase
    .from('public_casts_view')
    .select('cast_id, slug, display_name, display_age, bio, photo_url, sns_instagram, sns_x, sns_tiktok, sort_order')
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('[fetchPublicCasts]', error.message, error.code)
    return []
  }
  return (data ?? []).map(c => ({ ...c, photo_url: resolvePhotoUrl(c.photo_url) })) as PublicCast[]
}

import { supabase } from '@/lib/supabase'
import { STORE_CODE } from '@/lib/storeFilter'
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
  let query = supabase
    .from('public_today_attendance_view')
    .select('slug, display_name, display_age, photo_url, clock_in, clock_out, is_active, drink_count, shot_count, bottle_count, sort_order')
  if (STORE_CODE) query = query.eq('store_code', STORE_CODE)
  const { data, error } = await query.order('sort_order', { ascending: true })
  if (error) {
    console.error('[fetchTodayAttendance]', error.message, error.code)
    return []
  }
  return (data ?? []).map(c => ({ ...c, photo_url: resolvePhotoUrl(c.photo_url) })) as TodayAttendance[]
}

export async function fetchPublicCasts(): Promise<PublicCast[]> {
  let query = supabase
    .from('public_casts_view')
    .select('cast_id, slug, display_name, display_age, bio, photo_url, sns_instagram, sns_x, sns_tiktok, sort_order')
  if (STORE_CODE) query = query.eq('store_code', STORE_CODE)
  const { data, error } = await query.order('sort_order', { ascending: true })
  if (error) {
    console.error('[fetchPublicCasts]', error.message, error.code)
    return []
  }
  return (data ?? []).map(c => ({ ...c, photo_url: resolvePhotoUrl(c.photo_url) })) as PublicCast[]
}

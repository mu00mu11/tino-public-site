import { supabase } from '@/lib/supabase'
import { STORE_CODE } from '@/lib/storeFilter'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const POPUP_PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/cast-photos/`

/** Storage path だけのとき public URL に変換・外部URLは Supabase ドメインのみ許可 */
function resolvePopupUrl(p: string | null): string | null {
  if (!p) return null
  if (p.startsWith('http')) return p.startsWith(SUPABASE_URL) ? p : null
  return POPUP_PUBLIC_PREFIX + p
}

/**
 * 告知バナー（複数枚）を sort_order 昇順で取得。
 * 公開ビュー public_site_popups_view は「有効かつ本日(JST)が表示期間内」のものだけを返す
 * （日付/ON-OFF判定はビュー側で完結＝クライアントでは不要）。
 * 解決できた public URL のみの配列を返す。エラー時は空配列。
 */
export async function fetchSitePopups(): Promise<string[]> {
  let query = supabase
    .from('public_site_popups_view')
    .select('path, sort_order')
  if (STORE_CODE) query = query.eq('store_code', STORE_CODE)
  const { data, error } = await query.order('sort_order', { ascending: true })
  if (error) {
    console.error('[fetchSitePopups]', error.message, error.code)
    return []
  }
  return (data ?? [])
    .map((row) => resolvePopupUrl((row as { path: string | null }).path))
    .filter((url): url is string => url !== null)
}

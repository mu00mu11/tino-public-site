import { supabase } from '@/lib/supabase'
import type { SiteEvent } from '@/lib/types'

/**
 * 有効なカレンダーイベント（アニバーサリー等）を取得。
 * 機密データなし。公開ビュー public_site_events_view 経由（anon SELECT 可）。
 */
export async function fetchSiteEvents(): Promise<SiteEvent[]> {
  const { data, error } = await supabase
    .from('public_site_events_view')
    .select('id, title, emoji, start_date, end_date, style, hide_level, sort_order')
    .order('sort_order', { ascending: true })
    .order('start_date', { ascending: true })
  if (error) {
    console.error('[fetchSiteEvents]', error.message, error.code)
    return []
  }
  return (data ?? []) as SiteEvent[]
}

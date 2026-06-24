import { supabase } from '@/lib/supabase'
import { STORE_CODE } from '@/lib/storeFilter'
import type { SiteConfig } from '@/lib/types'
import { DEFAULT_THRESHOLDS } from '@/lib/thresholds'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const POPUP_PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/cast-photos/`

/** Storage path だけのとき public URL に変換・外部URLは Supabase ドメインのみ許可 */
function resolvePopupUrl(p: string | null): string | null {
  if (!p) return null
  if (p.startsWith('http')) return p.startsWith(SUPABASE_URL) ? p : null
  return POPUP_PUBLIC_PREFIX + p
}

const FALLBACK: SiteConfig = {
  is_published: true,
  calendar_thresholds: DEFAULT_THRESHOLDS,
  show_drink_count: false,
  show_shot_count: false,
  show_calendar: true,
  calendar_popup_url: null,
  calendar_popup_enabled: false,
  calendar_popup_start_date: null,
  calendar_popup_end_date: null,
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  let query = supabase
    .from('public_site_config_view')
    .select('is_published, calendar_thresholds, show_drink_count, show_shot_count, show_calendar, calendar_popup_url, calendar_popup_enabled, calendar_popup_start_date, calendar_popup_end_date')
  if (STORE_CODE) query = query.eq('store_code', STORE_CODE)
  const { data, error } = await query.limit(1).maybeSingle()
  if (error) {
    console.error('[fetchSiteConfig]', error.message, error.code)
    return FALLBACK
  }
  if (!data) return FALLBACK
  return {
    ...(data as SiteConfig),
    calendar_popup_url: resolvePopupUrl((data as SiteConfig).calendar_popup_url),
  }
}

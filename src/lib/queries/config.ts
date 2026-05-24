import { supabase } from '@/lib/supabase'
import type { SiteConfig } from '@/lib/types'
import { DEFAULT_THRESHOLDS } from '@/lib/thresholds'

const FALLBACK: SiteConfig = {
  is_published: true,
  calendar_thresholds: DEFAULT_THRESHOLDS,
  show_drink_count: false,
  show_shot_count: false,
  show_calendar: true,
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const { data, error } = await supabase
    .from('public_site_config_view')
    .select('is_published, calendar_thresholds, show_drink_count, show_shot_count, show_calendar')
    .limit(1)
    .maybeSingle()
  if (error) {
    console.error('[fetchSiteConfig]', error.message, error.code)
    return FALLBACK
  }
  return (data as SiteConfig | null) ?? FALLBACK
}

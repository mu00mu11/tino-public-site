import { supabase } from '@/lib/supabase'
import type { SiteConfig } from '@/lib/types'
import { DEFAULT_THRESHOLDS } from '@/lib/thresholds'

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const { data } = await supabase
    .from('public_site_config_view')
    .select('*')
    .limit(1)
    .maybeSingle()
  return (data as SiteConfig | null) ?? {
    is_published: true,
    calendar_thresholds: DEFAULT_THRESHOLDS,
    show_drink_count: false,
    show_shot_count: false,
  }
}

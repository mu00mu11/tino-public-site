import { supabase } from '@/lib/supabase'
import type { DailyStats } from '@/lib/types'

export async function fetchDailyStats(): Promise<DailyStats[]> {
  const { data, error } = await supabase
    .from('public_daily_stats_view')
    .select('business_date, guest_count, level, bg')
    .order('business_date', { ascending: true })
  if (error) {
    console.error('[fetchDailyStats]', error.message, error.code)
    return []
  }
  return (data ?? []) as DailyStats[]
}

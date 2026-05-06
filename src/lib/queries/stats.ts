import { supabase } from '@/lib/supabase'
import type { DailyStats } from '@/lib/types'

export async function fetchDailyStats(): Promise<DailyStats[]> {
  const { data } = await supabase
    .from('public_daily_stats_view')
    .select('*')
    .order('business_date', { ascending: true })
  return (data ?? []) as DailyStats[]
}

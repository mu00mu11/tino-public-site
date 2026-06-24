import { supabase } from '@/lib/supabase'
import { STORE_CODE } from '@/lib/storeFilter'
import type { DailyStats } from '@/lib/types'

export async function fetchDailyStats(): Promise<DailyStats[]> {
  let query = supabase
    .from('public_daily_stats_view')
    .select('business_date, guest_count, level, bg')
  if (STORE_CODE) query = query.eq('store_code', STORE_CODE)
  const { data, error } = await query.order('business_date', { ascending: true })
  if (error) {
    console.error('[fetchDailyStats]', error.message, error.code)
    return []
  }
  return (data ?? []) as DailyStats[]
}

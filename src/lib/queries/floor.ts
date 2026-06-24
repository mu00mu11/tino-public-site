import { supabase } from '@/lib/supabase'
import { STORE_CODE } from '@/lib/storeFilter'
import type { FloorSeat } from '@/lib/types'

export async function fetchFloorStatus(): Promise<FloorSeat[]> {
  let query = supabase
    .from('public_floor_status_view')
    .select('seat_id, label, x, y, type, capacity, sort_order, is_occupied')
  if (STORE_CODE) query = query.eq('store_code', STORE_CODE)
  const { data, error } = await query.order('sort_order', { ascending: true })
  if (error) {
    console.error('[fetchFloorStatus]', error.message, error.code)
    return []
  }
  return (data ?? []) as FloorSeat[]
}

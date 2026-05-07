import { supabase } from '@/lib/supabase'
import type { FloorSeat } from '@/lib/types'

export async function fetchFloorStatus(): Promise<FloorSeat[]> {
  const { data, error } = await supabase
    .from('public_floor_status_view')
    .select('seat_id, label, x, y, type, capacity, sort_order, is_occupied')
    .order('sort_order', { ascending: true })
  if (error) {
    console.error('[fetchFloorStatus]', error.message, error.code)
    return []
  }
  return (data ?? []) as FloorSeat[]
}

import { supabase } from '@/lib/supabase'
import type { FloorSeat } from '@/lib/types'

export async function fetchFloorStatus(): Promise<FloorSeat[]> {
  const { data } = await supabase
    .from('public_floor_status_view')
    .select('seat_id, label, x, y, type, capacity, sort_order, is_occupied')
    .order('sort_order', { ascending: true })
  return (data ?? []) as FloorSeat[]
}

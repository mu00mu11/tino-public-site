import { supabase } from '@/lib/supabase'
import type { FloorSeat } from '@/lib/types'

export async function fetchFloorStatus(): Promise<FloorSeat[]> {
  const { data } = await supabase
    .from('public_floor_status_view')
    .select('*')
    .order('sort_order', { ascending: true })
  return (data ?? []) as FloorSeat[]
}

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { FloorSeat } from '@/lib/types'

const POLL_MS = 5000

export function FloorMap({ initialSeats }: { initialSeats: FloorSeat[] }) {
  const [seats, setSeats] = useState<FloorSeat[]>(initialSeats)

  useEffect(() => {
    let cancelled = false
    async function tick() {
      const { data } = await supabase
        .from('public_floor_status_view')
        .select('*')
        .order('sort_order', { ascending: true })
      if (cancelled) return
      if (data) setSeats(data as FloorSeat[])
    }
    const id = setInterval(tick, POLL_MS)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  // 実物互換：座席が0件なら10席のデフォルトプレースホルダ
  const display = seats.length > 0
    ? seats
    : Array.from({ length: 10 }, (_, i) => ({
        seat_id: `placeholder-${i}`,
        label: '',
        x: 0, y: 0,
        type: 'table' as const,
        capacity: 2,
        sort_order: i,
        is_occupied: false,
      }))

  return (
    <section className="px-3 py-4 flex justify-center">
      <div className="flex flex-row flex-nowrap items-end justify-center gap-1">
        {display.map(seat => (
          <div
            key={seat.seat_id}
            className="shrink-0"
            aria-label={seat.is_occupied ? '使用中' : '空席'}
          >
            <Image
              src={seat.is_occupied ? '/seat/cat.png' : '/seat/chair.png'}
              alt={seat.is_occupied ? '使用中' : '空席'}
              width={25}
              height={50}
              className="block"
              unoptimized
            />
          </div>
        ))}
      </div>
    </section>
  )
}

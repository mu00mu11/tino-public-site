'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { fetchFloorStatus } from '@/lib/queries/floor'
import { LAYOUT } from '@/lib/tokens'
import type { FloorSeat } from '@/lib/types'

const POLL_MS = 5000

const FALLBACK: FloorSeat[] = Array.from({ length: 10 }, (_, i) => ({
  seat_id: `placeholder-${i}`,
  label: '',
  x: 0, y: 0,
  type: 'table',
  capacity: 2,
  sort_order: i,
  is_occupied: false,
}))

export function FloorMapSection({ initialSeats }: { initialSeats: FloorSeat[] }) {
  const [seats, setSeats] = useState<FloorSeat[]>(initialSeats)

  useEffect(() => {
    let cancelled = false
    const id = setInterval(async () => {
      const next = await fetchFloorStatus()
      if (!cancelled && next.length > 0) setSeats(next)
    }, POLL_MS)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  const display = seats.length > 0 ? seats : FALLBACK
  // 物理配置: 左から10卓→1卓の順で並べる（sort_order ASC を表示時に逆順化）
  const displayReversed = [...display].reverse()

  return (
    <section className="px-3 py-3 sm:py-5">
      <div className={`mx-auto flex w-full ${LAYOUT.floorMapMaxW} flex-row flex-nowrap items-end justify-between gap-[1%]`}>
        {displayReversed.map(seat => (
          <div
            key={seat.seat_id}
            className="relative aspect-[1/2] basis-[8%] grow-0 shrink-0"
            aria-label={seat.is_occupied ? '使用中' : '空席'}
          >
            <Image
              src={seat.is_occupied ? '/seat/cat.png' : '/seat/chair.png'}
              alt={seat.is_occupied ? '使用中' : '空席'}
              fill
              sizes="(max-width:600px) 8vw, 48px"
              className="object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    </section>
  )
}

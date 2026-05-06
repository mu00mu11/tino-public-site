'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import type { FloorSeat } from '@/lib/types'

const POLL_MS = 5000

export function FloorMap({ initialSeats }: { initialSeats: FloorSeat[] }) {
  const [seats, setSeats] = useState<FloorSeat[]>(initialSeats)
  const [updatedAt, setUpdatedAt] = useState<Date>(new Date())

  useEffect(() => {
    let cancelled = false
    async function tick() {
      const { data } = await supabase
        .from('public_floor_status_view')
        .select('*')
        .order('sort_order', { ascending: true })
      if (cancelled) return
      if (data) {
        setSeats(data as FloorSeat[])
        setUpdatedAt(new Date())
      }
    }
    const id = setInterval(tick, POLL_MS)
    return () => { cancelled = true; clearInterval(id) }
  }, [])

  // 実物互換：座席が0件なら10席のデフォルトプレースホルダ
  const display = seats.length > 0
    ? seats
    : Array.from({ length: 10 }, (_, i) => ({
        seat_id: `placeholder-${i}`,
        label: `席${i + 1}`,
        x: 0, y: 0,
        type: 'table' as const,
        capacity: 2,
        sort_order: i,
        is_occupied: false,
      }))

  const occupied = display.filter(s => s.is_occupied).length

  return (
    <section className="px-4 py-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-sm font-medium tracking-[0.2em] text-[#0a0a0a]">
            STATUS
          </h2>
          <span className="text-xs text-[#6b7280]">
            {occupied} / {display.length} 席稼働中
          </span>
        </div>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {display.map(seat => (
            <div
              key={seat.seat_id}
              className="flex flex-col items-center"
              aria-label={`${seat.label} ${seat.is_occupied ? '使用中' : '空席'}`}
            >
              <div className="relative aspect-[1/2] w-full max-w-[60px] overflow-hidden">
                <Image
                  src={seat.is_occupied ? '/seat/cat.jpg' : '/seat/chair.jpg'}
                  alt={seat.is_occupied ? '使用中' : '空席'}
                  fill
                  sizes="(max-width: 640px) 60px, 80px"
                  className="object-contain"
                />
              </div>
              <span className="mt-1 text-[10px] text-[#6b7280]">
                {seat.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-[10px] text-[#9ca3af]">
          自動更新 · 最終 {updatedAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      </div>
    </section>
  )
}

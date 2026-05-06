import { supabase } from '@/lib/supabase'
import { Hero } from '@/components/Hero'
import { FloorMap } from '@/components/FloorMap'
import { CastGrid } from '@/components/CastGrid'
import { ProfitCalendar } from '@/components/ProfitCalendar'
import { StoreInfo } from '@/components/StoreInfo'
import { Footer } from '@/components/Footer'
import { DEFAULT_THRESHOLDS } from '@/lib/thresholds'
import type { FloorSeat, PublicCast, TodayAttendance, DailyStats, SiteConfig } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const [seatsRes, castsRes, todayRes, statsRes, configRes] = await Promise.all([
    supabase.from('public_floor_status_view').select('*').order('sort_order', { ascending: true }),
    supabase.from('public_casts_view').select('*').order('sort_order', { ascending: true }),
    supabase.from('public_today_attendance_view').select('*'),
    supabase.from('public_daily_stats_view').select('*').order('business_date', { ascending: true }),
    supabase.from('public_site_config_view').select('*').limit(1).maybeSingle(),
  ])

  const seats = (seatsRes.data ?? []) as FloorSeat[]
  const casts = (castsRes.data ?? []) as PublicCast[]
  const today = (todayRes.data ?? []) as TodayAttendance[]
  const stats = (statsRes.data ?? []) as DailyStats[]
  const config = (configRes.data ?? null) as SiteConfig | null

  if (config && !config.is_published) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <h1 className="text-xl font-medium mb-2">準備中</h1>
          <p className="text-sm text-[#6b7280]">ただいま公開準備中です</p>
        </div>
      </main>
    )
  }

  const thresholds = config?.calendar_thresholds ?? DEFAULT_THRESHOLDS

  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <FloorMap initialSeats={seats} />
      <CastGrid allCasts={casts} todayCasts={today} />
      <ProfitCalendar stats={stats} thresholds={thresholds} />
      <StoreInfo />
      <Footer />
    </main>
  )
}

import { HeroSection } from '@/components/sections/HeroSection'
import { FloorMapSection } from '@/components/sections/FloorMapSection'
import { CastSection } from '@/components/sections/CastSection'
import { CalendarSection } from '@/components/sections/CalendarSection'
import { CalendarPopup } from '@/components/ui/CalendarPopup'
import { InstagramSection } from '@/components/sections/InstagramSection'
import { AccessSection } from '@/components/sections/AccessSection'
import { FooterSection } from '@/components/sections/FooterSection'
import { fetchFloorStatus } from '@/lib/queries/floor'
import { fetchTodayAttendance } from '@/lib/queries/casts'
import { fetchDailyStats } from '@/lib/queries/stats'
import { fetchSiteEvents } from '@/lib/queries/events'
import { fetchSiteConfig } from '@/lib/queries/config'
import { fetchSitePopups } from '@/lib/queries/popups'
import { COLOR } from '@/lib/tokens'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const [seats, today, stats, events, config, popups] = await Promise.all([
    fetchFloorStatus(),
    fetchTodayAttendance(),
    fetchDailyStats(),
    fetchSiteEvents(),
    fetchSiteConfig(),
    fetchSitePopups(),
  ])

  if (!config.is_published) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <h1 className="text-xl font-medium mb-2">準備中</h1>
          <p className="text-sm" style={{ color: COLOR.muted }}>
            ただいま公開準備中です
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen" style={{ background: COLOR.bg }}>
      <HeroSection />
      <FloorMapSection initialSeats={seats} />
      <CastSection todayCasts={today} config={config} />
      <CalendarPopup popups={popups} />
      {config.show_calendar && <CalendarSection stats={stats} events={events} />}
      <InstagramSection />
      <AccessSection />
      <FooterSection />
    </main>
  )
}

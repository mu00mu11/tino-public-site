import Image from 'next/image'
import { STORE_INFO } from '@/lib/info'
import { COLOR, FONT } from '@/lib/tokens'

export function HeroSection() {
  return (
    <header className="flex flex-col items-center justify-center px-4 pb-4 pt-6 text-center sm:pb-6 sm:pt-10">
      <Image
        src="/logo.jpg"
        alt={`${STORE_INFO.name_jp} ロゴ`}
        width={300}
        height={147}
        priority
        className="h-auto w-3/5 max-w-[300px]"
      />
      <p
        className={`mt-2 ${FONT.xs} ${FONT.tracking.extraWide} sm:mt-3 sm:${FONT.sm}`}
        style={{ color: COLOR.muted }}
      >
        OTSUKA · GIRL&apos;S BAR
      </p>
    </header>
  )
}

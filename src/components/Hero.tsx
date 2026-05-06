import Image from 'next/image'
import { STORE_INFO } from '@/lib/info'

export function Hero() {
  return (
    <header className="flex flex-col items-center justify-center pt-10 pb-6 text-center">
      <Image
        src="/logo.jpg"
        alt={`${STORE_INFO.name_jp} ロゴ`}
        width={300}
        height={147}
        priority
        className="h-auto w-[260px] sm:w-[300px]"
      />
      <p className="mt-3 text-xs tracking-[0.3em] text-[#6b7280]">
        OTSUKA · GIRL&apos;S BAR
      </p>
    </header>
  )
}

import Image from 'next/image'
import { STORE_INFO } from '@/lib/info'

export function Hero() {
  return (
    <header className="flex flex-col items-center justify-center px-4 pb-4 pt-6 text-center sm:pb-6 sm:pt-10">
      <div className="relative w-3/5 max-w-[300px]">
        <Image
          src="/logo.jpg"
          alt={`${STORE_INFO.name_jp} ロゴ`}
          width={300}
          height={147}
          priority
          className="h-auto w-full"
        />
      </div>
      <p className="mt-2 text-[10px] tracking-[0.3em] text-[#6b7280] sm:mt-3 sm:text-xs">
        OTSUKA · GIRL&apos;S BAR
      </p>
    </header>
  )
}

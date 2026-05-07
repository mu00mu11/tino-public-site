import Image from 'next/image'
import { STORE_INFO } from '@/lib/info'
import { COLOR, LAYOUT } from '@/lib/tokens'

export function InstagramSection() {
  const { instagram } = STORE_INFO.sns
  if (!instagram) return null

  return (
    <section
      className="border-t bg-white px-4 py-6 sm:py-10"
      style={{ borderColor: COLOR.line }}
    >
      <div className={`mx-auto w-full ${LAYOUT.contentMaxW} flex justify-center`}>
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="block transition hover:opacity-70"
        >
          <Image
            src="/sns/instagram.jpg"
            alt="Instagram"
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl"
            unoptimized
          />
        </a>
      </div>
    </section>
  )
}

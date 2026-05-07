import Image from 'next/image'
import { LinkButton } from '@/components/ui/LinkButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { STORE_INFO } from '@/lib/info'
import { COLOR, FONT, LAYOUT } from '@/lib/tokens'

export function AccessSection() {
  const sns = STORE_INFO.sns
  const hasSns = !!(sns.instagram || sns.x || sns.tiktok)

  return (
    <section
      className="border-t bg-white px-4 py-6 sm:py-10"
      style={{ borderColor: COLOR.line }}
    >
      <div className={`mx-auto w-full ${LAYOUT.contentMaxW}`}>
        <SectionHeading>ACCESS</SectionHeading>
        <div className="space-y-3 text-sm">
          <div className="text-center">
            <p className="text-xs" style={{ color: COLOR.muted }}>運営</p>
            <p>{STORE_INFO.operator}</p>
          </div>
          <div className="text-center">
            <p className="text-xs" style={{ color: COLOR.muted }}>住所</p>
            <p>〒{STORE_INFO.address.postal}</p>
            <p>{STORE_INFO.address.full}</p>
          </div>
          <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:justify-center">
            <LinkButton href={STORE_INFO.address.maps_url} external>
              地図で確認する →
            </LinkButton>
            <LinkButton href={STORE_INFO.contact.tel_link} variant="solid">
              電話する {STORE_INFO.contact.tel}
            </LinkButton>
          </div>

          {hasSns && (
            <div className="flex flex-col items-center gap-2 pt-5">
              <p className={`${FONT.xs} ${FONT.tracking.wide}`} style={{ color: COLOR.muted }}>FOLLOW</p>
              <div className="flex items-center justify-center gap-3">
                {sns.instagram && (
                  <a
                    href={sns.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="block transition hover:opacity-70"
                  >
                    <Image
                      src="/sns/instagram.jpg"
                      alt="Instagram"
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded-md"
                      unoptimized
                    />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

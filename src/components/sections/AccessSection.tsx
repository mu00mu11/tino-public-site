import { LinkButton } from '@/components/ui/LinkButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { STORE_INFO } from '@/lib/info'
import { COLOR, LAYOUT } from '@/lib/tokens'

export function AccessSection() {
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
        </div>
      </div>
    </section>
  )
}

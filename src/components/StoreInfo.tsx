import { STORE_INFO } from '@/lib/info'

export function StoreInfo() {
  return (
    <section className="border-t border-[#e5e7eb] bg-white px-4 py-6 sm:py-10">
      <div className="mx-auto w-full max-w-[600px]">
        <h2 className="mb-3 text-center text-xs tracking-[0.3em] text-[#6b7280] sm:text-sm">
          ACCESS
        </h2>
        <div className="space-y-3 text-sm">
          <div className="text-center">
            <p className="text-xs text-[#6b7280]">運営</p>
            <p>{STORE_INFO.operator}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#6b7280]">住所</p>
            <p>〒{STORE_INFO.address.postal}</p>
            <p>{STORE_INFO.address.full}</p>
          </div>
          <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:justify-center">
            <a
              href={STORE_INFO.address.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md border border-black px-4 py-3 text-center text-sm transition hover:bg-black hover:text-white sm:px-6"
            >
              地図で確認する →
            </a>
            <a
              href={STORE_INFO.contact.tel_link}
              className="inline-block rounded-md bg-[#1b2244] px-4 py-3 text-center text-sm text-white sm:px-6"
            >
              電話する {STORE_INFO.contact.tel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

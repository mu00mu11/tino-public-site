import { STORE_INFO } from '@/lib/info'

export function StoreInfo() {
  return (
    <section className="px-4 py-10 bg-white border-t border-[#e5e7eb]">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-sm font-medium tracking-[0.2em] mb-4">ACCESS</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-xs text-[#6b7280]">運営</p>
            <p>{STORE_INFO.operator}</p>
          </div>
          <div>
            <p className="text-xs text-[#6b7280]">住所</p>
            <p>〒{STORE_INFO.address.postal}</p>
            <p>{STORE_INFO.address.full}</p>
          </div>
          <div className="flex flex-col gap-2 pt-3">
            <a
              href={STORE_INFO.address.maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-center px-4 py-3 border border-[#0a0a0a] rounded-md text-sm hover:bg-[#0a0a0a] hover:text-white transition"
            >
              地図で確認する →
            </a>
            <a
              href={STORE_INFO.contact.tel_link}
              className="inline-block text-center px-4 py-3 bg-[#1b2244] text-white rounded-md text-sm"
            >
              電話する {STORE_INFO.contact.tel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

import { STORE_INFO } from '@/lib/info'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-[#0a0a0a] text-white py-6 text-center text-xs">
      <p>© {year} {STORE_INFO.name_jp}</p>
      <p className="text-[#9ca3af] mt-1">{STORE_INFO.operator}</p>
    </footer>
  )
}

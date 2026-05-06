import { COLOR } from '@/lib/tokens'

export function FooterSection() {
  return (
    <footer
      className="py-4 text-center text-xs"
      style={{ background: COLOR.copyrightBg, color: COLOR.copyrightFg }}
    >
      © 大塚ガールズバーTINO All Rights Reserved.
    </footer>
  )
}

import { COLOR } from '@/lib/tokens'

type Props = {
  href: string
  variant?: 'outline' | 'solid'
  external?: boolean
  children: React.ReactNode
}

export function LinkButton({ href, variant = 'outline', external = false, children }: Props) {
  const base = 'inline-block rounded-md px-4 py-3 text-center text-sm sm:px-6 transition'
  const style = variant === 'solid'
    ? { background: COLOR.accent, color: '#fff', border: '1px solid transparent' }
    : { background: 'transparent', color: COLOR.fg, border: `1px solid ${COLOR.border}` }
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={base}
      style={style}
    >
      {children}
    </a>
  )
}

import { COLOR, FONT } from '@/lib/tokens'

export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className={`mb-3 text-center ${FONT.sm} ${FONT.tracking.extraWide} sm:${FONT.base}`}
      style={{ color: COLOR.muted }}
    >
      {children}
    </h2>
  )
}

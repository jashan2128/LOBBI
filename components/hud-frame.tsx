import { cn } from '@/lib/utils'

const TONES = {
  green: 'border-neon-green',
  purple: 'border-neon-purple',
  blue: 'border-neon-blue',
} as const

type HudFrameProps = {
  children: React.ReactNode
  className?: string
  tone?: keyof typeof TONES
  as?: 'div' | 'figure' | 'section'
}

/** Panel with targeting-bracket corners, used for every in-game style surface. */
export function HudFrame({ children, className, tone = 'green', as: Tag = 'div' }: HudFrameProps) {
  const corner = cn('pointer-events-none absolute size-3', TONES[tone])
  return (
    <Tag className={cn('relative border border-white/10 bg-[#0b0a14]/85 backdrop-blur-md', className)}>
      <span aria-hidden="true" className={cn(corner, '-left-px -top-px border-l-2 border-t-2')} />
      <span aria-hidden="true" className={cn(corner, '-right-px -top-px border-r-2 border-t-2')} />
      <span aria-hidden="true" className={cn(corner, '-bottom-px -left-px border-b-2 border-l-2')} />
      <span aria-hidden="true" className={cn(corner, '-bottom-px -right-px border-b-2 border-r-2')} />
      {children}
    </Tag>
  )
}

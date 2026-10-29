import { cn } from '@/lib/utils'

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground', className)}>
      <span aria-hidden="true" className="size-1.5 bg-neon-green shadow-[0_0_8px_var(--neon-green)]" />
      {children}
      <span aria-hidden="true" className="h-px w-12 bg-gradient-to-r from-white/30 to-transparent" />
    </p>
  )
}

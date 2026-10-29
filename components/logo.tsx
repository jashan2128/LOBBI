import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 font-semibold tracking-tight text-foreground', className)}>
      <span aria-hidden="true" className="relative grid size-[1.1em] place-items-center">
        <span className="absolute inset-0 rotate-45 rounded-[0.2em] border border-neon-purple/80" />
        <span className="size-[0.32em] rounded-full bg-neon-green shadow-[0_0_10px_var(--neon-green)]" />
      </span>
      Lobbi
    </span>
  )
}

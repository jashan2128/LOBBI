import Link from 'next/link'

const BTN =
  'inline-flex h-10 items-center border px-4 font-mono text-xs font-bold uppercase tracking-[0.14em] transition-colors'

export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number
  totalPages: number
  hrefFor: (page: number) => string
}) {
  if (totalPages <= 1) return null
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className={`${BTN} border-white/20 hover:border-neon-green/60 hover:text-neon-green`}>
          ← Previous
        </Link>
      ) : (
        <span aria-disabled="true" className={`${BTN} border-white/10 text-muted-foreground/40`}>← Previous</span>
      )}
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className={`${BTN} border-white/20 hover:border-neon-green/60 hover:text-neon-green`}>
          Next →
        </Link>
      ) : (
        <span aria-disabled="true" className={`${BTN} border-white/10 text-muted-foreground/40`}>Next →</span>
      )}
    </nav>
  )
}

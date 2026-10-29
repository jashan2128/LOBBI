import { AppShell } from '@/components/app-shell'
import { Eyebrow } from '@/components/sections/eyebrow'
import { CONTACT_EMAIL, LEGAL_UPDATED } from '@/lib/site'

export function LegalPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <AppShell showNav={false}>
      <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
      <h1 className="font-display text-4xl font-bold uppercase leading-none md:text-5xl">{title}</h1>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">Last updated: {LEGAL_UPDATED}</p>
      <div className="mt-10 max-w-2xl space-y-4 leading-relaxed text-muted-foreground">{children}</div>
    </AppShell>
  )
}

export function H2({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display !mt-10 scroll-mt-28 text-2xl font-bold uppercase text-foreground">
      {children}
    </h2>
  )
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5 marker:text-neon-green">{children}</ul>
}

export function ContactEmail() {
  if (!CONTACT_EMAIL) {
    return <span className="text-neon-purple">[contact email not set yet]</span>
  }
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-neon-green underline underline-offset-4">
      {CONTACT_EMAIL}
    </a>
  )
}

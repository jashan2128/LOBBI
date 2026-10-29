import { AppNav } from '@/components/app-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { SiteHeader } from '@/components/sections/site-header'

// Page frame for the logged-in app pages: same header/footer and neon look
// as the landing page, without the heavy 3D scene.
export function AppShell({
  children,
  size = 'narrow',
  showNav = true,
}: {
  children: React.ReactNode
  size?: 'narrow' | 'wide'
  showNav?: boolean
}) {
  return (
    <div className="static-gradient min-h-screen">
      <SiteHeader />
      <main
        className={`relative z-10 mx-auto px-5 pb-24 pt-28 md:px-10 md:pt-36 ${size === 'wide' ? 'max-w-6xl' : 'max-w-3xl'}`}
      >
        {showNav && <AppNav />}
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}

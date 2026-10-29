'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { getReady, getServerReady, subscribeReady } from '@/lib/scene-store'
import { Logo } from '@/components/logo'

const MAX_WAIT_MS = 5000

export function LoadingScreen() {
  const ready = useSyncExternalStore(subscribeReady, getReady, getServerReady)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), ready ? 350 : MAX_WAIT_MS)
    return () => clearTimeout(timeout)
  }, [ready])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          className="loader-failsafe fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        >
          <Logo className="text-2xl" />
          <div className="h-px w-40 overflow-hidden bg-white/10">
            <div className="loader-bar h-full w-1/3 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-green" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Connecting to lobby…</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

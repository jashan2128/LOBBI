'use client'

import { type MotionValue, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { type ElementType, useRef } from 'react'
import { cn } from '@/lib/utils'

type RevealWordsProps = {
  text: string
  as?: ElementType
  id?: string
  className?: string
  accent?: string[]
  accentClassName?: string
}

function Word({
  children,
  progress,
  range,
  reduced,
  className,
}: {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  reduced: boolean
  className?: string
}) {
  const opacity = useTransform(progress, range, reduced ? [1, 1] : [0.14, 1])
  return (
    <>
      <motion.span style={{ opacity }} className={cn('inline-block', className)}>
        {children}
      </motion.span>{' '}
    </>
  )
}

/** Reveals words one by one as the element scrolls through the viewport. */
export function RevealWords({ text, as: Tag = 'p', id, className, accent = [], accentClassName }: RevealWordsProps) {
  const ref = useRef<HTMLElement>(null)
  const reduced = Boolean(useReducedMotion())
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'start 0.38'] })
  const words = text.split(' ')

  return (
    <Tag ref={ref} id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            reduced={reduced}
            className={accent.includes(word) ? accentClassName : undefined}
          >
            {word}
          </Word>
        ))}
      </span>
    </Tag>
  )
}

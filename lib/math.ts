export function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

/** Samples evenly spaced keyframes (one per chapter) with smoothstep easing between them. */
export function sampleKeys(keys: readonly number[], chapter: number) {
  const max = keys.length - 1
  const x = clamp(chapter, 0, max)
  const i = Math.min(Math.floor(x), max - 1)
  const f = x - i
  const eased = f * f * (3 - 2 * f)
  return keys[i] + (keys[i + 1] - keys[i]) * eased
}

export function Overlays() {
  return (
    <>
      <div aria-hidden="true" className="readability-scrim pointer-events-none fixed inset-0 z-[1]" />
      <div aria-hidden="true" className="vignette pointer-events-none fixed inset-0 z-[1]" />
      <div aria-hidden="true" className="scanlines pointer-events-none fixed inset-0 z-[2]" />
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-50" />
    </>
  )
}

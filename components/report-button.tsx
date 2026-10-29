'use client'

import { useActionState, useRef } from 'react'
import { submitReport, type ReportState } from '@/app/actions/reports'
import { REPORT_CATEGORIES, type ReportTarget } from '@/lib/reports'

const FIELD =
  'w-full border border-white/15 bg-[#0b0a14] px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-neon-green/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-green/40'

export function ReportButton({
  targetType,
  targetId,
  subject,
}: {
  targetType: ReportTarget
  targetId: string
  subject: string
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [state, formAction, pending] = useActionState<ReportState, FormData>(submitReport, null)
  const sent = state !== null && 'ok' in state

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 transition-colors hover:text-neon-purple hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-green"
      >
        Report
      </button>

      <dialog
        ref={dialog}
        aria-label={`Report ${subject}`}
        // clicking the dark area outside the box closes it
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close()
        }}
        className="m-auto w-[min(92vw,28rem)] border border-white/15 bg-[#0b0a14] p-6 text-foreground backdrop:bg-black/70"
      >
        {sent ? (
          <div>
            <h2 className="font-display text-2xl font-bold uppercase">Report sent</h2>
            <p className="mt-3 text-sm text-muted-foreground">Thank you. We will look at it. You will not get a reply unless we need more details.</p>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="mt-6 h-10 border border-white/20 px-5 font-mono text-xs font-bold uppercase tracking-[0.14em] hover:border-neon-green/60 hover:text-neon-green"
            >
              Close
            </button>
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <h2 className="font-display text-2xl font-bold uppercase [overflow-wrap:anywhere]">Report {subject}</h2>
            <input type="hidden" name="target_type" value={targetType} />
            <input type="hidden" name="target_id" value={targetId} />

            <div>
              <label htmlFor={`cat-${targetId}`} className="mb-1.5 block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                What is wrong?
              </label>
              <select id={`cat-${targetId}`} name="category" required defaultValue="" className={`${FIELD} h-11`}>
                <option value="" disabled>Pick a reason</option>
                {REPORT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor={`why-${targetId}`} className="mb-1.5 block font-mono text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Details (optional)
              </label>
              <textarea id={`why-${targetId}`} name="reason" maxLength={500} rows={4} placeholder="What happened?" className={`${FIELD} py-2`} />
            </div>

            <p aria-live="polite" className="min-h-5 text-sm text-neon-purple">
              {state && 'error' in state ? state.error : ''}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={pending}
                className="h-10 border border-neon-purple/60 px-5 font-mono text-xs font-bold uppercase tracking-[0.14em] text-neon-purple transition-colors hover:bg-neon-purple hover:text-background disabled:cursor-wait disabled:opacity-70"
              >
                {pending ? 'Sending…' : 'Send report'}
              </button>
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                className="h-10 px-3 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  )
}

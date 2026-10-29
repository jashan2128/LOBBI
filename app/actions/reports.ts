'use server'

import { createClient } from '@/lib/supabase/server'
import { REPORT_CATEGORIES, REPORT_ERRORS } from '@/lib/reports'

export type ReportState = { ok: true } | { error: string } | null

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function submitReport(_prev: ReportState, formData: FormData): Promise<ReportState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: REPORT_ERRORS.not_signed_in }

  const targetType = String(formData.get('target_type') ?? '')
  const targetId = String(formData.get('target_id') ?? '')
  const category = String(formData.get('category') ?? '')
  const reason = String(formData.get('reason') ?? '').trim()

  if (targetType !== 'profile' && targetType !== 'lobby') return { error: REPORT_ERRORS.unknown }
  if (!UUID.test(targetId)) return { error: REPORT_ERRORS.unknown }
  if (!REPORT_CATEGORIES.some((c) => c.id === category)) return { error: 'Please pick a reason.' }
  if (reason.length > 500) return { error: 'Please keep the details under 500 characters.' }
  if (category === 'other' && reason.length < 10) return { error: REPORT_ERRORS.invalid }

  // The reporter id comes from the login, never from the form.
  // We do NOT ask for the row back (no .select()): nobody is allowed to read reports.
  const { error } = await supabase.from('reports').insert({
    reporter_id: user.id,
    target_type: targetType,
    target_id: targetId,
    category,
    reason,
  })

  if (error) {
    console.error('report insert failed', error.code, error.message)
    if (error.message in REPORT_ERRORS) return { error: REPORT_ERRORS[error.message] }
    if (error.code === '42501') return { error: REPORT_ERRORS.profile_required }
    if (error.code === '23514') return { error: REPORT_ERRORS.invalid }
    return { error: REPORT_ERRORS.unknown }
  }
  return { ok: true }
}

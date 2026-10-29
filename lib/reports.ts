export type ReportTarget = 'profile' | 'lobby'

export const REPORT_CATEGORIES = [
  { id: 'harassment', label: 'Harassment or abuse' },
  { id: 'spam', label: 'Spam or scam' },
  { id: 'cheating', label: 'Cheating or hacks' },
  { id: 'underage', label: 'Seems under 18' },
  { id: 'fake_profile', label: 'Fake or copied profile' },
  { id: 'other', label: 'Something else' },
] as const

export const REPORT_ERRORS: Record<string, string> = {
  report_self: 'You cannot report yourself or your own lobby.',
  report_target_missing: 'That profile or lobby no longer exists.',
  report_limit: 'You have sent many reports today. Please try again tomorrow.',
  report_duplicate: 'You already reported this in the last 24 hours. Thank you, we will look at it.',
  profile_required: 'Finish your profile before sending a report.',
  invalid: 'Please check the report details. If you pick "Something else", add at least 10 characters.',
  not_signed_in: 'Your session expired. Please sign in again.',
  unknown: 'Could not send the report. Please try again.',
}

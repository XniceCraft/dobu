/**
 * Converts an ISO datetime string into a readable "DD MMM YYYY" format.
 * @example formatDate("2026-06-12T10:30:00Z") // "12 Jun 2026"
 */
export function formatDate(iso: string): string {
  const date = new Date(iso)

  if (Number.isNaN(date.getTime())) {
    throw new RangeError(`Invalid ISO datetime string: "${iso}"`)
  }

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

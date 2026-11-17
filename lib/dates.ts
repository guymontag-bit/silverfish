export const TIME_ZONE = 'America/New_York'

// Returns the moment today began in New York, as a Date.
// Midnight in New York is 04:00 UTC during daylight time and 05:00 UTC
// otherwise, so we try 04:00 and check what hour it is in New York.
export function startOfTodayNY(now: Date = new Date()): Date {
  const ymd = now.toLocaleDateString('en-CA', { timeZone: TIME_ZONE }) // "2026-11-17"

  const hourInNY = (d: Date) =>
    Number(
      new Intl.DateTimeFormat('en-US', {
        timeZone: TIME_ZONE,
        hour: 'numeric',
        hourCycle: 'h23',
      }).format(d)
    )

  const ifDaylightTime = new Date(`${ymd}T04:00:00Z`)
  return hourInNY(ifDaylightTime) === 0
    ? ifDaylightTime
    : new Date(`${ymd}T05:00:00Z`)
}
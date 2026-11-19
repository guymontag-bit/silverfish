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

// --- Display formatting (always in New York time) ---

const dateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})

const timeFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  hour: 'numeric',
  minute: '2-digit',
})

export function formatEventDate(iso: string): string {
  return dateFormat.format(new Date(iso)) // "Thu, Oct 29"
}

export function formatEventTime(iso: string): string {
  return timeFormat.format(new Date(iso)) // "11:00 AM"
}

export function formatEventDateTime(iso: string, isAllDay: boolean): string {
  return `${formatEventDate(iso)} · ${isAllDay ? 'All day' : formatEventTime(iso)}`
}

// --- Detail page formatting ---

const longDateFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

export function formatLongDate(iso: string): string {
  return longDateFormat.format(new Date(iso)) // "Thursday, November 19, 2026"
}

// "2026-11-19": the calendar day in New York, used to compare days.
function nyDateKey(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: TIME_ZONE })
}

// Turns start/end into the two lines shown in the "When and where" panel.
export function describeWhen(
  startIso: string,
  endIso: string | null,
  isAllDay: boolean
): { dateLine: string; timeLine: string } {
  const spansDays = endIso !== null && nyDateKey(endIso) !== nyDateKey(startIso)

  if (isAllDay) {
    return {
      dateLine:
        spansDays && endIso
          ? `${formatLongDate(startIso)} – ${formatLongDate(endIso)}`
          : formatLongDate(startIso),
      timeLine: 'All day',
    }
  }

  if (spansDays && endIso) {
    return {
      dateLine: `${formatLongDate(startIso)}, ${formatEventTime(startIso)}`,
      timeLine: `through ${formatLongDate(endIso)}, ${formatEventTime(endIso)}`,
    }
  }

  return {
    dateLine: formatLongDate(startIso),
    timeLine: endIso
      ? `${formatEventTime(startIso)} – ${formatEventTime(endIso)}`
      : formatEventTime(startIso),
  }
}
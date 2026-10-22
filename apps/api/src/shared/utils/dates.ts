import PlainDateTime = Temporal.PlainDateTime;
import Instant = Temporal.Instant;

export function instantToDate(instant: Instant): Date {
  return new Date(instant.epochMilliseconds)
}

export function plainDateTimeToDate(pdt: PlainDateTime): Date {
  return instantToDate(pdt.toZonedDateTime('UTC').toInstant())
}

export function dateToPlainDateTime(d: Date): PlainDateTime {
  return PlainDateTime.from(d.toISOString())
}

export function dateToInstant(d: Date): Instant {
  return Instant.fromEpochMilliseconds(d.getTime())
}

import { format } from 'date-fns'
import utcToZonedTime from 'date-fns-tz/utcToZonedTime'

export const formatUtcToTimezone = (
  date: Date | string,
  timezone: string,
  withWeekday?: boolean
) => {
  const _format = withWeekday
    ? 'EEEE, d MMMM yyyy hh:mm aaa'
    : 'd MMMM yyyy hh:mm aaa'
  return format(utcToZonedTime(date, timezone), _format)
}

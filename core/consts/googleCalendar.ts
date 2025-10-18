import moment from 'moment'

import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'

const formatter = (date?: Date) =>
  date ? moment(date).format('YYYYMMDDTHHmmssZ') : undefined

interface IGenerateEventArgs {
  from?: Date
  to?: Date
  descriptions?: string
  location?: string
  title?: string
  timezone: string
  duration: { hours: number; minutes: number }
}

export const generateGoogleCalendar = ({
  from,
  descriptions,
  location,
  title,
  duration,
  timezone,
}: IGenerateEventArgs) => {
  return getUrlWithSearchParams(
    'https://calendar.google.com/calendar/u/0/r/eventedit',
    {
      dates: `${formatter(from)}/${formatter(
        moment(from || new Date())
          .set({
            hours: moment(from).hours() + duration.hours,
            minutes: moment(from).minutes() + duration.minutes,
          })
          .toDate()
      )}`,
      ctz: timezone,
      details: descriptions,
      location,
      text: title,
    },
    { skipEmptyString: true, skipNull: true }
  )
}

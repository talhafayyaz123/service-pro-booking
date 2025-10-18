import { onboardingRequest } from '@/api/onboarding'
import {
  CurrentWorkHours,
  IOnboardingFormState,
  ITimeItem,
} from '@/types/onboarding'

export const postOnboardingSix = async ({
  workHours,
  proAvailability,
  url,
}: {
  workHours: CurrentWorkHours[]
  proAvailability: IOnboardingFormState['proAvailability']
  url: string
}) => {
  const currentData = workHours
    .filter((el) => el.active)
    .map((rest) => rest.timePeriods)
    .flat()
    .map((item: any) => {
      return getTimeFromString(item)
    })

  const currentAvailability = {
    window: proAvailability.window.value,
    canBook: proAvailability.canBook.value,
    maxBooking: proAvailability.maxBooking.value,
    timezone:
      proAvailability.timezone?.value ||
      Intl.DateTimeFormat().resolvedOptions().timeZone,
  }

  await onboardingRequest(url, {
    createProWorkHoursDto: {
      workHours: currentData,
    },
    createProAvailabilityDto: currentAvailability,
  })
}

const getTimeFromString = (data: ITimeItem) => {
  const separateStringFrom = data.from.split(' ')
  const separateStringTo = data.to.split(' ')

  const time = {
    from: {
      hours: +separateStringFrom[0].split(':')[0],
      minutes: +separateStringFrom[0].split(':')[1],
      meridian: separateStringFrom[1],
    },
    to: {
      hours: +separateStringTo[0].split(':')[0],
      minutes: +separateStringTo[0].split(':')[1],
      meridian: separateStringTo[1],
    },
  }

  const from = `${setHour(time.from.hours, time.from.meridian)}:${
    time.from.minutes >= 10 ? time.from.minutes : `0${time.from.minutes}`
  }`

  const to = `${setHour(time.to.hours, time.to.meridian)}:${
    time.to.minutes >= 10 ? time.to.minutes : `0${time.to.minutes}`
  }`

  return {
    from,
    to,
    weekday: data.weekday,
  }
}
const setHour = (hour: number, meridian: string) => {
  if (meridian == 'pm' && hour < 12) return hour + 12
  if (meridian == 'am' && hour == 12) return hour - 12

  return hour
}

export const formatTimeTo12 = (timeString: string) => {
  const [hourString, minute] = timeString.split(':')
  const hour = +hourString % 24
  const meridiem = hour < 12 ? 'am' : 'pm'
  return `${(hour % 12 || 12).toString().padStart(2, '0')}:${minute.padStart(
    2,
    '0'
  )} ${meridiem}`
}

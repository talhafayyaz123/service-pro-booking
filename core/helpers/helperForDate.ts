import moment from 'moment'

export const helperForDate = (shortDay?: string) => {
  const wDay = moment
    .weekdaysShort()
    .find((w) => w.toLowerCase() === shortDay?.toLowerCase())

  if (wDay) {
    return moment().day(wDay)?.format('dddd')
  }

  return ''
}

export const thFormatDate = (v: Date | null | string, withoutTh?: boolean) => {
  if (!v) {
    return ''
  }
  return `${moment(v).format(withoutTh ? 'D MMMM Y' : 'Do of MMMM Y')}`
}

export const getDiffDays = (
  firstDate?: Date | string,
  secondDate?: Date | string
): number => {
  if (!firstDate || !secondDate) {
    return 0
  } else {
    const timeDiff =
      new Date(firstDate).getTime() - new Date(secondDate).getTime()

    const days = timeDiff / (1000 * 3600 * 24)

    if (days > 0 && days < 1) {
      return days
    }

    return Math.floor(days)
  }
}

export const convertTime12to24 = ({
  hours,
  modifier,
}: {
  hours: number
  modifier: string
}) => {
  let ignored = hours
  if (modifier == 'pm' && hours < 12) {
    hours += 12
    ignored += 12
  }
  if (modifier == 'am' && hours == 12) {
    ignored = 0
    hours = 24
  }

  return { hours, ignored }
}

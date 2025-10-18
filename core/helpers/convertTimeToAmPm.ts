// expected time(string): 12:23
export const convertTimeToAmPm = (time: string) => {
  try {
    const _time = time.split(':')
    let hours = Number(_time[0])
    const minutes = Number(_time[1])
    const amPm = hours >= 12 ? 'pm' : 'am'
    hours %= 12
    hours = hours || 12
    const _minutes =
      minutes === 0 ? '00' : minutes < 10 ? `0${minutes}` : minutes
    const strTime = `${hours}${_minutes ? `:${_minutes}` : ''} ${amPm}`
    return strTime
  } catch {
    return 'Invalid time'
  }
}

export function addDurationToTime(
  timeStr: string,
  durationMinutes: number
): string {
  // Function to format hours and minutes into a 12-hour format with am/pm
  const formatTime = (date: Date): string => {
    let hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12 // the hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
    return `${hours}:${formattedMinutes} ${ampm}`
  }

  // Parse the time string into a Date object
  const [time, period] = timeStr.split(' ')
  const hoursMinutes = time.split(':').map(Number)
  let hours = hoursMinutes[0]
  const minutes = hoursMinutes[1]

  if (period === 'pm' && hours < 12) hours += 12
  if (period === 'am' && hours === 12) hours = 0

  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  // Add the duration to the Date object
  date.setMinutes(date.getMinutes() + durationMinutes)

  // Format the new time into a 12-hour format with am/pm
  return formatTime(date)
}

export const formatDate = (datestring: string | Date) => {
  const [date] = datestring.toString().split('T')
  const [year, month, day] = date.split('-')
  const newDate = new Date(`${month}/${day}/${year}, 00:00:00`)
  return newDate
}

export const formatDateWithHours = (datestring: string | Date) => {
  const [date, time] = datestring.toString().split('T')
  const [year, month, day] = date.split('-')
  const [hours] = time.split('Z')
  const newDate = new Date(`${month}/${day}/${year}, ${hours}`)
  return newDate
}

export const formatDateWithMinutes = (datestring: string | Date) => {
  const [date, time] = datestring.toString().split(' ')
  const [year, month, day] = date.split('-')
  const newDate = new Date(`${month}/${day}/${year}, ${time}`)
  return newDate
}

export const formatDateWithGMT = (datestring: string | Date) => {
  const [date] = datestring.toString().split('GMT')
  if (date) {
    const newDate = new Date(date)
    return newDate
  }
  return datestring
}

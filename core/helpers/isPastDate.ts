export function isPastDate(date: string | Date): boolean {
  const givenDate = new Date(date)
  const currentDate = new Date()

  // Set current date time to 00:00:00 to compare only date parts
  currentDate.setHours(0, 0, 0, 0)

  return givenDate < currentDate
}

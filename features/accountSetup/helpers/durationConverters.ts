export const getOnlyMinutes = (d: number) => {
  const hours = Math.floor(d / 60)

  return Math.abs(d - hours * 60)
}

export const getHoursFromMinutes = (d: number) => {
  const hours = Math.floor(d / 60)

  return {
    hours,
    minutes: hours * 60,
  }
}

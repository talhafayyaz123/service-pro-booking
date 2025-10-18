export const setDurationTime = (min: number) => {
  const minutes = `${min} min`
  const hours = `${Math.floor(min / 60)} h`
  const balanceMin = min - Math.floor(min / 60) * 60
  const minString = balanceMin ? `${balanceMin}min` : ''
  if (min === 0) {
    return minutes
  } else if (!min) {
    return 0
  } else if (min < 59) {
    return minutes
  } else if (min > 59) {
    return `${hours} ${minString}`
  }
}

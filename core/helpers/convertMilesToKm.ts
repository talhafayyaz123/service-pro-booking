export const convertMileToKm = (value: number) => {
  const MILE_IN_KM = 1.60934
  const converted = MILE_IN_KM * value
  const fixed = +converted.toFixed(5)
  const integer = +Math.trunc(converted)
  const result = fixed === integer ? integer : +fixed.toFixed(2)

  return result
}

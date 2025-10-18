export const fixInteger = (v = 0) => {
  return Number.isInteger(v) ? v : Number(v.toFixed(1))
}

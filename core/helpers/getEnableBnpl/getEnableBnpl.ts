export const getEnableBnpl = (amount = 0) => {
  return amount >= 50 && amount < 2000
}

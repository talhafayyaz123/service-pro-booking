import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'

export const formatPrice = ({
  price,
  onlySign,
  currency,
}: {
  currency?: string
  onlySign?: boolean
  price?: string | number
}) => {
  const symbol = getCurrencySignByName(currency)
  if (onlySign) {
    return addMinus(price) + `${symbol}${price}`
  }
  if ((currency || '').toLowerCase() === 'usd') {
    return addMinus(price) + symbol + Math.abs(Number(price || 0)).toFixed(2)
  } else if ((currency || '').toLowerCase() === 'aed') {
    return addMinus(price) + Math.abs(Number(price)).toFixed(2) + symbol
  } else {
    return addMinus(price) + symbol + Math.abs(Number(price || 0)).toFixed(2)
  }
}

const addMinus = (price: string | number | undefined) => {
  return Number(price || '0') < 0 ? '-' : ''
}

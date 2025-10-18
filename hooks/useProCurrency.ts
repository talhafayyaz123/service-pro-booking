import { useEffect, useState } from 'react'

import { getProCurrency } from '@/api/pro/getProCurrency'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import { ICurrency } from '@/types/common'

export const useProCurrency = () => {
  const [currency, setCurrency] = useState<ICurrency | null>(null)

  useEffect(() => {
    const getCurrency = async () => {
      try {
        const res = await getProCurrency()
        const sign = getCurrencySignByName(res.currency)
        setCurrency({ label: res.currency, sign })
      } catch {
        setCurrency({ label: 'usd', sign: '$' })
      }
    }
    getCurrency()
  }, [])

  return { currency }
}

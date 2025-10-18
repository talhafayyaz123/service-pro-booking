import { API_PAYMENT } from '@/core/consts/apiLinks'
import { universalInstance } from '@/store/instance'
import { ISavedCard } from '@/types/payment'

interface IResponse {
  cards: ISavedCard[]
  total: number
}

export const getSavedCards = async () => {
  const instance = await universalInstance()

  return await instance.get<IResponse>(API_PAYMENT.getSavedCards)
}

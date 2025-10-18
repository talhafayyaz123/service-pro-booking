import { AxiosError } from 'axios'

import { API_PAYMENT } from '@/core/consts/apiLinks'
import { universalInstance } from '@/store/instance'
import { ISavedCard } from '@/types/payment'

interface Params {
  paymentMethodId: string
  setupIntentId: string
  isDefault: boolean
}

export const saveUserCard = async (params: Params) => {
  const instance = await universalInstance()

  try {
    const { data } = await instance.post<ISavedCard>(
      API_PAYMENT.saveUserCard,
      params
    )

    return data
  } catch (err) {
    return Promise.reject(err as AxiosError)
  }
}

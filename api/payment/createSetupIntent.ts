import { AxiosError, AxiosInstance } from 'axios'

import { API_PAYMENT } from '@/core/consts/apiLinks'
import { universalInstance } from '@/store/instance'
import { ISetupIntentResponse } from '@/types/payment'

export const createSetupIntent = async (axios?: AxiosInstance) => {
  const instance = await universalInstance()

  try {
    const { data } = await (axios || instance).post<ISetupIntentResponse>(
      API_PAYMENT.createSetupIntent
    )

    return data
  } catch (err) {
    return Promise.reject(err as AxiosError)
  }
}

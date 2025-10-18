import { AxiosError } from 'axios'

import { API_BOOKING } from '@/core/consts/apiLinks'
import { universalInstance } from '@/store/instance'

export const prepareBnpl = async ({
  proId,
  paymentMethod,
  services,
  addons,
  date,
}: {
  proId: string
  paymentMethod: 'KLARNA' | 'AFTERPAY' | 'AFFIRM'
  services: string[]
  addons?: string[]
  date: string
}) => {
  const instance = await universalInstance()

  try {
    const response = await instance.post(API_BOOKING.prepareBnpl, {
      proId,
      paymentMethod,
      services,
      addons,
      date,
    })
    return response
  } catch (err) {
    return Promise.reject(err as AxiosError)
  }
}

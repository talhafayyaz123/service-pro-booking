import { API_PAYMENT } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

interface Body {
  paymentMethodType: string
  currency: string
  amount: number
  bookingId: string
  customerId?: string
}

interface Response {
  clientSecret: string
  paymentIntentId: string
  customerId: string
}

export const createPaymentIntent = async (body: Body) => {
  try {
    const { data } = await instance.post<Response>(
      API_PAYMENT.createPaymentIntent,
      body
    )

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

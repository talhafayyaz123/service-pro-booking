import { API_PAYMENT } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

export const verifyPayment = async (
  paymentIntentId: string,
  bookingId: string
) => {
  try {
    const { data } = await instance.post(
      API_PAYMENT.verifyBookingPayment(bookingId),
      {
        paymentIntentId,
      }
    )

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

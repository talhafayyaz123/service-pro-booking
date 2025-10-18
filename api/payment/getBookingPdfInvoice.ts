import { AxiosError } from 'axios'

import { API_PAYMENT } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

export const getBookingPdfInvoice = async (
  bookingId: string,
  transactionId?: string
) => {
  try {
    const { data } = await instance.get<{ url: string }>(
      transactionId
        ? API_PAYMENT.transactionInvoice(bookingId, transactionId)
        : API_PAYMENT.bookingPdfInvoice(bookingId)
    )

    return data
  } catch (err) {
    return Promise.reject(err as AxiosError)
  }
}

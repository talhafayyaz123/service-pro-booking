import { AxiosError } from 'axios'

import { API_PAYMENT } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

export const getRefundPdfInvoice = async (refundId: string) => {
  try {
    const { data } = await instance.get<{ url: string }>(
      API_PAYMENT.refundPdfInvoice(refundId)
    )

    return data
  } catch (err) {
    return Promise.reject(err as AxiosError)
  }
}

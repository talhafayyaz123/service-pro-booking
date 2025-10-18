import { AxiosError } from 'axios'

import { API_PAYMENT } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

interface Params {
  cardId: string
}

export const deleteSavedCard = async ({ cardId }: Params) => {
  try {
    const { data } = await instance.delete(API_PAYMENT.deleteUserCard(cardId))

    return data
  } catch (err) {
    return Promise.reject(err as AxiosError)
  }
}

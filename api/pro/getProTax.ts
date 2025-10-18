import { AxiosError } from 'axios'

import { API_LINKS } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

interface Response {
  taxPercent: number
}

export const getProTax = async () => {
  try {
    const { data } = await instance.get<Response>(API_LINKS.proTax)

    return data
  } catch (err) {
    return Promise.reject(err as AxiosError)
  }
}

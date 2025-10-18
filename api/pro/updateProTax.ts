import { AxiosError } from 'axios'

import { API_LINKS } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

interface Body {
  taxPercent: number
}

export const updateProTax = async ({ taxPercent }: Body) => {
  try {
    const { data } = await instance.post<Body>(API_LINKS.proTax, { taxPercent })

    return data
  } catch (err) {
    return Promise.reject(err as AxiosError)
  }
}

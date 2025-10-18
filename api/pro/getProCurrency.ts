import { API_USER } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

interface Response {
  currency: string
}

export const getProCurrency = async () => {
  try {
    const { data } = await instance.get<Response>(API_USER.proCurrency)

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

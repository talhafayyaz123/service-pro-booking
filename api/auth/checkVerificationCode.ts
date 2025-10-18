import { API_LINKS } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

interface Response {
  result: boolean
}

interface Params {
  phone: string
  phoneCode: string
  token: string
}

export const checkVerificationCode = async ({
  phone,
  phoneCode,
  token,
}: Params) => {
  try {
    const { data } = await instance.post<Response>(
      API_LINKS.checkVerificationCode,
      { phone, token, phoneCode }
    )

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

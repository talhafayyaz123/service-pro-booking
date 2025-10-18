import { API_LINKS } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

interface Params {
  phone: string
  phoneCode: string
}

export const sendPhoneVerification = async ({ phone, phoneCode }: Params) => {
  try {
    const { data } = await instance.post(API_LINKS.sendPhoneVerification, {
      phone,
      phoneCode,
    })

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

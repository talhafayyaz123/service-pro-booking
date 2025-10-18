import { API_LINKS } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

interface Response {
  isExist: boolean
}

interface Params {
  email: string
}

export const checkEmail = async ({ email }: Params) => {
  try {
    const { data } = await instance.post<Response>(API_LINKS.checkEmail, {
      email,
    })
    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

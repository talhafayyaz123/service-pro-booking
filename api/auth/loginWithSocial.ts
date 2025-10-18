import { API_LINKS } from '@/core/consts/apiLinks'
import { api } from '@/lib/api'
import { IAuthResponse } from '@/types/authTypes'

interface Body {
  socialNetwork: string
  id: string
  name: string
  role: string
  email: string
  token: string
  refToken?: string
}

export const loginWithSocial = async (body: Body) => {
  try {
    const { data } = await api.post<IAuthResponse>(API_LINKS.socialLogin, body)

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

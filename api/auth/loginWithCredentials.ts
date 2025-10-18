import { API_LINKS } from '@/core/consts/apiLinks'
import { api } from '@/lib/api'
import { IAuthPayload } from '@/types/authTypes'

export const loginWithCredentials = async (body: IAuthPayload) => {
  try {
    const { data } = await api.post(API_LINKS.login, body)
    return { res: data, status: true }
  } catch (err: any) {
    return Promise.reject(err.response.data)
  }
}

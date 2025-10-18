import { API_LINKS } from '@/core/consts/apiLinks'
import { api } from '@/lib/api'
import { IAuthResponse, IRegisteredClientBody } from '@/types/authTypes'

export const registerUser = async (body: IRegisteredClientBody) => {
  try {
    const { data } = await api.post<IAuthResponse>(API_LINKS.register, body)

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

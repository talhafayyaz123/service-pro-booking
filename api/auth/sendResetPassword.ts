import { API_LINKS } from '@/core/consts/apiLinks'
import { api } from '@/lib/api'

export const sendResetPassword = async (email: string) => {
  try {
    const { data } = await api.post(API_LINKS.sendResetPassword, { email })

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

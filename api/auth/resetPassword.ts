import { API_LINKS } from '@/core/consts/apiLinks'
import { api } from '@/lib/api'

interface Body {
  password: string
  hash: string
}

export const resetPassword = async (body: Body) => {
  try {
    const { data } = await api.post(API_LINKS.resetPassword, body)

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

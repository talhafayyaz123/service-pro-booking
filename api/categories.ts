import { API_LINKS } from '@/core/consts/apiLinks'
import { api } from '@/lib/api'

export const getMainOfServices = async <T>(search?: string) => {
  return await api.get<T>(API_LINKS.mainCategory, {
    params: {
      search,
    },
  })
}

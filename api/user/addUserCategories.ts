import { API_LINKS } from '@/core/consts/apiLinks'
import { getHeaderToken } from '@/core/helpers/getHeaderToken'
import { api } from '@/lib/api'

export const addUserCategories = async (
  categories: string[],
  token: string
) => {
  try {
    const { data } = await api.post(
      API_LINKS.addUserCategories,
      { categories },
      {
        headers: getHeaderToken(token),
      }
    )

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

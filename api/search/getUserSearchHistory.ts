import { API_SEARCH } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

interface Response {
  data: {
    text: string
    createdAt: string
  }[]
}

export const getUserSearchHistory = async () => {
  try {
    const { data } = await instance.get<Response>(API_SEARCH.searchV2, {
      params: {
        // to identify that the request is from web
        source: 'web',
      },
    })

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

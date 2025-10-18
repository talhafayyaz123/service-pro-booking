import { ICardData } from '@/components/cards/SearchLongCard'
import { API_SEARCH } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'
import { ICategory } from '@/types/categoriesTypes'
import { IResponseData } from '@/types/common'

interface Args {
  params?: Record<string, string | boolean | number>
}

interface IResponse extends IResponseData<ICardData> {
  categories: ICategory[]
}

export const getProsForSearch = async ({ params }: Args) => {
  try {
    const { data } = await instance.get<IResponse>(API_SEARCH.searchV2, {
      params: {
        ...params,
        // to identify that the request is from web
        source: 'web',
      },
    })

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

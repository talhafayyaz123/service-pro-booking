import { AxiosRequestHeaders } from 'axios'

import { API_SEARCH } from '@/core/consts/apiLinks'
import { IProInfo } from '@/features/profile/profileType'
import { api } from '@/lib/api'
import { IResponseData } from '@/types/common'

interface Params {
  query?: string
  serviceType?: string
  priceFrom?: string
  priceTo?: string
  sortBy?: string
  topRated?: string
  openNow?: string
  nearest?: string
  limit?: number
  page?: number
}

interface Headers {
  Authorization?: string
  'X-Info-Latitude'?: string
  'X-Info-Longitude'?: string
}

interface Props {
  params: Params
  headers: Headers
}

export const getSearchResults = async ({ params, headers }: Props) => {
  try {
    const { data } = await api.get<IResponseData<IProInfo>>(
      API_SEARCH.searchV2,
      {
        params: {
          ...params,
          // to identify that the request is from web
          source: 'web',
        },
        headers: headers as AxiosRequestHeaders,
      }
    )

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

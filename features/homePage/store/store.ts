import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { getSession } from 'next-auth/react'

import { ICardData } from '@/components/cards/SearchLongCard'
import { locationDefaultHeaders } from '@/core/consts/common'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { getLocalLocation } from '@/features/search/helpers/localLocation'
import { baseURL } from '@/store/instance'
import { IResponseData } from '@/types/common'

export const mainPageApi = createApi({
  reducerPath: 'mainPageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers) => {
      const localLocation = getLocalLocation()

      const session = await getSession()
      headers.set('accept', `application/json`)
      headers.set('Content-Type', `application/json`)
      headers.set('Authorization', `Bearer ${session?.user.accessToken}`)
      if (localLocation.lat && localLocation.lng) {
        headers.set(locationDefaultHeaders.lat, localLocation.lat)
        headers.set(locationDefaultHeaders.lng, localLocation.lng)
      }
      return await headers
    },
  }),

  endpoints: (build) => ({
    getFeaturedPros: build.query<IResponseData<ICardData>, void>({
      query: () => {
        return {
          url: getUrlWithSearchParams('/v1/search-v2', {
            topBookingCount: true,
            paidPro: true,
            box: getLocalLocation().box?.join(','),
            countryCode: getLocalLocation().countryCode,
          }),
          method: 'get',
        }
      },
      keepUnusedDataFor: 0,
    }),

    getLatestPros: build.query<IResponseData<ICardData>, void>({
      query: () => {
        return {
          url: getUrlWithSearchParams('/v1/search-v2', {
            sortBy: 'NEWEST',
            box: getLocalLocation().box?.join(','),
            countryCode: getLocalLocation().countryCode,
          }),
          method: 'get',
        }
      },
      keepUnusedDataFor: 0,
    }),
  }),
})

export const { useGetFeaturedProsQuery, useGetLatestProsQuery } = mainPageApi

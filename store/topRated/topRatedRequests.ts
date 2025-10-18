import { createAsyncThunk } from '@reduxjs/toolkit'

import { inspirationRequest } from '@/api/inspirationRequest'
import { ICardData } from '@/components/cards/SearchLongCard'
import { API_HOMEPAGE } from '@/core/consts/apiLinks'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { getLocalLocation } from '@/features/search/helpers/localLocation'
import { IRequestParams, IResponseData } from '@/types/common'

import { instance } from '../instance'

export const getRecentlyThunk = createAsyncThunk<
  IResponseData<ICardData>,
  IRequestParams
>('getRecentlyThunk', async () => {
  const response = await inspirationRequest(
    getUrlWithSearchParams(API_HOMEPAGE.recent, {})
  )
  return response.data
})

export const getTopRatedThunk = createAsyncThunk<
  IResponseData<ICardData>,
  IRequestParams
>('getTopRatedThunk', async () => {
  const location = getLocalLocation()

  const isCountry = location.place === 'country'
  const params = {
    ...(isCountry
      ? { countryCode: location.countryCode, box: location.box.join(',') }
      : {
          countryCode: location.countryCode,
          box: location.box.join(','),
          topRated: true,
        }),
  }
  const { data } = await instance.get(
    getUrlWithSearchParams(API_HOMEPAGE.nearestTopRated, params),
    { headers: { ignoreLocalLocation: 'ignoreLocalLocation' } }
  )
  return data
})

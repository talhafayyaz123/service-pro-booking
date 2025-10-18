import { createAsyncThunk } from '@reduxjs/toolkit'

import { getOnboardingInfo } from '@/api/onboarding'
import { API_LINKS } from '@/core/consts/apiLinks'
import { getServerSideUrl } from '@/core/helpers/getUrlWithSearchParams'
import { baseURL, instance, serverSideInstance } from '@/store/instance'
import { ICategoriesResponse } from '@/types/categoriesTypes'
import { IOnboardingRequest } from '@/types/onboarding'

export const getMainOfServicesThunk = createAsyncThunk(
  'getMainOfServicesThunk',
  async (data?: ICategoriesResponse) => {
    const url = new URL(API_LINKS.mainCategory, baseURL).toString()

    return data ? { data } : await instance.get<ICategoriesResponse>(url)
  }
)
interface IProps {
  token: string
  headersParams?: Record<string, string>
}

export const getMainOfServices = async ({ token, headersParams }: IProps) => {
  try {
    const { data } = await serverSideInstance({
      token,
      headersParams,
    }).get<ICategoriesResponse>(getServerSideUrl(API_LINKS.mainCategory))
    return data
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getOnboardingInfoThunk = createAsyncThunk(
  'getOnboardingInfoThunk',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getOnboardingInfo<IOnboardingRequest>()
      if (res) {
        return res
      } else {
        rejectWithValue({ error: 'error' })
      }
    } catch (err) {
      return rejectWithValue(err)
    }
  }
)

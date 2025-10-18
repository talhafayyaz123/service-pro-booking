import { createAsyncThunk } from '@reduxjs/toolkit'
import { GetServerSidePropsContext } from 'next/types'
import { getToken } from 'next-auth/jwt'

import { API_LINKS, API_ONBOARDING, API_USER } from '@/core/consts/apiLinks'
import { getHeaderToken } from '@/core/helpers/getHeaderToken'
import { getServerSideUrl } from '@/core/helpers/getUrlWithSearchParams'
import { getUserInfoRequest } from '@/features/userProfile/store/userProfileRequests'
import { IUserInfo } from '@/features/userProfile/types'
import { api } from '@/lib/api'
import { instance } from '@/store/instance'
import { setModal } from '@/store/modals/modalsSlice'

export const meRequest = createAsyncThunk(
  'meRequest',
  async (token: string | undefined, { dispatch }) => {
    try {
      const res = await instance.get<IUserInfo>(API_USER.me)
      await dispatch(getUserInfoRequest(res.data))
      return res
    } catch (e) {
      // console.log('error')
      return Promise.reject(e)
    }
  }
)

export const setUserCategoriesRequest = createAsyncThunk(
  'setUserCategoriesRequest',
  async (categories: string[], { dispatch }) => {
    try {
      const response = await instance.post(API_LINKS.addUserCategories, {
        categories,
      })
      dispatch(setModal({}))
      dispatch(meRequest())

      return response
    } catch (e) {
      Promise.reject(e)
    }
  }
)

export const checkPasswordRequest = createAsyncThunk(
  'checkPasswordRequest',
  async (password: string) => {
    return instance.post(getServerSideUrl(API_USER.checkPassword), {
      password,
    })
  }
)

export const checkOnboarding = async (ctx: GetServerSidePropsContext) => {
  const token = await getToken(ctx)
  const headers: any = {
    ...(token?.accessToken ? getHeaderToken(token.accessToken) : {}),
  }

  try {
    return await api.get<ICheckOnboardingResponse>(
      getServerSideUrl(API_ONBOARDING.check),
      {
        headers,
      }
    )
  } catch (e) {
    return Promise.reject(e)
  }
}

export interface ICheckOnboardingResponse {
  steps: {
    mainCategory: true
    additionalCategory: true
    businessDetail: true
    proAvailability: true
    services: true
    proContacts: true
    termsOfPayment: true
    additionalInfo: true
    proFaq: true
  }
  percentage: number
}

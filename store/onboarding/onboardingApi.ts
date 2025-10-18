import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { getSession } from 'next-auth/react'

import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { locationDefaultHeaders } from '@/core/consts/common'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { IBasicInfoForm } from '@/features/accountSetup/stepsV2/BasicInfoV2/types'
import { useBusinessDetailStep } from '@/features/accountSetup/stepsV2/BusinessDetailV2/BusinessDetailV2'
import { serviceTypes } from '@/features/accountSetup/stepsV2/BusinessDetailV2/constants'
import { TTypeOfServices } from '@/features/accountSetup/stepsV2/BusinessDetailV2/types'
import { getLocalLocation } from '@/features/search/helpers/localLocation'
import { baseURL } from '@/store/instance'

export const onboardingApi = createApi({
  reducerPath: 'onboardingApi',
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
    getBasicInfo: build.query<IBasicInfoResponse, void>({
      keepUnusedDataFor: 0,
      query: () => {
        return {
          url: getUrlWithSearchParams(API_ONBOARDING.basicInfo, {}),
          method: 'get',
        }
      },
    }),
    setBasicInfo: build.mutation<IBasicInfoResponse, IBasicInfoForm>({
      query: (data) => {
        return {
          url: getUrlWithSearchParams(API_ONBOARDING.basicInfo, {}),
          method: 'post',
          body: {
            bio: data.bio,
            businessName: data.businessName,
            iconUrl: data.file.iconUrl,
          },
        }
      },
    }),

    getBusinessDetail: build.query<IBusinessDetails, void>({
      keepUnusedDataFor: 0,
      query: () => {
        return {
          url: getUrlWithSearchParams(API_ONBOARDING.businessDetailStep, {}),
          method: 'get',
        }
      },
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const response = await queryFulfilled

          const setState = useBusinessDetailStep.getState().setState

          const typeOfServices: TTypeOfServices[] = []
          serviceTypes.forEach((key) => {
            if (response?.data?.[key] === true) {
              typeOfServices.push(key)
            }
          })

          setState({
            travelFee: response.data.travelFee,
            address: response.data.address,
            latitude: response?.data.latitude,
            longitude: response?.data.longitude,
            typeOfServices,
            distance: {
              label: response?.data?.coverArea
                ? String(response?.data?.coverArea)
                : '0',
              value: response?.data?.coverArea ?? 0,
            },
          })
        } catch (e) {
          //
        }
      },
    }),
    setBusinessDetail: build.mutation<IBasicInfoResponse, any>({
      query: (data) => {
        return {
          url: getUrlWithSearchParams(API_ONBOARDING.businessDetailStep, {}),
          method: 'post',
          body: data,
        }
      },
    }),
  }),
})

export interface IBasicInfoResponse {
  id: string
  iconUrl: string
  businessName: string
  bio: string
  restrictedWords: string[]
  validationMsg?: string
  validationScore: number
  validationStatus?: boolean
}

export interface IBusinessDetails {
  address: string
  businessName: string
  countryCode: string
  coverArea: number
  id: string
  isInHome: boolean
  isInPerson: boolean
  isInVenue: boolean
  isMobile: boolean
  isVirtual: boolean
  latitude: number
  longitude: number
  travelFee: number
}

export const {
  useGetBasicInfoQuery,
  useSetBasicInfoMutation,
  useGetBusinessDetailQuery,
  useSetBusinessDetailMutation,
} = onboardingApi

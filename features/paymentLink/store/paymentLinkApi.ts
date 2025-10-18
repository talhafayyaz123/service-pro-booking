import { createApi } from '@reduxjs/toolkit/dist/query/react'

import { transformInfoByExternalLink } from '@/features/paymentLink/store/helpers/transformInfoByExternalLink'
import { baseQuery } from '@/features/paymentLink/store/paymentBaseQuery'
import {
  loadFromLocalStorage,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import {
  IExternalAuthParams,
  IExternalAuthResponse,
  IExternalInfo,
  IVerifyOTPParams,
  TransformPLResponse,
} from '@/features/paymentLink/store/types'

export const paymentLinkApi = createApi({
  reducerPath: 'paymentLinkApi',
  tagTypes: [],
  baseQuery,

  endpoints: (build) => ({
    getInfoByExternalLink: build.query<TransformPLResponse, string>({
      query: (bookingId) => ({
        url: `/v1/payments/external/${bookingId}`,
      }),
      transformResponse: (response: IExternalInfo) => {
        return transformInfoByExternalLink(response)
      },
      onQueryStarted: async (linkId, { queryFulfilled }) => {
        const setPaymentStore = usePaymentLinkStore.getState().setStore

        try {
          const res: any = await queryFulfilled
          const persistStore = loadFromLocalStorage()

          const tipAmountFinal =
            persistStore?.tipAmountFinal || res.data.tip || res.data.tipPercent
              ? (res.data.totalAmount * res.data.tipPercent) / 100
              : 0

          await setPaymentStore({
            tipAmountFinal,
            linkId,
          })
        } catch (e) {
          //
        }
      },
    }),
    checkEmail: build.query<{ isExist: boolean }, string>({
      keepUnusedDataFor: 0,
      query: (email) => ({
        url: '/v1/auth/register/check-email',
        method: 'post',
        data: { email },
      }),
    }),
    checkPhoneNumber: build.mutation<
      { isExist: boolean },
      { phone: string; phoneCode: string }
    >({
      query: (data) => ({
        url: '/v1/auth/external/check-phone',
        method: 'post',
        data,
      }),
    }),

    externalAuth: build.query<IExternalAuthResponse, IExternalAuthParams>({
      keepUnusedDataFor: 0,
      query: (data) => {
        return {
          url: '/v1/auth/external/auth',
          method: 'post',
          data,
        }
      },
      transformResponse: (response: IExternalAuthResponse) => {
        // save accessToken when external user is registered or signed up
        const setPaymentStore = usePaymentLinkStore.getState().setStore
        setPaymentStore({
          accessToken: response.accessToken.token,
        })

        return response
      },
    }),
    sendVerification: build.query<{ result: true }, IVerifyOTPParams>({
      keepUnusedDataFor: 0,
      query: (params) => ({
        url: '/v1/auth/send/verification',
        data: params,
        method: 'post',
      }),
    }),
    sendVerifyCode: build.query<{ result: true }, IVerifyOTPParams>({
      keepUnusedDataFor: 0,
      query: (params) => ({
        url: '/v1/auth/verify',
        data: params,
        method: 'post',
      }),
    }),
  }),
})

export const {
  useGetInfoByExternalLinkQuery,
  useLazyCheckEmailQuery,
  useLazySendVerificationQuery,
  useCheckPhoneNumberMutation,
  useLazyExternalAuthQuery,
  useLazySendVerifyCodeQuery,
} = paymentLinkApi

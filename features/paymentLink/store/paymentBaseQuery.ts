import { BaseQueryFn } from '@reduxjs/toolkit/dist/query/react'
import * as Sentry from '@sentry/nextjs'
import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios'

import { getAndCheckPLCookiesInfo } from '@/features/paymentLink/constants'
import { baseURL } from '@/store/instance'

interface CustomError {
  error: boolean
  status: number | string
  data: any
  message: string
}

export const plInstance = axios.create({
  baseURL,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
})

plInstance.interceptors.request.use(
  async (config) => {
    const creds = getAndCheckPLCookiesInfo()

    if (config.headers) {
      config.headers['accept'] = 'application/json'
      config.headers['Content-Type'] = 'application/json'
      config.headers['Cache-Control'] = 'no-cache'
      config.headers['Pragma'] = 'no-cache'

      if (creds?.accessToken?.token) {
        config.headers['Authorization'] = `Bearer ${
          creds?.accessToken?.token ?? ''
        }`
      }
    }
    return config
  },
  (error) => {
    Sentry.captureException(error)

    return Promise.reject(error)
  }
)
plInstance.interceptors.response.use(
  (config) => {
    // Handle successful responses
    return config
  },
  (error) => {
    // Log response error to Sentry
    Sentry.captureException(error)

    return Promise.reject(error)
  }
)

const axiosBaseQuery = async ({
  url,
  method,
  data,
  params,
}: AxiosBaseQueryArgs) => {
  try {
    const response = await plInstance.request({
      url,
      method: method ?? 'get',
      data,
      params,
    })

    return { data: response.data }
  } catch (axiosError) {
    const err = axiosError as AxiosError

    throw {
      error: true,
      status: err.response?.status ?? 'UNKNOWN',
      data: err.response?.data,
      message: err.message,
    } as any
  }
}
interface AxiosBaseQueryArgs {
  url: string
  method?: Method
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
}

export const baseQuery: BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  CustomError
> = async (args) => {
  try {
    const result = await axiosBaseQuery(args)
    return { data: result.data }
  } catch (error) {
    return { error: error as CustomError }
  }
}

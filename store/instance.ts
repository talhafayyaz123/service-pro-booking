import * as Sentry from '@sentry/nextjs'
import axios from 'axios'
import { PreviewData } from 'next'
import { GetServerSidePropsContext } from 'next/types'
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { ParsedUrlQuery } from 'querystring'

import { locationDefaultHeaders } from '@/core/consts/common'
import { getHeaderToken } from '@/core/helpers/getHeaderToken'
import { getLocalLocation } from '@/features/search/helpers/localLocation'

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL

export const instance = axios.create({
  baseURL,
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
  },
})

instance.interceptors.request.use(
  async (config) => {
    if (!config.headers) {
      config.headers = {}
    }
    const ignoreLocalLocation = config.headers.ignore_local_location

    if (typeof window !== 'undefined') {
      const session = await getSession()

      const token = session?.user.accessToken || ''

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }

      const localLocation = getLocalLocation()

      if (localLocation.lat && localLocation.lng && !ignoreLocalLocation) {
        config.headers[locationDefaultHeaders.lat] = localLocation.lat
        config.headers[locationDefaultHeaders.lng] = localLocation.lng
      }
    }

    if (ignoreLocalLocation) {
      delete config.headers['ignore_local_location']
    }

    return config
  },
  (error) => {
    // Log request error to Sentry
    Sentry.captureException(error)

    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
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

export const serverSideInstance = ({
  token,
  headersParams,
}: {
  token?: string
  headersParams?: Record<string, string>
}) => {
  const innerServerSideInstance = axios.create({
    baseURL,
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? getHeaderToken(token) : {}),
      ...headersParams,
    },
  })

  innerServerSideInstance.interceptors.request.use(
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

  innerServerSideInstance.interceptors.response.use(
    (response) => {
      // Handle successful responses
      return response
    },
    (error) => {
      // Log response error to Sentry
      Sentry.captureException(error)

      return Promise.reject(error)
    }
  )

  return innerServerSideInstance
}

export const universalInstance = async (
  ctx?: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  if (ctx) {
    const token = await getToken(ctx)
    const innerUniversalInstance = axios.create({
      baseURL,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? getHeaderToken(token?.accessToken || '') : {}),
      },
    })

    innerUniversalInstance.interceptors.request.use(
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

    innerUniversalInstance.interceptors.response.use(
      (response) => {
        // Handle successful responses
        return response
      },
      (error) => {
        // Log response error to Sentry
        Sentry.captureException(error)

        return Promise.reject(error)
      }
    )

    return innerUniversalInstance
  } else {
    return instance
  }
}

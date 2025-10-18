import * as Sentry from '@sentry/nextjs'
import axios from 'axios'

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
})

api.interceptors.request.use(
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

api.interceptors.response.use(
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

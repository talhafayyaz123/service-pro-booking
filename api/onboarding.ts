import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { baseURL, instance } from '@/store/instance'
import { ICategory } from '@/types/categoriesTypes'

export const onboardingRequest = async <T = unknown>(url: string, data: T) => {
  await instance.post(url, data)
}

export const getOnboardingInfo = async <T>() => {
  const url = new URL(API_ONBOARDING.getAllOnboarding, baseURL).toString()

  return await instance.get<T>(url)
}

export const getAdditionalCategories = async () => {
  const url = new URL(API_ONBOARDING.additionalCategory, baseURL).toString()

  const { data } = await instance.get<{ categories: ICategory[] }>(url)

  return data
}

export const getMainCategory = async () => {
  const url = new URL(API_ONBOARDING.mainCategory, baseURL).toString()

  const { data } = await instance.get<ICategory>(url)

  return data
}

export const checkOnboarding = async () => {
  const url = new URL(API_ONBOARDING.check, baseURL).toString()
  try {
    const { data } = await instance.get<ICheckResponse>(url)

    return data
  } catch (e) {
    return Promise.reject(e)
  }
}

export const checkOnboardingv2 = async () => {
  const url = new URL(API_ONBOARDING.check2, baseURL).toString()
  try {
    const { data } = await instance.get<ICheckResponseV2>(url)

    return data
  } catch (e) {
    return Promise.reject(e)
  }
}

interface ICheckResponse {
  steps: {
    mainCategory: boolean
    additionalCategory: boolean
    businessDetail: boolean
    proAvailability: boolean
    services: boolean
    proContacts: boolean
    termsOfPayment: boolean
    additionalInfo: boolean
    proFaq: boolean
  }
  percentage: number
}
export interface ICheckResponseV2 {
  steps: {
    otp: boolean
    basicInfo: boolean
    businessTypes: boolean
    businessDetail: boolean
    services: boolean
    portfolio: boolean
  }
  percentage: number
}

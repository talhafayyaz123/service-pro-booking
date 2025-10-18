import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { baseURL, instance } from '@/store/instance'

export interface IResponse {
  categories: {
    id: string
    iconUrl: string
    name: string
    color: string
    proCount: number
  }[]
  total: number
}

export const getbusinessTypes = async () => {
  const url = new URL(API_ONBOARDING.businessTypes, baseURL).toString()
  try {
    const { data } = await instance.get<IResponse>(url)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

export const getstepBusinessTypes = async () => {
  const url = new URL(API_ONBOARDING.businessTypesStep, baseURL).toString()
  try {
    const { data } = await instance.get<IResponse>(url)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

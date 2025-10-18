import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { baseURL, instance } from '@/store/instance'

export interface IResponse {
  id: string
  longitude: number
  latitude: number
  address: string
  coverArea: number
  travelFee: number
  businessName: string
  isInPerson: boolean
  isInHome: boolean
  isInVenue: boolean
  isMobile: boolean
  isVirtual: boolean
  countryCode: string
}

export const getstepBusinessDetail = async () => {
  const url = new URL(API_ONBOARDING.businessDetailStep, baseURL).toString()
  try {
    const { data } = await instance.get<IResponse>(url)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

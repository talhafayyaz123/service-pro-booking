import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { baseURL, instance } from '@/store/instance'

interface IResponse {
  id: string
  iconUrl: string
  businessName: string
  bio: string
}

export const getstepBasic = async () => {
  const url = new URL(API_ONBOARDING.basicInfo, baseURL).toString()
  try {
    const { data } = await instance.get<IResponse>(url)
    return data
  } catch (error) {
    return Promise.reject(error)
  }
}

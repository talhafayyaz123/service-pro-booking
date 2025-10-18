import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { baseURL, instance } from '@/store/instance'
import { IBasicInfo } from '@/types/onboarding'

interface IResponse {
  id: string
  iconUrl: string
  businessName: string
  bio: string
}

export const stepBasic = async (data: IBasicInfo) => {
  const url = new URL(API_ONBOARDING.basicInfo, baseURL).toString()
  try {
    const { data: res } = await instance.post<IResponse>(url, data)
    return res
  } catch (e) {
    return Promise.reject(e)
  }
}

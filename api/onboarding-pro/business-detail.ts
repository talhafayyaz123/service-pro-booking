import { IResponse } from '@/api/onboarding-pro/get-business-detail'
import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { baseURL, instance } from '@/store/instance'
import { IBusinessDetail } from '@/types/onboarding'

export const stepBusinessDetail = async (data: IBusinessDetail) => {
  const url = new URL(API_ONBOARDING.businessDetailStep, baseURL).toString()
  try {
    const { data: res } = await instance.post<IResponse>(url, data)
    return res
  } catch (e) {
    return Promise.reject(e)
  }
}

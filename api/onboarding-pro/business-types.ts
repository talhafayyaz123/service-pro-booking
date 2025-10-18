import { IResponse } from '@/api/onboarding-pro/get-business-types'
import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { baseURL, instance } from '@/store/instance'
import { IBusinessTypes } from '@/types/onboarding'

export const stepBusinessTypes = async (data: IBusinessTypes) => {
  const url = new URL(API_ONBOARDING.businessTypesStep, baseURL).toString()
  try {
    const { data: res } = await instance.post<IResponse>(url, data)
    return res
  } catch (e) {
    return Promise.reject(e)
  }
}

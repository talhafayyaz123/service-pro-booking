import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { baseURL, instance } from '@/store/instance'
import { IPortfolio } from '@/types/onboarding'

interface IResponse extends IPortfolio {
  id: string
}

export const stepPortfolio = async (data: IPortfolio) => {
  const url = new URL(API_ONBOARDING.additionalInfo, baseURL).toString()
  try {
    const { data: res } = await instance.post<IResponse>(url, data)
    return res
  } catch (e) {
    return Promise.reject(e)
  }
}

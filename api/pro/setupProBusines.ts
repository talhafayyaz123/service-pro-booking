import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'
import { ISetupBusiness } from '@/types/onboarding'

export const setupProBusiness = async (body: ISetupBusiness) => {
  try {
    const { data } = await instance.post(API_ONBOARDING.setupBusiness, body)

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

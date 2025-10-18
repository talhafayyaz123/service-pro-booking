import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'
import { ISetupBusiness } from '@/types/onboarding'

export const getProBusinessData = async () => {
  try {
    const { data } = await instance.get<ISetupBusiness>(
      API_ONBOARDING.setupBusiness
    )

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

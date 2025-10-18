import { AxiosError } from 'axios'

import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { getHeaderToken } from '@/core/helpers/getHeaderToken'
import { instance } from '@/store/instance'
import { ICheckOnboardingResponse } from '@/store/me/meRequests'

export const checkProCompleteProfile = async (token: string) => {
  try {
    const { data } = await instance.get<ICheckOnboardingResponse>(
      API_ONBOARDING.check,
      {
        headers: getHeaderToken(token),
      }
    )

    return data
  } catch (err) {
    return Promise.reject(err as AxiosError)
  }
}

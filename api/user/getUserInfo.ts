import { AxiosError } from 'axios'

import { API_USER } from '@/core/consts/apiLinks'
import { getHeaderToken } from '@/core/helpers/getHeaderToken'
import { getServerSideUrl } from '@/core/helpers/getUrlWithSearchParams'
import { IUserInfo } from '@/features/userProfile/types'
import { api } from '@/lib/api'

export const getUserInfo = async (token: string) => {
  try {
    const { data } = await api.get<IUserInfo>(getServerSideUrl(API_USER.me), {
      headers: getHeaderToken(token),
    })

    return data
  } catch (err) {
    return Promise.reject(err as AxiosError)
  }
}

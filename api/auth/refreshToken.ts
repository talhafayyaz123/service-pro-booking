import jwt_decode from 'jwt-decode'

import { API_LINKS } from '@/core/consts/apiLinks'
import { getHeaderToken } from '@/core/helpers/getHeaderToken'
import { api } from '@/lib/api'
import { baseURL } from '@/store/instance'
import { IAuthResponse } from '@/types/authTypes'

interface Body {
  token: string
  id: string
}

export const refreshToken = async (body: Body, token?: string) => {
  try {
    let headers: any = {}
    const url = new URL(API_LINKS.refreshToken, baseURL).toString()
    if (token) {
      headers = { ...getHeaderToken(token) }
    }
    //eslint-disable-next-line
    console.log('refreshing token...')
    const { data } = await api.post<
      Pick<IAuthResponse, 'refreshToken' | 'accessToken'>
    >(url, body, {
      headers,
    })
    const { accessToken, refreshToken } = data
    const decodedToken = jwt_decode(accessToken.token)

    //eslint-disable-next-line
    console.log('token refreshed!!!')

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      refreshTokenId: refreshToken.id,
      accessTokenExp: (decodedToken as any).exp,
    }
  } catch (err: any) {
    //eslint-disable-next-line
    console.log('refreshToken.ts file err:', err?.response?.data)
    return Promise.reject(err)
  }
}

import jwt_decode from 'jwt-decode'

import { API_LINKS } from '@/core/consts/apiLinks'
import { getHeaderToken } from '@/core/helpers/getHeaderToken'
import { IAuthResponse } from '@/types/authTypes'

interface Body {
  token: string
  id: string
}

type TAuthResponse = Pick<IAuthResponse, 'refreshToken' | 'accessToken'>

export const refreshTokenWithFetch = async (body: Body, token?: string) => {
  try {
    let headers: any = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }

    const url = new URL(
      API_LINKS.refreshToken,
      process.env.NEXT_PUBLIC_BASE_URL
    ).toString()

    if (token) {
      headers = { ...headers, ...getHeaderToken(token) }
    }

    //eslint-disable-next-line
    console.log('fetch: refreshing token...')

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: headers,
    })

    const data: TAuthResponse = await response.json()

    const { accessToken, refreshToken } = data
    const decodedToken = jwt_decode(accessToken.token)

    //eslint-disable-next-line
    console.log('fetch: token refreshed', decodedToken)

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      refreshTokenId: refreshToken.id,
      accessTokenExp: (decodedToken as any).exp,
    }
  } catch (err: any) {
    //eslint-disable-next-line
    console.log('refreshTokenWithFetch.ts file err:', String(err))

    return Promise.reject(err)
  }
}

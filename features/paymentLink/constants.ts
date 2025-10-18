import moment from 'moment'
import { destroyCookie, parseCookies, setCookie } from 'nookies'

import {
  IExternalAuthResponse,
  IPLCookieData,
} from '@/features/paymentLink/store/types'

export const PAY_CREDENTIAL = 'PAY_CREDENTIAL'

export const setCookiePLAuthInfo = (data: IExternalAuthResponse) => {
  let duration

  // Разбор времени жизни токена
  const timeValue = parseInt(data.accessToken.expiresIn.slice(0, -1), 10)
  const timeUnit = data.accessToken.expiresIn.slice(-1)

  switch (timeUnit) {
    case 'h':
      duration = moment.duration(timeValue, 'hours')
      break
    case 'd':
      duration = moment.duration(timeValue, 'days')
      break
    case 'm':
      duration = moment.duration(timeValue, 'minutes')
      break
    default:
      duration = moment.duration(15, 'minutes')
      break
  }

  const expiresInMinutes = duration.asMinutes()

  const cookieData: IPLCookieData = {
    data: data,
    setAt: moment().toISOString(),
    expiresIn: String(expiresInMinutes),
  }

  setCookie(undefined, PAY_CREDENTIAL, JSON.stringify(cookieData), {
    maxAge: expiresInMinutes * 60,
  })
}

export const getAndCheckPLCookiesInfo = (): null | IPLCookieData['data'] => {
  const cookies = parseCookies()
  const cookieData = cookies?.[PAY_CREDENTIAL]
  if (!cookieData) {
    return null
  }

  const { data, setAt, expiresIn } = JSON.parse(cookieData) as IPLCookieData
  const setTime = moment(setAt)
  const currentTime = moment()

  const timePassed = currentTime.diff(setTime, 'minutes')
  const expiryBuffer = 10
  const tokenValid = timePassed < Number(expiresIn) - expiryBuffer

  if (!tokenValid) {
    destroyCookie(undefined, PAY_CREDENTIAL)
    return null
  } else {
    return data
  }
}

export const buttonsPercent = [10, 15, 20]

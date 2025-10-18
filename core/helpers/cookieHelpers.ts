import { setCookie } from 'nookies'

interface Args {
  path?: string
  role?: string
  refToken?: string
}

export const setAuthCookies = ({ role, path = '', refToken }: Args) => {
  if (role) {
    setCookie(undefined, 'role', role, {
      maxAge: 60,
      path: '/',
    })
  }
  if (role === 'PRO' && refToken) {
    setCookie(undefined, 'refToken', refToken, {
      maxAge: 60,
      path: '/',
    })
  }
  setCookie(undefined, 'fromPage', path, {
    maxAge: 60,
    path: '/',
  })
}

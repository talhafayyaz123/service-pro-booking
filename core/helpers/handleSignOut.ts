import { destroyCookie } from 'nookies'

import {
  AUTHORIZED_CLIENT_DATA,
  PRO_ACCOUNT_EMAIL,
  SWITCHED_FROM_CLIENT,
} from '@/core/consts/common'
import { removePersistedCustomFormData } from '@/features/customForm/helpers/persistFormMethods'

const handleSignOutNookies = () => {
  destroyCookie(null, 'next-auth.session-token')
  destroyCookie(null, 'next-auth.csrf-token')
  destroyCookie(null, '__Secure-next-auth.session-token')
}
export const handleSignOut = () => {
  // remove AUTHORIZED_PRO_DATA about authorized user from session storage
  removePersistedCustomFormData()
  localStorage.clear()
  // Clear sessionStorage
  sessionStorage.clear()
  // Clear all cookies

  document.cookie.split(';').forEach((cookie) => {
    const name = cookie.split('=')[0].trim()
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
  })
  handleSignOutNookies()
  // remove PRO_ACCOUNT_EMAIL from localStorage
  localStorage.removeItem(PRO_ACCOUNT_EMAIL)

  // remove client data
  localStorage.removeItem(AUTHORIZED_CLIENT_DATA)

  // remove SWITCHED_FROM_CLIENT, this is used to identify while user changes profiles
  sessionStorage.removeItem(SWITCHED_FROM_CLIENT)
}

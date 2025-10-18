import { PRO_ACCOUNT_EMAIL } from '@/core/consts/common'

export const setMarkAboutProAccount = (email?: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRO_ACCOUNT_EMAIL, email || '')
  }
}

export const getMarkerAboutPro = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(PRO_ACCOUNT_EMAIL)
  }
}

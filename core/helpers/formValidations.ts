import getT from 'next-translate/getT'

import { API_USER } from '@/core/consts/apiLinks'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { checkSingleDomainEmail } from '@/core/helpers/check-domain-email'
import { postEmailForValidateRequest } from '@/store/auth/authResponce'
import { instance } from '@/store/instance'

export const isValidEmail = (email: string) =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )

export const setValidate = async (email: string) => {
  const t = await getT('en', TRANSLATE_KEYS.common)
  if (!isValidEmail(email)) {
    return t('errors.invalid_email')
  }
}

export const onValidatePassword = async (v: string) => {
  const a = await instance.post(API_USER.checkPassword, {
    password: v,
  })
  return !a?.data?.result ? 'Wrong password' : true
}
export const onValidEmail = async (value: string) => {
  if (!isValidEmail(value) || checkSingleDomainEmail(value)) {
    return 'Please enter a valid email address'
  }

  try {
    const res = await postEmailForValidateRequest(value)
    if (res.data.isExist) {
      return 'This email is already in use by another user'
    } else {
      return true
    }
  } catch (e) {
    return 'This email is already in use by another user'
  }
}

export const passwordValidation = (value: string) => {
  const passwordRegex =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  return passwordRegex.test(value)
}

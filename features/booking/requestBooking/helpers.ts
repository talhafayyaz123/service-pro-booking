import { signIn } from 'next-auth/react'

import { registerUser } from '@/api/auth/registerUser'
import { useCaptch } from '@/features/captcha/useCaptcha'

export const useRegisterdUserV2 = () => {
  const protectedSignIn = useCaptch('signIn')
  const protectedRegister = useCaptch('register')

  return async ({
    body,
    setError,
    setStep,
  }: {
    body: any
    setError: any
    setStep: any
  }) =>
    protectedRegister(async (error) => {
      if (error) {
        //
      } else {
        try {
          const res = await registerUser(body)

          await protectedSignIn(async () => {
            await signIn('credentials', {
              user: JSON.stringify(res),
              redirect: false,
            })
            await setStep()
          })
        } catch (e: any) {
          if (e?.response?.data?.phone === errors.PHONE_NUMBER_ALREADY_EXISTS) {
            return setError('phoneNumber', {
              message: 'An account with this phone number already exists',
            })
          }
          if (e?.response?.data?.email === errors.EMAIL_ALREADY_EXISTS) {
            return setError('email', { message: 'Email already exists' })
          }
          if (e?.response?.data?.email === errors.INVALID_EMAIL) {
            return setError('email', { message: 'Invalid email' })
          }

          //
        }
      }
    })
}

const errors = {
  PHONE_NUMBER_ALREADY_EXISTS: 'PHONE_NUMBER_ALREADY_EXISTS',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  INVALID_EMAIL: 'INVALID_EMAIL',
}

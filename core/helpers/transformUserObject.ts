import { Session } from 'next-auth'

import { IAuthResponse } from '@/types/authTypes'

export const transformUserObject = (session: Session): IAuthResponse => {
  const {
    role,
    name,
    email,
    phone,
    phoneCode,
    isVerified,
    accessToken,
    refreshToken,
    refreshTokenId,
    lastName,
    firstName,
  } = session.user

  return {
    name: (name || '') as string,
    phone,
    phoneCode,
    isVerified,
    lastName,
    firstName,
    email: email || '',
    role,
    accessToken: {
      expiresIn: '',
      token: accessToken,
    },
    refreshToken: {
      expiresIn: '',
      token: refreshToken,
      id: refreshTokenId,
    },
  }
}

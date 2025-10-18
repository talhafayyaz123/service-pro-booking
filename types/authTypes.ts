import { IOptions, IPhoneCode, TRole } from '@/types/common'

export interface IAuthResponse {
  accessToken: {
    token: string
    expiresIn: string
  }
  refreshToken: {
    token: string
    expiresIn: string
    id: string
  }
  name: string
  firstName?: string
  lastName?: string
  role: TRole
  phone?: string
  phoneCode?: string
  isVerified: boolean
  email: string
  country?: string
}

export interface IAuthPayload {
  email: string
  password: string
  role: TRole
}

export interface ICompleteProfile {
  firstName: string
  lastName: string
  country?: string
  email?: string
  phone?: string
  phoneCode?: string
  countryCode?: string
  hearAboutUs?: string
}

export interface IRegisterClientForm {
  firstName: string
  lastName: string
  password: string
  email: string
  phoneNumber: string
  hearAboutUs: { label: string; value: string }
  phoneNumberCode: IPhoneCode
  country: IOptions
  recieveNotifications: boolean
  agreement: boolean
}

export interface IProRegisterForm {
  firstName: string
  lastName: string
  password: string
  phoneNumber: string
  phoneNumberCode: IPhoneCode
  country: IOptions
  email?: string
  agreement: boolean
  is18older: boolean
  hearAboutUs: { label: string; value: string }
}

export type TAuthProviders = 'apple' | 'google' | 'facebook'

export interface IRegisteredClientBody {
  email: string
  password: string
  name: string
  country?: string
  phone: string
  recieveNotifications?: boolean
  countryCode?: string
  refToken?: string
  signupSource?: string
}

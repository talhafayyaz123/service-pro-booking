import { TSteps } from '@/features/accountSetup/helpers/steps'
import { IOptions, IPhoneCode, TRole } from '@/types/common'

import { ICategory, ICategoryService } from './categoriesTypes'

export interface IOnboardingProps {
  onNextStep: () => void
  onBack: () => void
  percentage: number
  step: TSteps
  type: TRole
  query?: string
}

export interface IWelcomeProps
  extends Omit<IOnboardingProps, 'type' | 'percentage'> {
  type: TSteps
  trialDays: number | string
}

export interface IDefaultWorkHours {
  weekday: string
  from: string
  to: string
  empty?: boolean
  fromTime: string // 11:30
  toTime: string
}

export interface ITimeItem {
  from: string
  to: string
  weekday: string
}

export interface CurrentWorkHours {
  active: boolean
  id?: string
  weekday: TSelected
  timePeriods: { from?: string; to?: string; weekday: TSelected }[]
}

export interface IProFAQs {
  question: string
  answer: string
  order: number | null
}

export type TBusinessTypes = Pick<ICategory, 'id' | 'name' | 'isMain'>

export interface IOnboardingRequest {
  birthday?: string
  mainCategoryId?: string
  businessName?: string
  categories?: { id: string; name: string }[]
  accountId?: string
  services?: ICategoryService[]
  proAvailability?: {
    window: number | null
    canBook: number | null
    maxBooking: number | null
    timezone: string | null
  }
  workHours?: IDefaultWorkHours[]
  proFAQs?: IProFAQs[]
  businessDetail?: {
    type: number | null
    longitude: number | null
    latitude: number | null
    address: string
    coverArea: number | null
    travelFee: number | null
    businessName: string
    isInPerson: boolean
    isMobile: boolean
    isVirtual: boolean
    proId: string
  }
  proContacts?: {
    email: string
    phone: string
    phoneCode: string
  }
  additionalInfo?: {
    bio: string
    links: string[]
    additionalPolicies: string
    portfolioPhotos: {
      url: string
      order: number
    }[]
  }
  termsOfPayments?: {
    payInCash: boolean
    payInApp: boolean
    description: string
  }
}

export interface IOnboardingFormState<T = unknown> {
  birthday: Date | null
  mainCategoryId: string
  businessName: string
  categories: Record<string, boolean>
  accountId: string
  services: ICategoryService[]
  hasServices?: boolean
  proAvailability: {
    window: { value: number | null | string }
    canBook: { value: number | null | string }
    maxBooking: { value: number | null | string }
    timezone: IOptions | null
  }
  workHours: T
  proFAQs: IProFAQs[]
  businessDetails: ISetupBusinessForm
  businessDetail: ISetupBusinessForm
  proContacts: {
    email: string
    phone: string
    phoneCode: IPhoneCode
    phoneCheckbox: boolean
    emailCheckbox: boolean
  }
  additionalInfo: {
    bio: string
    additionalPolicies: string
    links: { link: string }[]
    portfolioPhotos: {
      url: string
      order: number
    }[]
  }
  termsOfPayments: {
    payInCash: boolean
    payInApp: boolean
    description: string
    tax?: number
  }
}

export interface ISetupBusinessForm {
  longitude?: number
  latitude?: number
  address?: string
  coverArea?: IOptions
  travelFee?: number
  businessName?: string
  isInPerson: boolean
  isMobile: boolean
  isInHome?: boolean
  isInVenue?: boolean
  isVirtual: boolean
  name: 'useName' | 'createBusinessName' | null
  isMiles?: boolean
  countryCode: string
}

export interface ISetupBusiness {
  type: number
  longitude?: number
  latitude?: number
  address?: string
  coverArea?: number
  travelFee?: number
  businessName?: string
  isInPerson: boolean
  isMobile: boolean
  isVirtual: boolean
  isInVenue?: boolean
  isInHome?: boolean
  countryCode: string
  timezone?: string
}

export type TSelected =
  | 'Sun'
  | 'Mon'
  | 'Tue'
  | 'Wed'
  | 'Thu'
  | 'Fri'
  | 'Sat'
  | 'all'

export interface IBusinessDayState {
  from: {
    time: string
    meridiem: string
  }
  to: { time: string; meridiem: string }
  index?: number
}

export interface IListedCheck {
  steps: { otp: boolean; portfolio: boolean; services: boolean }
}

export interface IBasicInfo {
  businessName: string
  iconUrl: string
  bio: string
}

export interface IPortfolio {
  portfolioPhotos: { url: string; order: number }[]
}

export interface IBusinessTypes {
  categories: string[]
}

export interface IBusinessDetail {
  longitude: number
  latitude: number
  address: string
  coverArea: number
  travelFee: number
  isInHome: boolean
  isInVenue: boolean
  isMobile: boolean
  isVirtual: boolean
  timezone: string
  countryCode: string
}

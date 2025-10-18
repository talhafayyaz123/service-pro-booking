import { ICategory, IService } from '@/types/categoriesTypes'
import { TRole } from '@/types/common'
import { IDefaultWorkHours } from '@/types/onboarding'

export interface IProfileServices {
  categoriesBlock: IProfileCategory[]
}

export interface IProfileCategory {
  id: string
  iconUrl: string
  name: string
  color: string
  categories: IService[]
}

export interface IProfileAbout {
  id: string
  bio: string
  email: string
  phone: string
  phoneCode: string
  address: string
  latitude: number
  longitude: number
  distance: number
  coverArea: number
  additionalPolicies: string
  workHours: IDefaultWorkHours[]
  links: string[]
  faq: { question: string; answer: string }[]
  timezone: string
  linksNew?: { link: string; title: string }[]
}

export interface IProInfo {
  accountId: string
  id: string
  name: string
  iconUrl: string
  categories: ICategory[]
  address: string
  latitude: number | null
  longitude: number | null
  isFollowing: boolean
  rating: number
  distance: number
  photos: string[]
  country?: string
  slug: string
  timezone: string
  directLink: string
}

export interface ISimilarPro extends IProInfo {
  isMobile: boolean
  isInPerson: boolean
  isVirtual: boolean
}

export interface IRating {
  fiveStars: number
  fourStars: number
  threeStars: number
  twoStars: number
  oneStars: number
  total: number
  reviewCount: number
}

export interface IProfileReview {
  id: string
  description: string
  createdDate: string
  rating: number

  answers: {
    accountId: string
    createdAt: string
    description: string
    id: string
    reviewId: string
    userInfo: {
      businessName: string
      firstName: string
      iconUrl: string
      lastName: string
    }
  }[]
  photos: { url?: string }[]
  service: {
    id: string
    name: string
    isMobile: true
    price: number
    duration: number
    isExtraTime: boolean
    extraTime: number
    description: string
    categoryId: string
    order: number
    status: string
  }[]
  pro: {
    id: string
    birthday: string
    accountId: string
    mainCategoryId: string
    businessName: string
    isInPerson: boolean
    isMobile: boolean
    isVirtual: boolean
    bio: string
  }
  userInfo: {
    email: string
    firstName: string
    lastName: string
    iconUrl: string
    country: string
    role: TRole
    categories: [
      {
        id: string
        iconUrl: string
        name: string
        proCount: number
      }
    ]
  }
}

export type TDepositType = 'FIXED' | 'OFF' | 'PERCENT_OF_SERVICE' | 'FULL_PRICE'

export interface ITermsOfPayment {
  id: string
  payInCash: boolean
  payInApp: boolean
  payInBnpl: boolean
  description: string
  depositType: TDepositType
  currency: string
  amount: number
  taxPercent: number
  percentOfService: number
  cancellationRule: number
  travelFee: number
}

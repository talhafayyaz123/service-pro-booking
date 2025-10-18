import { ReactNode } from 'react'

import { IAddOn } from '@/features/booking/store/bookingStore'
import { IQuestion } from '@/features/customForm/types'

import { IService } from './categoriesTypes'
import { ITermsOfPayment } from './common'
import { ISavedCard } from './payment'

export type TBookingCardStatus =
  | 'NO_SHOW'
  | 'PENDING'
  | 'ONGOING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'PAYMENT_FAILED'
  | 'DEPOSIT_REQUESTED'

export interface IBookingCard {
  proName: string
  iconUrl: string
  cardStatus: TBookingCardStatus
  services: Pick<IService, 'id' | 'duration' | 'name' | 'extraTime'>[]
  className?: string
  totalPrice: string | number
  date?: string
  startTime?: string
  id?: string
  loading?: boolean
  footerNode?: ReactNode
  review?: IReviewBooking
  currencySign?: string
  addons?: IAddOn[]
  totalDuration?: number
  addonsDuration?: number
}

export interface IBokingService {
  id: string
  name: string
  price: number
  duration: number
  extraTime: number
}

export interface IBookingPro {
  id: string
  firstName: string
  lastName: string
  address: string | null
  longitude?: number | null
  latitude?: number | null
  iconUrl?: string
  currency: string
  slug: string
  accountId: string
  taxPercent: number
  timezone: string
}

export interface IBooking {
  id: string
  amount: number
  taxAmount: number
  date: string
  comment: string | null
  address: string | null
  services: IBokingService[]
  pro: IBookingPro
  status: TBookingCardStatus
  review?: IReviewBooking
  addons?: IAddOn[]
  addonsDuration?: number
}

export type TBookingsStatus = 'UPCOMING' | 'PREVIOUS'

export enum BOOKINGS_BOTTOMSHEET_ENUM {
  VIEW_BOOKING = 'VIEW_BOOKING',
}
export interface IReviewBooking {
  id?: string
  images?: []
  rating?: number
  text?: string
  createAt: string
}
export interface IViewBooking {
  address: string
  amount: number
  comment: string
  date: string
  id: string
  createdAt: string
  distance: number
  duration: number
  clientLongitude: number | null
  clientLatitude: number | null
  bookingCard: ISavedCard
  review: IReviewBooking
  pro: IBookingPro
  services: Pick<
    IService,
    'duration' | 'id' | 'name' | 'price' | 'extraTime' | 'color'
  >[]
  status: TBookingCardStatus
  termsOfPayment: ITermsOfPayment
  refund: IRefund | null
  travelFee: null | number
  timezone: string
  taxAmount: null | number
  isInHome?: boolean
  isInPerson: boolean
  isInVenue: boolean
  isMobile: boolean
  isVirtual: boolean
  isWalkIn: boolean
  addons: IAddOn[]
  paymentMethod: TPaymentMethods
  tipsAmount: number
  taxPercent: number
  discounts: any[]
  additionalFees: any[]
  pendingBalance: {
    amount: number
    bnplCancelAmount: number
    createdAt: string
    fee: number
    id: string
    net: number
    paymentIntentId: string
    status: PendingBalanceStatus
    type: TransactionTypeEnum
  }
  transactions: {
    amount: number
    createdAt: string
    id: string
    paymentMethod: string
    paymentStatus: string
    readyhubbFee: number
    stripeFee: number
    stripeNet: number
    type: string
  }[]
  formAnswers: {
    title: string
    isRequired: boolean
    id: string
    isAnswered?: boolean
    description: string
    customFormId: string
    answers: IQuestion[]
  }[]
}
export type TPaymentMethods =
  | 'KLARNA'
  | 'AFTERPAY'
  | 'AFFIRM'
  | 'PAY_IN_APP'
  | 'PAY_IN_CASH'
  | 'GOOGLE_PAY'
  | 'APPLE_PAY'

export type TRefundStatus = 'APPROVED' | 'DECLINED' | 'PENDING'

export interface IRefund {
  amount: number
  bookingId: string
  createdAt: string
  extra: any[]
  id: string
  services: {
    id: string
    isMobile?: boolean
    name: string
    price: number
  }[]
  status: TRefundStatus
  tips: boolean
  updatedAt: string
}

export interface IReview {
  stars: number[]
  tip: null | number
  isCustom: boolean
  customTip: null | string
  createdAt: string
  comment: string
  images: string[]
}

export interface ILeaveReviewParams {
  bookingId: string
  amount?: number
  proId: string
  images?: string[]
  rating: number
  text?: string
}

export enum PendingBalanceStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum TransactionTypeEnum {
  DEPOSIT = 'DEPOSIT',
  DEPOSIT_TRANSFER = 'DEPOSIT_TRANSFER',
  CANCELLATION_FEE = 'CANCELLATION_FEE',
  NO_SHOW_FEE = 'NO_SHOW_FEE',
  DEPOSIT_REFUND = 'DEPOSIT_REFUND',
  BOOKING_COMPLETED = 'BOOKING_COMPLETED',
  EXTRA_CHARGE = 'EXTRA_CHARGE',
  TIPS = 'TIPS',
  QUICKPAY = 'QUICKPAY',
  WITHDRAWAL = 'WITHDRAW',
  REFERRAL = 'REFERRAL',
  // ADD_FUNDS = 'ADD_FUNDS',
}

export enum AdditionalFeeEnum {
  EXTRA_CHARGES = 'EXTRA_CHARGES',
}

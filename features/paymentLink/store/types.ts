import { IAddOn } from '@/features/booking/store/bookingStore'
import { TDepositType } from '@/features/profile/profileType'
import {
  TBookingCardStatus,
  TBookingsStatus,
  TPaymentMethods,
  TRefundStatus,
} from '@/types/booking'
import { IOptions } from '@/types/common'

export interface IQuickPay {
  id: string
  notes: string
  amount: number
  tax: number
  tip: number
  tipPercent: number
  tipType: 'FIXED' | 'PERCENT' | null
  totalAmount: number
  paymentMethod: 'PAYMENT_LINK'
  client: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    phoneCode: string
    role: string
    iconUrl: string
  }
  pro: {
    id: string
    businessName: string
    iconUrl: string
    currency: string
    taxPercent: number
  }
  createdAt: '2024-08-13T13:30:16.905Z'
}
export interface IExternalInfo {
  id: string
  link: string
  status: 'ACTIVE' | 'PAID' | 'CANCELLED'
  type: 'BOOKING_COMPLETED' | 'QUICKPAY' | 'DEPOSIT_TRANSFER'
  tip: number
  tipPercent: number
  tipType: 'FIXED' | 'PERCENT' | null
  quickpay: IQuickPay
  booking: {
    id: string
    accountId: string
    date: string
    duration: number
    completedAt: string
    createdAt: string
    updatedAt: string
    address: string | null
    amount: number
    taxAmount: number
    isMobile: boolean
    isVirtual: boolean
    isInPerson: boolean
    isInHome: boolean
    isInVenue: boolean
    comment: string
    status: TBookingCardStatus
    paymentStatus: TRefundStatus
    isPriceChanged: boolean
    paymentMethod: TPaymentMethods
    tipsAmount: number
    tipsType: string | null
    bookingStatus: TBookingsStatus
    travelFee: number | null
    services: {
      id: string
      proServiceId: string
      name: string
      isMobile: boolean
      price: number
      duration: number
      isExtraTime: boolean
      extraTime: number
      discounts: Array<any>
    }[]
    addons: IAddOn[]
    discounts: Array<any>
    additionalFees: Array<any>
    transactions: Array<{
      id: string
      type: 'DEPOSIT_TRANSFER' | string
      paymentMethod: TPaymentMethods
      paymentStatus: 'SUCCESSFUL' | string
      amount: number
      stripeFee: number
      readyhubbFee: number
      stripeNet: number
      createdAt: string
    }>
    pro: {
      id: string
      businessName: string
      iconUrl: string
      currency: 'USD' | string
      taxPercent: number
    }
    extraCharges: Array<any>
    termsOfPayment: {
      id: string
      payInCash: boolean
      payInApp: boolean
      payInBnpl: boolean
      depositType: TDepositType
      amount: number
      percentOfService: number
      cancellationRule: number
      currency: 'USD' | string
      travelFee: number
      taxPercent: number
      description: string
    }
  }
}

export interface TransformPLResponse {
  proIcon: string
  proName: string
  createdAt: string
  tip: number
  tipPercent: number
  taxPercent: number
  taxAmount: number
  travelFee: number
  totalPrice?: number
  quickpay?: number
  amount: number
  currency: string
  totalAmount: number
  services: IExternalInfo['booking']['services']
  addons: IExternalInfo['booking']['addons']
  status: IExternalInfo['status']
  tipType: IExternalInfo['tipType']
  bookingId?: string
  quickpayId?: string
  type: IExternalInfo['type']
  booking?: IExternalInfo['booking']
}

export interface IVerifyOTPParams {
  phone: string
  phoneCode: string
  token?: string
}

export interface IExternalAuthParams {
  phone: string
  phoneCode: string
  email: string
  firstName: string
  lastName: string
  createAccount: boolean
  password?: string
}

export interface IExternalAuthResponse {
  accessToken: {
    token: string
    expiresIn: string
  }
  email?: string
  name: string
  firstName: string
  lastName: string
  role: string
  isVerified: boolean
  phone: string
  phoneCode: string
}

export interface IPLCookieData {
  data: IExternalAuthResponse
  setAt: string // in ISO
  expiresIn: string //in min
}

export interface IPaymentStore {
  isAgree: boolean
  setStore: (
    params: Partial<
      Pick<
        IPaymentStore,
        | 'isAgree'
        | 'tipAmount'
        | 'tipPercent'
        | 'isCreateAccount'
        | 'step'
        | 'paymentMethod'
        | 'bnpl'
        | 'tipAmountFinal'
        | 'isExistUser'
        | 'finalErrorMessage'
        | 'isExistEmail'
        | 'isExistPhone'
        | 'email'
        | 'phoneNumber'
        | 'code'
        | 'addInfoFormStep'
        | 'verifyTimestemp'
        | 'linkId'
        | 'accessToken'
      >
    >
  ) => void
  setPaymentCreds: (params: Partial<IPaymentCreds>) => void
  addInfoFormStep: 1 | 2
  tipAmount: number | null
  tipAmountFinal: number | null
  tipPercent: number | null
  step: [number, number]
  isCreateAccount: boolean
  code: string
  email: null | string
  firstName: null | string
  lastName: null | string
  phoneNumber: null | string
  password?: string
  finalErrorMessage: string
  paymentMethod: 'card'
  bnpl: TPaymentMethods | null
  isExistUser: boolean
  paymentCreds: IPaymentCreds
  isExistPhone: boolean
  isExistEmail: boolean
  verifyTimestemp: number | null
  linkId?: string
  accessToken?: string
}

export interface IPaymentCreds {
  card: {
    isCompleteCard?: boolean
    message?: string
  }
  address: {
    value: Partial<{
      line1?: string
      line2?: string | null
      city: string
      state: string
      postal_code: string
      country: string
    }>
    phone?: string
    firstName?: string
    lastName?: string
    name?: string
    isComplete?: boolean
    message?: string
  }
}

export interface IPaymentStepOne {
  isCreateAccount: boolean
  code: IOptions
  email: null | string
  firstName: null | string
  lastName: null | string
  phoneNumber: null | string
  password?: string
  paymentMethod: 'card'
  bnpl: TPaymentMethods
}

export interface IResult {
  status: null | 'success' | 'error'
  errorMessage: string | null
}

export type IBNPLVariants = 'AFFIRM' | 'AFTERPAY' | 'KLARNA'

import { Stripe, StripeCardNumberElement } from '@stripe/stripe-js'

import { defaultPhoneCode } from '@/core/consts/countries'
import {
  IPaymentCreds,
  IPaymentStore,
  TransformPLResponse,
} from '@/features/paymentLink/store/types'

export const paymentsCredsInitial: IPaymentCreds = {
  address: {
    value: {},
    firstName: '',
    name: '',
    lastName: '',
    isComplete: false,
    phone: '',
    message: '',
  },
  card: {
    message: '',
    isCompleteCard: false,
  },
}

export const initialStore: Omit<IPaymentStore, 'setStore' | 'setPaymentCreds'> =
  {
    isAgree: false,
    tipAmount: null,
    tipAmountFinal: null,
    tipPercent: null,
    step: [1, 1] as [number, number],
    isCreateAccount: true,
    code: defaultPhoneCode?.id,
    email: null,
    firstName: null,
    lastName: null,
    phoneNumber: null,
    bnpl: null,
    paymentMethod: 'card',
    paymentCreds: paymentsCredsInitial,
    isExistUser: false,
    finalErrorMessage: '',
    isExistPhone: false,
    isExistEmail: false,
    addInfoFormStep: 1,
    verifyTimestemp: null,
    accessToken: undefined,
  }

export interface IPayExternalPlPayload {
  id: string
  stripe: Stripe | null
  card?: StripeCardNumberElement | null
  totalPriceWithTips?: number
  type?: TransformPLResponse['type']
}

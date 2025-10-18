import {
  StripeAddressElementChangeEvent,
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
} from '@stripe/stripe-js'

export interface ISavedCard {
  brand: string
  month: string
  year: string
  lastDigits: string
  isDefault: boolean
  isSubscriptionCard: boolean
  id: string
  line1: string
  line2: string
  paymentMethodId: string
  postalCode: string
  setupIntentId: string
  state: string
  city: string
  country: string
}
export interface INewPaymentElementsState {
  globalErrorMessage: string
  isDefault: boolean
  isLoading: boolean
  //
  cardNumber: {
    isComplete: boolean
    errorMessage: string | null
  }
  expiration: {
    isComplete: boolean
    errorMessage: string | null
  }
  cvc: {
    isComplete: boolean
    errorMessage: string | null
  }
  address: {
    value: StripeAddressElementChangeEvent['value']['address']
    phone: string | null
    firstName: string
    lastName: string
    name: string
    isComplete: boolean
  }
}
export interface IPaymentElementsState {
  cardNumberComplete: boolean
  expiredComplete: boolean
  nameComplete: boolean
  cvcComplete: boolean
  cardNumberError: null | string
  phone: string
  expiredError: null | string
  cvcError: null | string
  addressComplete: boolean
  firstName: string
  lastName: string
}

export type TPaymentElement =
  | 'number'
  | 'cvc'
  | 'expiration'
  | 'name'
  | 'address'

export interface IPaymentElementProps {
  error: string | null
  onChange: (args: {
    element: TPaymentElement
    evt:
      | StripeCardNumberElementChangeEvent
      | StripeCardExpiryElementChangeEvent
      | StripeCardCvcElementChangeEvent
      | StripeAddressElementChangeEvent
      | null
    name?: string
  }) => void
  label?: string
  labelClassName?: string
  placeholder?: string
}

export interface IPaymentItemsProps {
  onPaymentElementChange: IPaymentElementProps['onChange']
  paymentState: IPaymentElementsState
  error?: string | null
}

export interface ISetupIntentResponse {
  clientSecret: string
  customerId: string
}

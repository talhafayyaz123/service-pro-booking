import { AddressMode, StripeAddressElementOptions } from '@stripe/stripe-js'

import {
  IconAffirmSmall,
  IconAfterpaySmall,
  IconCard,
  IconKlarnaSmall,
} from '@/assets/icons/icons'
import {
  paymentInputClasses,
  paymentInutBaseStyles,
} from '@/hooks/usePaymentUtils'

export const cardNumberProps = {
  options: {
    showIcon: false,
    placeholder: 'XXXX-XXXX-XXXX-XXXX',
    style: {
      base: paymentInutBaseStyles,
    },
  },
  className: paymentInputClasses,
}

export const addressProps = {
  options: {
    validation: { phone: { required: 'never' } },
    fields: { phone: 'always' },
    display: { name: 'full' },
    mode: 'billing' as AddressMode,

    defaultValues: {
      phone: '',
      name: '',
      address: {
        country: 'US',
      },
    },
  } as StripeAddressElementOptions,
}

export const bnplMethods = [
  {
    icon: <IconKlarnaSmall classNaame={'stroke-black flex-shrink-0'} />,
    label: 'Klarna',
    value: 'KLARNA',
  },
  {
    icon: <IconAffirmSmall classNaame={'stroke-black flex-shrink-0'} />,
    label: 'Affirm',
    value: 'AFFIRM',
  },
  {
    icon: <IconAfterpaySmall classNaame={'stroke-black flex-shrink-0'} />,
    label: 'Afterpay',
    value: 'AFTERPAY',
  },
]

export const cardMethods = [
  {
    icon: <IconCard classNaame={'stroke-black flex-shrink-0'} />,
    label: (
      <>
        <span className="maxLaptop:hidden">Card</span>
        <span className="laptop:hidden">Credit / Debit card</span>
      </>
    ),
    value: 'card',
  },
]

export const cardMethodsDesktop = [
  {
    icon: <IconCard classNaame={'stroke-black flex-shrink-0'} />,
    label: 'Credit/Debit card',
    value: 'card',
  },
]

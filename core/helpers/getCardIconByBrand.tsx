import Image from 'next/image'

import { IconCreditCard, IconMastercardColoured } from '@/assets/icons/icons'
import { ImgVisaCalored } from '@/assets/images/images'

export const getCardIconByBrand = (brand?: string) => {
  switch (brand?.toLowerCase()) {
    case 'visa':
      return <Image src={ImgVisaCalored} alt="visa" />
    case 'mastercard':
      return <IconMastercardColoured className="h-4" />
    default:
      return <IconCreditCard className="stroke-black" />
  }
}

export const getCardBrandName = (brand?: string) => {
  switch (brand?.toLowerCase()) {
    case 'visa':
      return 'Visa'
    case 'mastercard':
      return 'MasterCard'
    default:
      return ' - '
  }
}

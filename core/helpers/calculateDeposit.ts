import { calculateDeposit as _calc } from '@/core/helpers/calculateDepositBE'
import { IService } from '@/types/categoriesTypes'
import { ITermsOfPayment } from '@/types/common'

interface Args {
  termsOfPayment: ITermsOfPayment
  services: Pick<IService, 'price'>[]
  isMobileServiceAdded: boolean
}

export const calc = _calc
export const calculateDeposit = ({
  services,
  termsOfPayment,
  isMobileServiceAdded,
}: Args) => {
  switch (termsOfPayment.depositType) {
    case 'FIXED':
      return termsOfPayment.amount || 0
    case 'FULL_PRICE': {
      const servicesTotal = services.reduce((p, c) => p + c.price, 0)
      const travelFee = isMobileServiceAdded ? termsOfPayment.travelFee || 0 : 0
      const tax = termsOfPayment.taxPercent || 0
      const totalWithoutTax = servicesTotal + travelFee
      const total = totalWithoutTax + totalWithoutTax * (tax / 100)

      return total
    }
    case 'PERCENT_OF_SERVICE': {
      const servicesTotal = services.reduce((p, c) => p + c.price, 0)
      const travelFee = isMobileServiceAdded ? termsOfPayment.travelFee || 0 : 0
      const totalWithoutPercent = servicesTotal + travelFee
      const tax = termsOfPayment.taxPercent || 0
      const percent = termsOfPayment.percentOfService || 0
      const totalWithoutTax = totalWithoutPercent * (percent / 100)
      const total = totalWithoutTax + totalWithoutTax * (tax / 100)

      return parseFloat(total.toFixed(2))
    }
    default:
      return 0
  }
}

import { ITermsOfPayment } from '@/types/common'

export function calculateDeposit({
  proTermsOfPayment,
  totalAmount,
  source,
  totalServices,
}: ICalculateDepositParams) {
  let amountDeposit = 0

  if (source === UserSourceTypeEnum.DIRECT) {
    switch (proTermsOfPayment.depositType) {
      case depositTypeEnums.PERCENT:
        amountDeposit = countPercentForBooking(
          totalAmount,
          proTermsOfPayment?.percentOfService || 0
        )
        break
      case depositTypeEnums.FULL_PRICE:
        amountDeposit = totalAmount
        break
      case depositTypeEnums.FIXED:
        amountDeposit = proTermsOfPayment.amount || 0
        break
    }

    if (amountDeposit >= totalAmount) {
      amountDeposit = totalAmount
    }

    return amountDeposit
  }

  switch (proTermsOfPayment.depositType) {
    case depositTypeEnums.PERCENT:
      if ((proTermsOfPayment?.percentOfService || 0) >= 100) {
        amountDeposit = totalAmount
        break
      }

      amountDeposit = countPercentForBooking(
        totalServices,
        proTermsOfPayment?.percentOfService || 0
      )
      break
    case depositTypeEnums.FULL_PRICE:
      amountDeposit = totalAmount
      break
    case depositTypeEnums.FIXED:
      amountDeposit = proTermsOfPayment.amount || 0
      break
  }

  if (amountDeposit === 0) {
    amountDeposit += countPercentForBooking(totalServices, 20)
  }

  amountDeposit += countPercentForBooking(
    totalServices,
    proTermsOfPayment?.clientFeePercentage || 0
  )

  if (amountDeposit >= totalAmount) {
    amountDeposit = totalAmount
  }

  return parseFloat(amountDeposit.toFixed(2))
}

export const countPercentForBooking = (total: number, percent: number) => {
  const amount = (total * percent) / 100
  return Number(amount.toFixed(4))
}

interface ICalculateDepositParams {
  proTermsOfPayment: ITermsOfPayment
  source?: UserSourceTypeEnum
  totalServices: number
  totalAmount: number
}

export enum UserSourceTypeEnum {
  DIRECT = 'DIRECT',
  MARKETPLACE_NEW = 'MARKETPLACE_NEW',
  MARKETPLACE = 'MARKETPLACE',
}

export enum depositTypeEnums {
  FIXED = 'FIXED',
  PERCENT = 'PERCENT_OF_SERVICE',
  OFF = 'OFF',
  FULL_PRICE = 'FULL_PRICE',
}

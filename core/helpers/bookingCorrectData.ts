import { countPercentForBooking } from '@/core/helpers/calculateDepositBE'
import {
  AdditionalFeeEnum,
  IViewBooking,
  PendingBalanceStatus,
  TransactionTypeEnum,
} from '@/types/booking'

interface IPaymentLabel {
  text: string
  additionalText?: { text: string; color: string }
  price: number
  discountPrice?: number
}

export const bookingCorrectData = (props: IViewBooking) => {
  const {
    services,
    addons,
    travelFee,
    taxPercent,
    transactions,
    tipsAmount,
    discounts,
    additionalFees,
    pendingBalance,
  } = props
  let data: IPaymentLabel[] = []
  let total = 0
  let taxAmount = 0
  let payAmount = 0
  let payAmountWithDiscounts = 0
  let depositAmount = 0
  let discountPrices = 0
  let totalSummaryWithDiscounts = 0

  const serviceDiscounts =
    discounts?.filter((i: any) => i.type === DiscountTypeEnum.SERVICE_ADDON) ||
    []
  const entireDiscounts =
    discounts?.filter((i: any) => i.type === DiscountTypeEnum.ENTIRE) || []

  services.forEach((i: any) => {
    const discount = serviceDiscounts.find(
      (item) =>
        item.serviceIds?.includes(i.id) ||
        item.serviceIds?.includes(i.proServiceId || '') ||
        item.serviceIds?.includes(i.bookingServiceId || '')
    )

    const discountPrice = discount
      ? calculateDiscountPrice({
          discount,
          itemPrice: i.price,
          services,
          addons,
        })
      : undefined

    data.push({
      text: i.name,
      additionalText: discount
        ? {
            text: discount.isPercent
              ? `(-${discount.percent}%)`
              : `(-$${discountPrice})`,
            color: 'orange',
          }
        : undefined,
      price: i.price,
      discountPrice: discountPrice,
    })
    total += i.price
    totalSummaryWithDiscounts += i.price - (discountPrice || 0)
    payAmount += i.price
    payAmountWithDiscounts += i.price - (discountPrice || 0)
    discountPrices += discountPrice || 0
  })

  addons.forEach((i: any) => {
    const discount = serviceDiscounts.find(
      (item) =>
        item.addonIds?.includes(i.id) ||
        item.addonIds?.includes(i.proAddonId) ||
        item.addonIds?.includes(i.bookingAddonId || '')
    )

    const discountPrice = discount
      ? calculateDiscountPrice({
          discount,
          itemPrice: i.price,
          services,
          addons,
        })
      : undefined

    data.push({
      text: i.title,
      additionalText: discount
        ? {
            text: discount.isPercent
              ? `(-${discount.percent}%)`
              : `(-$${discountPrice})`,
            color: 'orange',
          }
        : undefined,
      price: i.price,
      discountPrice: discountPrice,
    })
    total += i.price
    totalSummaryWithDiscounts += i.price - (discountPrice || 0)
    payAmount += i.price
    payAmountWithDiscounts += i.price - (discountPrice || 0)
    discountPrices += discountPrice || 0
  })

  if (travelFee) {
    data.push({ text: 'Travel fee', price: travelFee })
    total += travelFee
    totalSummaryWithDiscounts += travelFee
    payAmount += travelFee
    payAmountWithDiscounts += travelFee
  }

  const extraCharge = additionalFees?.find(
    (i) => i.type === AdditionalFeeEnum.EXTRA_CHARGES
  )

  if (extraCharge) {
    data.push({ text: 'Extra charge', price: extraCharge.amount })
    total += extraCharge.amount
    totalSummaryWithDiscounts += extraCharge.amount
    payAmount += extraCharge.amount
    payAmountWithDiscounts += extraCharge.amount
  }

  if (entireDiscounts) {
    entireDiscounts.forEach((discount) => {
      const discountPrice = discount.isPercent
        ? countPercentForBooking(payAmountWithDiscounts, discount.percent)
        : discount.price

      const newDiscountPrice =
        discountPrice && payAmountWithDiscounts >= discountPrice
          ? discountPrice
          : payAmountWithDiscounts

      data.push({
        text: 'Discount',
        price: -newDiscountPrice,
      })
      payAmountWithDiscounts -= newDiscountPrice
      totalSummaryWithDiscounts -= newDiscountPrice
      discountPrices += newDiscountPrice
    })
  }

  if (taxPercent) {
    const taxPrice = countPercentForBooking(payAmountWithDiscounts, taxPercent)
    const totalTaxPrice = countPercentForBooking(total, taxPercent)
    data.push({
      text: 'Tax',
      additionalText: { text: `(${taxPercent}%)`, color: 'grey' },
      price: taxPrice,
    })
    total += totalTaxPrice
    payAmount += totalTaxPrice
    taxAmount = taxPrice
    payAmountWithDiscounts += taxPrice
  }

  if (transactions?.length) {
    const deposit = transactions?.find(
      (i) => i.paymentStatus === 'SUCCESSFUL' && i.type === 'DEPOSIT_TRANSFER'
    )
    const clientFee = transactions?.find(
      (i) => i.paymentStatus === 'SUCCESSFUL' && i.type === 'CLIENT_FEE'
    )

    if (deposit) {
      data.push({ text: 'Deposit fee', price: -deposit.amount })
      payAmount -= deposit.amount
      payAmountWithDiscounts -= deposit.amount
      depositAmount += deposit.amount
    }

    if (clientFee) {
      const depositData = data.find((i) => i.text === 'Deposit fee')
      if (depositData) {
        data = data.filter((i) => i.text !== 'Deposit fee')
      }

      data.push({
        text: 'Deposit fee',
        price: -(clientFee.amount - (depositData?.price || 0)),
      })
      payAmount -= clientFee.amount
      payAmountWithDiscounts -= clientFee.amount
      depositAmount += clientFee.amount
    }
  }

  if (
    pendingBalance &&
    pendingBalance.status === PendingBalanceStatus.PENDING &&
    pendingBalance.type === TransactionTypeEnum.DEPOSIT
  ) {
    const depositData = data.find((i) => i.text === 'Deposit fee')
    if (depositData) {
      data = data.filter((i) => i.text !== 'Deposit fee')
    }

    data.push({
      text: 'Deposit fee',
      price: -(pendingBalance.amount - (depositData?.price || 0)),
    })
    payAmount -= pendingBalance.amount
    payAmountWithDiscounts -= pendingBalance.amount
    depositAmount += pendingBalance.amount
  }

  if (tipsAmount) {
    data.push({ text: 'Tips', price: tipsAmount })
    total += tipsAmount
    payAmount += tipsAmount
    payAmountWithDiscounts += tipsAmount
  }

  return {
    data,
    total,
    depositAmount,
    taxAmount,
    payAmount: payAmount >= 0 ? payAmount : 0,
    payAmountWithDiscounts: payAmountWithDiscounts,
    discountsAmount: payAmount - payAmountWithDiscounts,
    discountPrices,
    totalSummaryWithDiscounts,
  }
}

export interface TBookingCorrectData {
  data: IPaymentLabel[]
  total: number
  depositAmount: number
  taxAmount: number
  payAmount: number
  payAmountWithDiscounts: number
  discountsAmount: number
  discountPrices: number
  totalSummaryWithDiscounts: number
}

export enum DiscountTypeEnum {
  ENTIRE = 'ENTIRE',
  SERVICE_ADDON = 'SERVICE_ADDON',
}

const calculateDiscountPrice = ({
  discount,
  itemPrice,
  services,
  addons,
}: any) => {
  if (!discount) {
    return 0
  }

  if (discount.isPercent) {
    return countPercentForBooking(itemPrice, discount.percent)
  }

  let totalServicesAndAddons = 0

  totalServicesAndAddons +=
    services?.reduce((total: any, item: any) => {
      const active =
        discount?.serviceIds?.includes(item.proServiceId || '') ||
        discount?.serviceIds?.includes(item.id) ||
        discount?.serviceIds?.includes(item.bookingServiceId || '')

      if (active) {
        return total + item.price
      }
      return total
    }, 0) || 0

  totalServicesAndAddons +=
    addons?.reduce((total: any, item: any) => {
      const active =
        discount?.addonIds?.includes(item.proAddonId) ||
        discount?.addonIds?.includes(item.id) ||
        discount?.addonIds?.includes(item.bookingAddonId || '')

      if (active) {
        return total + item.price
      }
      return total
    }, 0) || 0

  const discountPercent = discount.price / totalServicesAndAddons

  const discountPrice = parseFloat((itemPrice * discountPercent).toFixed(2))

  return itemPrice >= discountPrice ? discountPrice : itemPrice
}

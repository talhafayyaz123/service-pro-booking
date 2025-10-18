import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { bookingCorrectData } from '@/core/helpers/bookingCorrectData'
import { calc } from '@/core/helpers/calculateDeposit'
import { countPercentForBooking } from '@/core/helpers/calculateDepositBE'
import { useGetInfoByExternalLinkQuery } from '@/features/paymentLink/store/paymentLinkApi'
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'
import { useAppSelector } from '@/hooks/hooks'
import { IViewBooking } from '@/types/booking'
import { ITermsOfPayment } from '@/types/common'

export const useBaseInfoStep = () => {
  const router = useRouter()
  const id = router.query.bookingId as string
  const { data } = useGetInfoByExternalLinkQuery(id)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const taxPercent = Math.abs(data?.taxPercent ?? 0)
  const taxAmount = data?.taxAmount ?? 0

  const travelFee = data?.travelFee ?? 0
  const { isAgree, tipPercent, tipAmount, setStore } = usePaymentLinkStore()

  const currency = data?.currency

  // Deposit requested booking, walk in booking
  const isDepositRequestedBooking =
    data?.booking && data.booking.status === 'DEPOSIT_REQUESTED'
  const booking = data?.booking
  const addedServices = booking?.services || []
  const addOns = booking?.addons || []
  const termsOfPayment = booking?.termsOfPayment
  const proInfo = useAppSelector((state) => state.profile.iProInfo.data)

  // calculate deposit
  const hasTravelFee =
    !!booking?.services.find((i) => i.isMobile) && !!termsOfPayment?.travelFee

  let total = addedServices.reduce((sum, b) => sum + b.price || 0, 0) || 0
  total += hasTravelFee ? termsOfPayment?.travelFee || 0 : 0
  total += addOns?.reduce((sum, i) => sum + i.price, 0) || 0

  const taxPercentBooking = countPercentForBooking(
    total,
    termsOfPayment?.taxPercent || 0
  )
  const totalWithPercent = taxPercentBooking + total

  // deposit and terms of payment is only used in deposit requested booking and checkout payment
  let deposit = 0
  if (termsOfPayment && proInfo.source) {
    deposit = calc({
      proTermsOfPayment: termsOfPayment as ITermsOfPayment,
      totalServices: total,
      totalAmount: totalWithPercent,
      source: proInfo.source,
    })
  }

  // Calculate Checkout numbers
  // BOOKING_COMPLETED means link is Checkout
  const isCheckoutLink = !!data?.booking && data?.type === 'BOOKING_COMPLETED'
  // calculate discounts
  let checkoutLinkData = undefined
  if (isCheckoutLink && termsOfPayment) {
    checkoutLinkData = bookingCorrectData({
      ...(data.booking as unknown as IViewBooking),
      taxPercent: termsOfPayment.taxPercent,
    })
  }

  const priceDetails = useMemo(() => {
    const result: { label: string; value: number }[] = []
    if (data?.quickpay) {
      result.push({
        label: 'Quick pay',
        value: data.quickpay,
      })
    }
    if (data?.services?.length) {
      data?.services.forEach((service) => {
        result.push({
          label: service.name,
          value: service.price,
        })
      })
    }

    if (data?.addons?.length) {
      data?.addons.map((addon) => {
        result.push({
          label: `Add-Ons • ${addon.title}`,
          value: addon.price,
        })
      })
    }

    if (travelFee) {
      result.push({
        label: 'Travel fee',
        value: travelFee,
      })
    }

    if (taxPercent || taxAmount) {
      result.push({
        label: `Tax (${taxPercent}%)`,
        value: taxAmount,
      })
    }
    if (tipPercent || tipAmount) {
      if (tipPercent) {
        result.push({
          label: 'Tip',
          value: (data?.totalAmount ?? 0) * (tipPercent / 100),
        })
      } else if (tipAmount) {
        result.push({
          label: 'Tip',
          value: tipAmount,
        })
      }
    }

    return result
  }, [
    data?.addons,
    data?.quickpay,
    data?.services,
    data?.totalAmount,
    taxAmount,
    taxPercent,
    tipAmount,
    tipPercent,
    travelFee,
  ])

  const totalPriceWithTips = priceDetails.reduce(
    (acc, item) => acc + item.value,
    0
  )

  const handleClickAgree = () => {
    setStore({ isAgree: !isAgree })
  }

  return {
    data,
    priceDetails,
    totalPriceWithTips,
    currency,
    tipPercent,
    totalPrice: data?.totalPrice,
    handleClickAgree,
    tipAmount,
    setStore,
    isAgree,
    setIsOpenDrawer,
    isOpenDrawer,
    isDepositRequestedBooking,
    deposit,
    isCheckoutLink,
    checkoutLinkData,
  }
}

export type TUseBaseInfo = ReturnType<typeof useBaseInfoStep>

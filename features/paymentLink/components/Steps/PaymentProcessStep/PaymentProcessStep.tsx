import { Stripe, StripeElements } from '@stripe/stripe-js'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import { Button } from '@/components/common/buttons/Button'
import { H16, H28 } from '@/components/typography'
import { cn } from '@/core/helpers/cn'
import { formatPrice } from '@/core/helpers/formatPrice'
import { useBaseInfoStep } from '@/features/paymentLink/components/Steps/BaseInfoStep/useBaseInfoStep'
import { Header } from '@/features/paymentLink/components/Steps/PaymentProcessStep/components/common/Header'
import { PaymentCardCreds } from '@/features/paymentLink/components/Steps/PaymentProcessStep/components/PaymentCardCreds'
import { PaymentMethodSection } from '@/features/paymentLink/components/Steps/PaymentProcessStep/components/PaymentMethodSection'
import { useGetInfoByExternalLinkQuery } from '@/features/paymentLink/store/paymentLinkApi'
import { defaultPaymentLinkBook } from '@/features/paymentLink/store/requests/defaultPaymentLinkBooking'
import { paymentLinkBnplBooking } from '@/features/paymentLink/store/requests/paymentLinkBnplBooking'
import {
  destroyLocalStoreData,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import { useMediaScreen } from '@/hooks/useMediaScreen'

export const PaymentProcessStep = (props: {
  stripe: Stripe | null
  elements: StripeElements | null
}) => {
  const router = useRouter()

  const id = router.query.bookingId as string

  const {
    totalPriceWithTips,
    data,
    isDepositRequestedBooking,
    deposit,
    isCheckoutLink,
    checkoutLinkData,
  } = useBaseInfoStep()
  const [isLoading, setIsLoading] = useState(false)
  const response = useGetInfoByExternalLinkQuery(id)

  // if payment is requested deposit then disable BNPL
  // const isEnableBnpl = !isDepositRequestedBooking

  // Client requested: hide BNPL for all type of payments
  const isEnableBnpl = false

  const { isSmall, isTablet, isLaptop } = useMediaScreen()
  const isDesktop = !isSmall && !isTablet && !isLaptop
  const plStore = usePaymentLinkStore((state) => state)

  const onSubmit = async () => {
    setIsLoading(true)
    const params = {
      stripe: props.stripe,
      card: props.elements?.getElement('cardNumber'),
      id: response?.data?.bookingId ?? response?.data?.quickpayId ?? '',
      type: data?.type,
    }

    try {
      let res
      const bnpl = usePaymentLinkStore.getState().bnpl
      if (bnpl) {
        res = await paymentLinkBnplBooking(params)
      } else {
        res = await defaultPaymentLinkBook(params)
      }

      if (res.status === 'success') {
        plStore.setStore({ step: [2, 2] })
      } else {
        plStore.setStore({
          step: [2, 3],
          finalErrorMessage: res.errorMessage ?? '',
        })
      }
      return { data: res }
    } catch (e: any) {
      plStore.setStore({
        step: [2, 3],
        finalErrorMessage: e.errorMessage ?? '',
      })

      return { data: { status: e.status, errorMessage: e.errorMessage } }
    } finally {
      setIsLoading(false)
      destroyLocalStoreData()
    }
  }
  const isDisabled = useMemo(() => {
    if (plStore.bnpl) {
      return !plStore.paymentCreds.address.isComplete
    } else {
      return (
        !plStore.paymentCreds.address.isComplete ||
        !plStore.paymentCreds.card.isCompleteCard
      )
    }
  }, [
    plStore?.bnpl,
    plStore.paymentCreds.address.isComplete,
    plStore.paymentCreds.card.isCompleteCard,
  ])

  // price for quick pay
  let price = totalPriceWithTips

  // price for deposit requested booking
  if (isDepositRequestedBooking) {
    price = deposit
  }

  // price for checkout
  if (isCheckoutLink && checkoutLinkData?.payAmountWithDiscounts) {
    price = checkoutLinkData.payAmountWithDiscounts
  }

  return (
    <section
      className="flex flex-col w-full h-full"
      id={!isSmall ? 'app_layout' : undefined}
    >
      <Header />
      <section
        className={cn(
          'flex-grow h-full z-[1] overflow-auto',
          ' laptop:relative',
          'maxLaptop:scrollbar-hide maxLaptop:flex maxLaptop:flex-col'
        )}
      >
        <div
          className={
            'z-[1] relative mx-auto laptop:max-w-[524px] w-full laptop:mt-[90px] flex flex-col gap-5'
          }
        >
          <div className="px-6 m-6 mx-auto laptop:hidden">
            <H28>Choose payment method</H28>
            <H16 color="text-gray">
              Choose the most convenient payment
              <br /> method for you
            </H16>
          </div>

          <div
            className={cn({
              ['bg-white rounded-t-3xl h-full']: !isDesktop,
            })}
          >
            <PaymentMethodSection {...props} isEnableBnpl={isEnableBnpl} />

            <PaymentCardCreds />

            <footer
              className={cn('bg-white flex mt-6 pb-[44px] laptop:mb-12 px-4 ')}
            >
              <Button
                form="PAYMENT_PROCESS"
                disabled={isDisabled}
                isLoading={isLoading}
                onClick={onSubmit}
                className="w-full"
                type="submit"
                buttonType="orange"
              >
                Pay{' '}
                {formatPrice({
                  price,
                })}
              </Button>
            </footer>
          </div>
        </div>
      </section>
      <div
        className={cn(
          'w-full absolute top-[72px]   left-0 bg-violet z-[0] h-[414px] laptop:h-[280px]'
        )}
      />
    </section>
  )
}

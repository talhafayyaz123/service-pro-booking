import classNames from 'classnames'
import moment from 'moment/moment'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import { memo } from 'react'

import { LogoButtonSubdomain } from '@/components/common/buttons/LogoButton'
import { cn } from '@/core/helpers/cn'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { useBaseInfoStep } from '@/features/paymentLink/components/Steps/BaseInfoStep/useBaseInfoStep'
import { PLFailledStep } from '@/features/paymentLink/components/Steps/failedStep/components/PLFailledStep'
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'

export const FailedStep = memo(() => {
  const {
    totalPriceWithTips,
    currency,
    isDepositRequestedBooking,
    deposit,
    isCheckoutLink,
    checkoutLinkData,
  } = useBaseInfoStep()
  const query = useRouter().query

  const queryAfterSuccessBNPL = {
    price: query?.price
      ? parseFloat(String(query?.price)) / 100
      : totalPriceWithTips,
    currency: (query?.currency as string) ?? currency,
    timestemp: query?.timestemp
      ? parseFloat(String(query?.timestemp))
      : moment().unix(),
  }

  const { setStore } = usePaymentLinkStore.getState()
  const router = useRouter()

  const handleTryAgain = () => {
    router.replace(
      getUrlWithSearchParams(queryString.parseUrl(window.location.href).url, {})
    )

    setStore({ step: [2, 1], finalErrorMessage: '' })
  }

  // price for quick pay
  let price = queryAfterSuccessBNPL.price

  // price for deposit requested booking
  if (isDepositRequestedBooking) {
    price = deposit
  }

  // price for checkout
  if (isCheckoutLink && checkoutLinkData?.payAmountWithDiscounts) {
    price = checkoutLinkData.payAmountWithDiscounts
  }

  return (
    <section className={' relative flex flex-col h-screen'}>
      <div
        className={classNames(
          'w-full absolute top-0 maxTablet:hidden  left-0 bg-violet z-[0] h-[346px]'
        )}
      />
      <header className="flex-none bg-white flex justify-center py-6 px-5 z-[2]">
        <LogoButtonSubdomain className="mr-[13px]" />
      </header>
      <div className={'z-[2] flex-grow overflow-auto '}>
        <div
          className={cn(
            'pt-4 max-w-[524px] w-full  mx-auto  bg-white z-[2] px-5 pb-6 maxTablet:h-full',
            'tablet:p-8 tablet:rounded-2xl tablet:shadow-warningCard   tablet:mt-[90px]'
          )}
        >
          <PLFailledStep
            currency={queryAfterSuccessBNPL.currency}
            price={price}
            handleTryAgain={handleTryAgain}
          />
        </div>
      </div>
    </section>
  )
})

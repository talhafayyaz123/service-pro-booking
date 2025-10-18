import classNames from 'classnames'
import moment from 'moment'
import { useRouter } from 'next/router'

import { LogoButtonSubdomain } from '@/components/common/buttons/LogoButton'
import { cn } from '@/core/helpers/cn'
import { useBaseInfoStep } from '@/features/paymentLink/components/Steps/BaseInfoStep/useBaseInfoStep'
import { PLSuccessScreen } from '@/features/paymentLink/components/Steps/successStep/components/PLSuccessScreen'

export const SuccessStep = () => {
  const {
    totalPriceWithTips,
    currency,
    data,
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
            'mt-4 w-fit mx-auto  bg-white z-[2] px-5 pb-6 ',
            'tablet:p-8 tablet:rounded-2xl tablet:shadow-warningCard tablet:h-fit tablet:mt-[90px]'
          )}
        >
          <PLSuccessScreen
            price={price}
            currency={queryAfterSuccessBNPL.currency}
            proName={data?.proName ?? ''}
            date={queryAfterSuccessBNPL.timestemp * 1000}
          />
        </div>
      </div>
    </section>
  )
}

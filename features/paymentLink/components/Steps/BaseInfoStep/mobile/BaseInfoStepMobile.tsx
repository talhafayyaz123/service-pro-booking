import { memo } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Button } from '@/components/common/buttons/Button'
import { LogoButtonSubdomain } from '@/components/common/buttons/LogoButton'
import { H16, H20 } from '@/components/typography'
import { formatPrice } from '@/core/helpers/formatPrice'
import { Card } from '@/features/accountSetup/steps/CardWrapper'
import { DepositCard } from '@/features/booking/confirmBooking/DepositCard'
import { validateFormSelector } from '@/features/customForm/store/selectors'
import { AgreeSection } from '@/features/paymentLink/components/common/AgreeSection'
import { CustomFormsWalkInBooking } from '@/features/paymentLink/components/common/CustomFormsWalkInBooking'
import { ProInfoSection } from '@/features/paymentLink/components/common/ProInfoSection'
import { TipSection } from '@/features/paymentLink/components/common/TipSection'
import { TransactionSection } from '@/features/paymentLink/components/common/TransactionSection'
import { useBaseInfoStep } from '@/features/paymentLink/components/Steps/BaseInfoStep/useBaseInfoStep'
import {
  useDepositRequestedBookingStore,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import { useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'

export const BaseInfoStepMobile = memo(() => {
  const { isSmall } = useMediaScreen()
  const info = useBaseInfoStep()
  const {
    totalPriceWithTips,
    currency,
    isAgree,
    setStore,
    isDepositRequestedBooking: isWalkInBookingDeposit,
    deposit: depositAmount,
    isCheckoutLink,
    checkoutLinkData,
  } = info

  const validationsForms = useAppSelector(validateFormSelector)
  const isRequiredFormNotFilled = Object.values(validationsForms || {}).some(
    (form) => {
      if (form.isRequiredForm) {
        return form.validate !== 'completed'
      }

      return false
    }
  )

  const bookingType = useDepositRequestedBookingStore.getState().bookingType
  const accessToken = usePaymentLinkStore.getState().accessToken

  const onClick = () => {
    if (bookingType === 'walkIn' && accessToken) {
      setStore({ step: [2, 1] })
      return
    }

    setStore({ step: [1, 2] })
  }

  // price for quick pay
  let price = totalPriceWithTips

  // price for deposit requested booking
  if (isWalkInBookingDeposit) {
    price = depositAmount
  }

  // price for checkout
  if (isCheckoutLink && checkoutLinkData?.payAmountWithDiscounts) {
    price = checkoutLinkData.payAmountWithDiscounts
  }

  return (
    <div
      className="flex flex-col h-screen laptop:hidden"
      id={!isSmall ? 'app_layout' : undefined}
    >
      <header className="px-5 mt-5 pb-4">
        <LogoButtonSubdomain className="mr-[13px]" />
        <div />
      </header>
      <section className="overflow-auto flex-grow mt-4">
        <ProInfoSection
          iconUrl={info?.data?.proIcon}
          businessName={info?.data?.proName}
          date={info?.data?.createdAt}
        />
        {!isWalkInBookingDeposit && <TipSection {...info} />}
        <TransactionSection
          {...info}
          renderDeposit={() =>
            depositAmount && isWalkInBookingDeposit ? (
              <DepositCard
                className="mb-5 mx-5"
                depositAmount={depositAmount}
              />
            ) : null
          }
        />
        {isWalkInBookingDeposit && (
          <div className="flex flex-col gap-3 mt-3 mb-6 mx-5">
            <CustomFormsWalkInBooking />
            <Card>
              <H20>Cancellation policies</H20>
              <H16 color="text-gray">
                Cancel for free up to{' '}
                <span className="text-black">12 hours ahead</span>, otherwise,
                you will lose your deposit. For{' '}
                <span className="text-black">not showing up</span> you’ll lose
                the full deposit too.
              </H16>
            </Card>
            {/* <Card>
              <H20>Other policies</H20>
              <H16 color="text-gray">
                In addition to environmental taxation, a number of other
                policies can have indirect benefits for mobilizing resources for
                sustainable development. <br />
                <br /> Another set of policies concerns the business practices,
                eroded labor standards, and weakened labor market institutions
                that have reduced.
              </H16>
            </Card> */}
          </div>
        )}
        <AgreeSection {...info} />
      </section>
      {isAgree || isWalkInBookingDeposit ? (
        <CardWrapper
          omitRole={true}
          className={
            '!mt-auto !p-0 w-full overflow-auto rounded-b-none min-h-[145px] shrink-0'
          }
        >
          <div className="flex justify-between px-5 pt-5 pb-4 border-b border-lightGray">
            <H16 className={'font-semibold'}>Amount due</H16>
            <H16 className={'font-semibold text-orange'}>
              {formatPrice({
                price,
                currency,
              })}
            </H16>
          </div>
          <div className="flex items-center justify-center p-5 pt-4">
            <Button
              onClick={onClick}
              buttonType="orange"
              className="w-full mb-16"
              disabled={
                (isWalkInBookingDeposit && isRequiredFormNotFilled) || !isAgree
              }
            >
              Continue
            </Button>
          </div>
        </CardWrapper>
      ) : (
        <div />
      )}
    </div>
  )
})

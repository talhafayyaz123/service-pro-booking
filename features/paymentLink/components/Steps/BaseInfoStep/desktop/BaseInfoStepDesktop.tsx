import classNames from 'classnames'
import { useMemo } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Button } from '@/components/common/buttons/Button'
import { LogoButtonSubdomain } from '@/components/common/buttons/LogoButton'
import { H16, H20 } from '@/components/typography'
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

export const BaseInfoStepDesktop = () => {
  const props = useBaseInfoStep()
  const { isSmall } = useMediaScreen()
  const { isDepositRequestedBooking, deposit: depositAmount } = props
  const { step, isAgree, accessToken } = usePaymentLinkStore((state) => state)
  const setStore = usePaymentLinkStore((state) => state.setStore)
  const bookingType = useDepositRequestedBookingStore(
    (state) => state.bookingType
  )
  const validationsForms = useAppSelector(validateFormSelector)
  const isRequiredFormNotFilled = Object.values(validationsForms || {}).some(
    (form) => {
      if (form.isRequiredForm) {
        return form.validate !== 'completed'
      }

      return false
    }
  )

  const isDisabled = useMemo(() => {
    let result = false

    if (step[0] === 1) {
      if ((isDepositRequestedBooking && isRequiredFormNotFilled) || !isAgree) {
        result = true
      }
    }

    return result
  }, [isAgree, step, isDepositRequestedBooking, isRequiredFormNotFilled])

  const onClick = () => {
    if (bookingType === 'walkIn' && accessToken) {
      setStore({ step: [2, 1] })
      return
    }

    setStore({ step: [1, 2] })
  }
  return (
    <section
      className="maxLaptop:hidden flex flex-col h-full w-full"
      id={!isSmall ? 'app_layout' : undefined}
    >
      <header className="px-5 laptop:px-20 flex justify-center items-center shadow-xl h-[72px] small:h-[82px]">
        <LogoButtonSubdomain className="mr-[13px]" />
      </header>
      <section className={'flex-grow h-full overflow-auto relative'}>
        <div className={'mx-auto max-w-[524px] mt-[90px]'}>
          <CardWrapper className="relative z-[1] !p-0">
            <ProInfoSection
              iconUrl={props?.data?.proIcon}
              businessName={props?.data?.proName}
              date={props?.data?.createdAt}
            />
            <TransactionSection
              {...props}
              renderDeposit={() =>
                depositAmount && isDepositRequestedBooking ? (
                  <DepositCard
                    className="mb-8 mx-10"
                    depositAmount={depositAmount}
                  />
                ) : null
              }
            />
          </CardWrapper>
          {!isDepositRequestedBooking && <TipSection {...props} />}
          {isDepositRequestedBooking && (
            <div className="flex flex-col gap-5 my-5">
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
                  policies can have indirect benefits for mobilizing resources
                  for sustainable development. <br />
                  <br /> Another set of policies concerns the business
                  practices, eroded labor standards, and weakened labor market
                  institutions that have reduced.
                </H16>
              </Card> */}
            </div>
          )}
          <AgreeSection className="mx-0" {...props} />
        </div>
        <div
          className={classNames(
            'w-full absolute top-0 maxTablet:hidden left-0 bg-violet z-[0] h-[414px]'
          )}
        />
      </section>
      <footer
        className={classNames(
          'flex items-center small:justify-end small:px-20 small:rounded-none',
          'small:shadow-xl rounded-t-[20px] justify-center px-5 s small:py-4.5 py-3'
        )}
        style={{
          boxShadow: '0px -4px 27px rgba(182, 190, 206, 0.3)',
        }}
      >
        <Button
          onClick={onClick}
          disabled={isDisabled}
          className={'w-36'}
          buttonType="3d"
        >
          Continue
        </Button>
      </footer>
    </section>
  )
}

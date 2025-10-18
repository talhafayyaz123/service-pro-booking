import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { ReactNode, useCallback, useMemo, useState } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Drawer } from '@/components/common/drawer/Drawer'
import { PaymentErrorText } from '@/components/Payment/PaymentErrorText'
import { H16, H20, H24, OrangeBlock } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { calculateDeposit } from '@/core/helpers/calculateDepositBE'
import { formatPrice } from '@/core/helpers/formatPrice'
import { IAgreeSection } from '@/features/booking/confirmBooking/IAgreeSection'
import { PaymentDropdown } from '@/features/booking/confirmBooking/PaymentDropdown'
import { useConfirmBooking } from '@/features/booking/confirmBooking/useConfirmBooking'
import { displayDepositAndWarning } from '@/features/booking/helpers/displayDepositAndWarning'
import {
  bookingDataSelector,
  depositSelector,
} from '@/features/booking/store/bookingSelectors'
import { isFullDepositSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'
import { CancellationPolicyText } from '@/shared/cancelations/CancellationPolicyText'

import {
  checkIsPayBnpl,
  checkIsPayInCash,
  checkIsPayWithCard,
} from '../bookingHelpers'
import { AddPaylaterForm } from './AddPaylaterForm'
import { AddPaymentCard } from './AddPaymentCard'

const TermsAndConditionsPro = dynamic(
  () => import('components/TermsAndConditionsPro')
)

const TermsAndConditionsClient = dynamic(
  () => import('components/TermsAndConditionsClient')
)

export const PaymentMethod = () => {
  const deposit = useAppSelector(depositSelector)
  const [highlight, setHighlight] = useState(false)
  const { t } = useTranslation(TRANSLATE_KEYS.booking)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const { data, errorMessage } = useAppSelector(bookingDataSelector)
  const bookingSource = useAppSelector(
    (state) => state.profile.iProInfo.data.source
  )

  const paymentMethod = data.paymentMethod?.value

  const isCashPay = checkIsPayInCash(paymentMethod)
  const isCardPay = checkIsPayWithCard(paymentMethod)
  const isBnpl = checkIsPayBnpl(paymentMethod)

  const showPaymentMethod = (isCashPay && deposit.amount > 0) || isCardPay

  const onOpenDrawer = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation()
    setIsOpenDrawer(true)
  }, [])

  const { totalPrice } = useConfirmBooking()

  // Diplaying "Deposit due box" and warning logic
  const displayDepositDueBoxAndWarning = displayDepositAndWarning({
    totalPrice,
    depositAmount: deposit.amount,
    isCardPay,
  })

  return (
    <CardWrapper className="p-10 mt-3 h-fit maxTablet:pt-0 maxTablet:shadow-none maxTablet:px-5 small:mt-0">
      {(bookingSource === 'MARKETPLACE' ||
        (bookingSource === 'DIRECT' && deposit.amount > 0)) && (
        <>
          <H24 className="maxTablet:hidden">
            {t('titles.select_payment_methods')}
          </H24>
          <H16 className="hidden maxTablet:block">
            {t('titles.select_payment_methods')}
          </H16>
          <PaymentDropdown />
        </>
      )}

      {errorMessage ? (
        <div className="mb-5">
          <PaymentErrorText
            error={t(`errors.${errorMessage}`, null, {
              ns: TRANSLATE_KEYS.booking,
              fallback: errorMessage,
            })}
          />
        </div>
      ) : null}
      {/* Turn this off based on client request */}
      {isBnpl ? <AddPaylaterForm /> : null}
      {bookingSource !== 'DIRECT' && displayDepositDueBoxAndWarning && (
        <ConfirmBookWarning />
      )}
      {showPaymentMethod ? <AddPaymentCard /> : null}
      {deposit ? <DepositContent highlight={highlight} /> : null}
      <IAgreeSection setHighlight={setHighlight} onOpenDrawer={onOpenDrawer} />
      <Drawer
        status={'loaded'}
        isOpen={isOpenDrawer}
        className="maxSmall:w-full"
        header={<H24>{t('titles.terms_and_conditions')}</H24>}
        headerClassName="px-4 small:px-10"
        onClose={() => setIsOpenDrawer(false)}
      >
        <div className="px-4 small:px-10 mt-14 mb-[84px]">
          <TermsDrawerContent />
        </div>
      </Drawer>
    </CardWrapper>
  )
}

export const ConfirmBookWarning = ({ mobile }: { mobile?: boolean }) => {
  const { t } = useTranslation(TRANSLATE_KEYS.booking)

  const bookingData = useAppSelector(bookingDataSelector)
  const {
    data: { paymentMethod },
    currency,
  } = bookingData
  const isFullDeposit = useAppSelector(isFullDepositSelector)
  const { totalPrice, totalTax } = useConfirmBooking()

  const deposit = useAppSelector(depositSelector)
  const source = useAppSelector((state) => state.profile.iProInfo?.data?.source)
  const termsOfPaymentData = useAppSelector(
    (state) => state.profile.termsOfPayment
  )

  const depositAmount = calculateDeposit({
    proTermsOfPayment: termsOfPaymentData.data,
    source,
    totalAmount: totalPrice,
    totalServices: totalPrice - totalTax,
  })

  const price = formatPrice({
    currency: currency || 'usd',
    price:
      Math.ceil(depositAmount > totalPrice ? totalPrice : depositAmount * 100) /
      100,
  })

  const proName = useAppSelector((state) => state.profile?.iProInfo?.data?.name)

  const text = useMemo(() => {
    // client asked to return only one text
    return "Avoid payments outside Readyhubb, external payments aren't protected and could be scams."

    if (deposit.amount && !checkIsPayInCash(paymentMethod?.value)) {
      return t('texts.warning_payment', { price, proName })
    } else if (deposit.amount && checkIsPayInCash(paymentMethod?.value)) {
      return t('texts.warning_with_deposit_and_pay_in_cash', { price })
    } else if (isFullDeposit) {
      return (
        <>
          You'll be charged a full amount ahead your appointment from your
          debit/credit card. In the event of a late cancellation or no-show your
          deposit will be non-refundable.
        </>
      )
    } else {
      return t('texts.warning_no_deposit')
    }
  }, [deposit, isFullDeposit, paymentMethod?.value, price, t, proName])

  return (
    <OrangeBlock className={`maxTablet:${!mobile ? 'hidden' : ''} small:mb-3`}>
      <H16>{text}</H16>
    </OrangeBlock>
  )
}

export const DepositContent = ({ highlight }: { highlight: boolean }) => {
  const { t } = useTranslation(TRANSLATE_KEYS.booking)
  const {
    termsOfPayment,
    data: { paymentMethod },
  } = useAppSelector(bookingDataSelector)
  const name = useAppSelector((state) => state.profile.iProInfo.data.name)
  const isBnpl = checkIsPayBnpl(paymentMethod?.value)

  const otherPolicies = termsOfPayment.description

  return (
    <div className="mt-6 desktop:mt-0">
      <CardWrapper
        id="cancellation_policies_bookings"
        className={`text-gray p-6 outline transition  ${
          highlight ? 'outline outline-orange' : 'outline-0'
        }`}
      >
        <H20 className="mb-3">{t('titles.cancellation_policies')}</H20>
        <CancellationPolicyText
          name={name}
          cancellationRule={termsOfPayment.cancellationRule}
          depositType={termsOfPayment.depositType}
          deposit={termsOfPayment.amount}
          isPayBnpl={isBnpl}
          percentOfService={termsOfPayment?.percentOfService || 0}
        />
      </CardWrapper>
      {/* <CardWrapper className="p-6 mt-6 text-gray mb-7">
        <H20 className="mb-3">Other policies</H20>
        <H16 color="text-gray" className="whitespace-pre-wrap">
          In addition to environmental taxation, a number of other policies can
          have indirect benefits for mobilizing resources for sustainable
          development.
        </H16>
        <H16 color="text-gray" className="whitespace-pre-wrap mt-4">
          Another set of policies concerns the business practices, eroded labor
          standards, and weakened labor market institutions that have reduced.
        </H16>
      </CardWrapper> */}
      {otherPolicies ? (
        <CardWrapper className="p-6 mt-6 text-gray mb-7">
          <H20 className="mb-3">Additional payment & booking policies</H20>
          <H16 color="text-gray" className="whitespace-pre-wrap">
            {otherPolicies}
          </H16>
        </CardWrapper>
      ) : null}
    </div>
  )
}

export const TermsDrawerContent = () => {
  const session = useSession()

  const role =
    useMemo(() => {
      if (session.data?.user) {
        return session?.data?.user?.role
      }
    }, [session.data?.user]) || 'CLIENT'

  const content: Record<typeof role, ReactNode> = {
    PRO: <TermsAndConditionsPro />,
    CLIENT: <TermsAndConditionsClient />,
  }

  return <>{content[role]}</>
}

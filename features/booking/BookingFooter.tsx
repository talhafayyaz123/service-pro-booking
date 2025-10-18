import { useElements, useStripe } from '@stripe/react-stripe-js'
import clsx from 'clsx'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useCallback, useMemo, useState } from 'react'
import { create } from 'zustand'

import { Button } from '@/components/common/buttons/Button'
import { H14 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { confirmBookingRequest } from '@/features/booking/store/bookingRequests'
import {
  bookingDataSelector,
  depositSelector,
  isBookingHasMobileSelector,
} from '@/features/booking/store/bookingSelectors'
import {
  setIsSubmitting,
  setStep,
  TSteps,
} from '@/features/booking/store/bookingStore'
import { removePersistedCustomFormData } from '@/features/customForm/helpers/persistFormMethods'
import { validateFormSelector } from '@/features/customForm/store/selectors'
import { setTrySubmitAll } from '@/features/customForm/store/slice'
import { useBookingSuccessModalOpen } from '@/features/modalsConfig/modals/BookingSuccessModal'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { billingDataSelector } from '@/store/billingMethodsStore/billingMethodsSlice'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'

import {
  checkIsPayBnpl,
  checkIsPayInCash,
  checkIsPayWithCard,
} from './bookingHelpers'
import { useOutOfBookingArea } from './hooks/useOutOfBookingArea'

export const BookingFooter = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.booking)
  const { disabled, onSubmit, step, isLoading } = useBookingFooterConfig()
  const isShowPolicy = usePasswordObserver((state) => state.isShowPolicy)
  const { isSmall } = useMediaScreen()
  const { currentModal } = useAppSelector(modalsSelector)
  const { bookingRegistrationStep } = useAppSelector(bookingDataSelector)
  const isSignUpToConfirmBooking =
    currentModal === MODALS_TYPE.SIGN_UP_TO_CONFIRM && isSmall

  const isOtp = bookingRegistrationStep === 'otp'

  const buttonText = {
    1: t('titles.select_date'),
    2: 'Confirm',
  }

  if (isOtp) {
    return null
  }

  return (
    <footer
      className={clsx(
        'flex items-center small:justify-end small:px-20 small:rounded-none bg-white',
        'small:shadow-xl rounded-t-[20px] justify-center px-5 s small:py-4.5 py-3',
        { ['z-50 flex flex-col']: isSignUpToConfirmBooking }
      )}
      style={{
        boxShadow: '0px -4px 27px rgba(182, 190, 206, 0.3)',
      }}
    >
      {isSignUpToConfirmBooking && isShowPolicy && (
        <H14 color="text-black" className={'mb-4 block text-center'}>
          By clicking the Create account button, you are confirming that you
          have read and agreed to our{' '}
          <Link href={ROUTES.privacyPolicy}>
            <a target="_blank">
              <span
                role="button"
                className="!font-normal text-orange transition hover:text-orange1"
              >
                Privacy Policy
              </span>
            </a>
          </Link>{' '}
          and{' '}
          <Link
            href={getUrlWithSearchParams(ROUTES.termsAndConditions, {
              forRole: 'PRO',
            })}
          >
            <a target="_blank">
              <span
                role="button"
                className="!font-normal text-orange transition hover:text-orange1"
              >
                Terms of service
              </span>
            </a>
          </Link>
        </H14>
      )}
      <Button
        size="46"
        buttonType="3d"
        disabled={isLoading ? false : disabled}
        isLoading={isLoading}
        textClassName="!text-[16px]"
        className="small:w-auto w-full !px-10"
        onClick={() => {
          onSubmit()

          if (step === 2) {
            removePersistedCustomFormData()
          }
        }}
      >
        {isSignUpToConfirmBooking
          ? 'Proceed to confirmation'
          : buttonText[step]}
      </Button>
    </footer>
  )
}

export const useBookingFooterConfig = () => {
  const session = useSession()
  const dispatch = useAppDispatch()
  const validationsForms = useAppSelector(validateFormSelector)
  const [bnplLoading, setBnplLoading] = useState(false)
  const { isSmall } = useMediaScreen()
  const { currentModal } = useAppSelector(modalsSelector)
  const isSignUpToConfirmBooking =
    currentModal === MODALS_TYPE.SIGN_UP_TO_CONFIRM && isSmall

  const {
    addedServices,
    isSubmitting,
    step,
    data: { address, location, policies, paymentMethod, useWallet },
    confirmStatus,
    payment: {
      isPaymentProcessing,
      paymentError,
      isDetailsCompleted,
      useAnotherCard,
      selectedCard,
      paymentOption,
    },
    savedCards: { data },
  } = useAppSelector(bookingDataSelector)

  const isFar = useOutOfBookingArea()
  const stripe = useStripe()
  const elements = useElements()
  const isAddedServicesMobile = useAppSelector(isBookingHasMobileSelector)
  const billing_details = useAppSelector(billingDataSelector)

  const isCompleteAddress = useAppSelector(
    (state) => state.billingMethods?.address?.isComplete
  )

  const deposit = useAppSelector(depositSelector)
  const hasSavedCards = data.length
  const isBnpl = checkIsPayBnpl(paymentMethod?.value)
  const disabled = useMemo(() => {
    if (step === 1) {
      if (
        Object.values(validationsForms).some((el) => el.validate === 'error')
      ) {
        return true
      }

      if (isSignUpToConfirmBooking) {
        return isSubmitting
      }

      return (
        !addedServices.length ||
        (isAddedServicesMobile ? !address || !location || isFar : false)
      )
    } else {
      const isCashPay = checkIsPayInCash(paymentMethod?.value)
      const isCardPay = checkIsPayWithCard(paymentMethod?.value)
      if (isBnpl) {
        const disabled =
          !billing_details?.address?.line1 ||
          !billing_details?.address?.postal_code ||
          !billing_details?.address?.city ||
          !billing_details?.address?.country ||
          (paymentOption === 'AFFIRM' && !billing_details?.address?.state) ||
          !isCompleteAddress
        return (
          !paymentOption ||
          !policies ||
          confirmStatus ||
          disabled ||
          bnplLoading
        )
      }
      if ((isCashPay && deposit.amount > 0) || isCardPay) {
        return (
          paymentError ||
          isPaymentProcessing ||
          !policies ||
          confirmStatus ||
          (hasSavedCards
            ? useAnotherCard
              ? !isDetailsCompleted
              : !selectedCard
            : !isDetailsCompleted)
        )
      } else {
        return !policies || confirmStatus
      }
    }
    //eslint-disable-next-line
  }, [
    step,
    validationsForms,
    isSubmitting,
    addedServices.length,
    isAddedServicesMobile,
    address,
    location,
    isFar,
    billing_details,
    paymentMethod?.value,
    deposit.amount,
    paymentError,
    isPaymentProcessing,
    policies,
    confirmStatus,
    hasSavedCards,
    useAnotherCard,
    isDetailsCompleted,
    selectedCard,
    paymentOption,
    isBnpl,
    bnplLoading,
    isSignUpToConfirmBooking,
  ])
  const proData = useAppSelector((state) => state.profile.iProInfo.data)
  const proSource = proData.source

  const proId = proData.id
  const openSuccessModal = useBookingSuccessModalOpen()
  const onSubmit = useCallback(() => {
    // if user is not verified while booking, don't let client finish registering
    if (session.data && !session.data.user.isVerified) {
      dispatch(
        setModal({
          currentModal: MODALS_TYPE.SIGN_UP_TO_CONFIRM,
          state: {
            registerStep: 3,
          },
        })
      )
    }

    if (step === 1) {
      if (isSignUpToConfirmBooking) {
        dispatch(setIsSubmitting(true))
        return
      }
      if (
        Object.values(validationsForms).some(
          (el) =>
            el?.validate === 'error' ||
            (el?.validate === 'notFilled' && el.isRequiredForm)
        )
      ) {
        dispatch(setTrySubmitAll())
      } else {
        dispatch(setModal({ currentModal: MODALS_TYPE.BOOKING_SELECT_DATE }))
      }
    } else if (step === 2) {
      dispatch(
        confirmBookingRequest({
          useWallet,
          proId,
          elements,
          stripe,
          deposit: deposit.amount,
          setBnplLoading,
          openSuccessModal,
          source: proSource,
        })
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    step,
    proId,
    stripe,
    elements,
    deposit.amount,
    isBnpl,
    billing_details,
    validationsForms,
    isSignUpToConfirmBooking,
    dispatch,
    useWallet,
    proSource,
  ])

  const handleSetStep = useCallback(
    (step: TSteps) => {
      dispatch(setStep(step))
    },
    [dispatch]
  )
  return {
    disabled,
    onSubmit,
    handleSetStep,
    step,
    isLoading: bnplLoading || confirmStatus,
    bnplLoading,
  }
}

interface IStore {
  isShowPolicy: boolean
  setStore: (params: Partial<IStore>) => void
}
export const usePasswordObserver = create<IStore>((set, get) => ({
  isShowPolicy: false,
  setStore: (params) => {
    set({ ...get(), ...params })
  },
}))

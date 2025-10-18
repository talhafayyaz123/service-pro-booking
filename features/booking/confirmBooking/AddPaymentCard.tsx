import {
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { PaymentRequest } from '@stripe/stripe-js'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'

import { createSetupIntent } from '@/api/payment/createSetupIntent'
import { BookingAcceptTermsModal } from '@/components/modals/BookingAcceptTermsModal'
import { useModalData } from '@/components/modals/Modal'
import { NewPaymentItems } from '@/components/Payment/NewPaymentItems'
import { PaymentErrorText } from '@/components/Payment/PaymentErrorText'
import { MODALS_TYPE } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import {
  bookingDataSelector,
  depositSelector,
} from '@/features/booking/store/bookingSelectors'
import {
  setBookingErrorMessage,
  updatePaymentState,
} from '@/features/booking/store/bookingStore'
import { formAnswersForCreateSelector } from '@/features/customForm/store/selectors'
import { useBookingSuccessModalOpen } from '@/features/modalsConfig/modals/BookingSuccessModal'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import {
  billingCompleteSelector,
  billingIsHaveErrorSelector,
  resetBillingData,
} from '@/store/billingMethodsStore/billingMethodsSlice'
import { setModal } from '@/store/modals/modalsSlice'
import { ISavedCard } from '@/types/payment'

import { checkIsPayWithCard } from '../bookingHelpers'
import { SavedCard } from '../components/SavedCard'
import { createBooking, getUserSavedCards } from '../store/bookingRequests'

export const AddPaymentCard = () => {
  return (
    <>
      <AppleAndGooglePay />
      <CheckoutForm />
    </>
  )
}

const AppleAndGooglePay = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  )

  const { isOpen, onCloseModal } = useModalData(
    MODALS_TYPE.BOOKING_TERMS_WARNING
  )
  const profile = useAppSelector(profileSelector)

  const dispatch = useAppDispatch()
  const bookingData = useAppSelector((state) => state.booking)
  const proId = profile.data.id
  const timezone = profile.data.timezone as string
  const deposit = useAppSelector(depositSelector)
  const policy = bookingData.data.policies
  const isPayInApp = checkIsPayWithCard(bookingData.data.paymentMethod?.value)
  const hasDeposit = (deposit.amount > 0 && deposit.currency) || isPayInApp
  const formAnswers = useAppSelector(formAnswersForCreateSelector)
  const openSuccessModal = useBookingSuccessModalOpen()
  useEffect(() => {
    if (!stripe || !elements || !hasDeposit) {
      return
    }

    const pr = stripe.paymentRequest({
      currency: deposit.currency,
      country: 'US',
      requestPayerEmail: true,
      requestPayerName: true,
      total: {
        label: 'Booking payment',
        amount: Math.round(deposit.amount * 100),
      },
    })

    pr.canMakePayment().then((result) => {
      if (result && !paymentRequest) {
        setPaymentRequest(pr)
      }
    })

    pr.on('paymentmethod', async (e) => {
      try {
        const setupIntent = await createSetupIntent()

        const response = await stripe.confirmCardSetup(
          setupIntent.clientSecret,
          {
            payment_method: e.paymentMethod.id,
          }
        )

        if (response.error) {
          dispatch(
            setBookingErrorMessage(
              response.error.message ||
                'Unknown error occurred, please try again.'
            )
          )
          e.complete('fail')
          return
        }

        if (response.setupIntent.status === 'succeeded') {
          await createBooking({
            proId,
            bookingState: bookingData,
            addons: bookingData.addOns.selectedIds,
            setupIntentId: response.setupIntent.id,
            paymentMethodId: response.setupIntent.payment_method as string,
            timezone,
            formAnswers,
            useWallet: bookingData.data.useWallet,
            source: bookingData.data.proSource,
          })
          openSuccessModal()
          e.complete('success')
        } else {
          dispatch(
            setBookingErrorMessage('Unknown error occurred, please try again.')
          )
          e.complete('fail')
        }
      } catch (err: any) {
        const error = err?.response?.data?.message
        dispatch(
          setBookingErrorMessage(
            error || 'Unknown error occurred, please try again.'
          )
        )
        e.complete('fail')
      }
    })
  }, [
    proId,
    stripe,
    elements,
    timezone,
    hasDeposit,
    bookingData,
    paymentRequest,
    deposit?.amount,
    deposit?.currency,
    dispatch,
    formAnswers,
    openSuccessModal,
  ])

  const onModalClose = () => {
    onCloseModal()
    const scrollBlock = document.getElementById('booking_agreement')
    if (scrollBlock) {
      scrollBlock.scrollIntoView({ behavior: 'smooth' })
      scrollBlock.classList.add('!border-orange')
      setTimeout(() => {
        scrollBlock.classList.remove('!border-orange')
      }, 2500)
    }
  }

  return paymentRequest && hasDeposit ? (
    <div className="flex flex-col my-3 space-y-3">
      {isOpen ? <BookingAcceptTermsModal onClose={onModalClose} /> : null}
      <PaymentRequestButtonElement
        onClick={(event) => {
          if (!policy) {
            dispatch(
              setModal({ currentModal: MODALS_TYPE.BOOKING_TERMS_WARNING })
            )
            event.preventDefault()
          }
        }}
        options={{ paymentRequest }}
      />
    </div>
  ) : null
}

const CheckoutForm = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.payment)

  const error = useAppSelector(
    (state) => state.billingMethods.globalErrorMessage
  )
  const isDetailsCompleted = useAppSelector(billingCompleteSelector)
  const paymentError = useAppSelector(billingIsHaveErrorSelector)
  const dispatch = useAppDispatch()
  const {
    confirmStatus,
    payment: { useAnotherCard, selectedCard },
    savedCards,
  } = useAppSelector(bookingDataSelector)

  const hasSavedCards = savedCards?.data.length

  const onSavedCardClick = (card: ISavedCard) => {
    if (selectedCard?.paymentMethodId === card.paymentMethodId) {
      dispatch(updatePaymentState({ selectedCard: null }))
    } else {
      dispatch(
        updatePaymentState({
          useAnotherCard: false,
          selectedCard: card,
        })
      )
    }
    dispatch(resetBillingData())
  }

  useEffect(() => {
    dispatch(updatePaymentState({ isDetailsCompleted }))
  }, [isDetailsCompleted, dispatch])

  useEffect(() => {
    dispatch(getUserSavedCards())
  }, [dispatch])

  useEffect(() => {
    dispatch(updatePaymentState({ paymentError }))
  }, [paymentError, dispatch])

  useEffect(() => {
    setTimeout(() => {
      const err = document.getElementById('booking_error')
      if (err && !confirmStatus) {
        err.scrollIntoView({
          behavior: 'smooth',
        })
      }
    }, 100)
  }, [error, confirmStatus])

  return (
    <form className="mt-6 mb-8 small:mt-4">
      {error && <PaymentErrorText error={error} />}
      {!savedCards.loading ? (
        <>
          {hasSavedCards ? (
            <div className="mt-3 mb-4 space-y-3">
              {savedCards.data?.map((card) => {
                const isSelected =
                  card.paymentMethodId === selectedCard?.paymentMethodId
                return (
                  <SavedCard
                    isSelected={isSelected}
                    card={card}
                    key={card.paymentMethodId}
                    onClick={() => onSavedCardClick(card)}
                  />
                )
              })}
              <SavedCard
                isSelected={useAnotherCard}
                text={t('add_another_card')}
                onClick={() => {
                  dispatch(
                    updatePaymentState({
                      useAnotherCard: !useAnotherCard,
                      selectedCard: null,
                    })
                  )
                  dispatch(resetBillingData())
                }}
              />
            </div>
          ) : null}
          {(hasSavedCards && useAnotherCard) || !hasSavedCards ? (
            <div>
              {useAnotherCard && (
                <div className="w-full h-px mt-6 bg-lightGray" />
              )}
              <NewPaymentItems withErrorText={false} />
            </div>
          ) : null}
        </>
      ) : null}
    </form>
  )
}

import { useStripe } from '@stripe/react-stripe-js'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { API_BOOKING } from '@/core/consts/apiLinks'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import { sleep } from '@/core/helpers/sleep'
import {
  addedBookingsTotalPrice,
  allSelectedAddons,
  bookingDataSelector,
  isBookingHasMobileSelector,
} from '@/features/booking/store/bookingSelectors'
import {
  setBookingErrorMessage,
  updatePaymentStatus,
} from '@/features/booking/store/bookingStore'
import { closeModal, openModal } from '@/features/modalsConfig/modalConfig'
import { useBookingSuccessModalOpen } from '@/features/modalsConfig/modals/BookingSuccessModal'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { universalInstance } from '@/store/instance'
import { setModal } from '@/store/modals/modalsSlice'

import { ConfirmBNPL } from '../store/bookingRequests'

export const useBNPLCheckout = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const paymentSecret = router.query?.payment_intent_client_secret
  const proId = router.query?.proId as string
  const addons = router.query?.addons as string
  const comment = router.query?.comment as string
  const useWallet = router.query?.useWallet as string
  const paymentIntent = router.query?.payment_intent
  const selectedServices = router.query?.selectedServices as string
  const date = router.query?.date as string
  const onOpenSuccessModal = useBookingSuccessModalOpen()
  const paymentOption = router.query?.payment_option as
    | 'AFFIRM'
    | 'AFTERPAY'
    | 'KLARNA'

  const [isBNPLLoading, setBNPLLoading] = useState(false)
  const stripeRequestCount = useRef(0)
  const stripe = useStripe()
  const failedModalProps = useFailedModalProps()

  const onSuccess = async () => {
    await sleep(1500)
    const res = await stripe?.retrievePaymentIntent(paymentSecret as string)
    const paymentStatus = JSON.parse(
      sessionStorage.getItem('paymentStatus') || '{}'
    )

    stripeRequestCount.current = stripeRequestCount.current + 1
    if (stripeRequestCount.current !== 5) {
      onSuccess()
    } else {
      setBNPLLoading(false)
      stripeRequestCount.current = 0
      if (res?.paymentIntent?.status === 'succeeded') {
        try {
          const IntRes = await ConfirmBNPL({
            bookingId: paymentStatus?.bookingId,
            paymentIntentId: res?.paymentIntent?.id,
          })
          if (IntRes?.result || IntRes) {
            dispatch(
              updatePaymentStatus({
                status: IntRes?.result || IntRes ? 'CONFIRMED' : 'FAILED',
                bookingId: paymentStatus?.bookingId,
              })
            )
            onOpenSuccessModal()
          }
        } catch (error) {
          openModal({
            currentModal: 'paymentFailedModal',
            modalProps: failedModalProps,
            modalSettings: { maxWidth: 503, outsideClose: false },
          })
        }
      } else {
        openModal({
          currentModal: 'paymentFailedModal',
          modalProps: failedModalProps,
          modalSettings: { maxWidth: 503, outsideClose: false },
        })
      }
    }
  }

  const mutation = useMutation({
    mutationFn: async (body: Record<string, string | string[] | boolean>) => {
      const instance = await universalInstance()

      const { data } = await instance.post(API_BOOKING.booking, { ...body })
      return data
    },

    onSuccess: onSuccess,
    onError: (err: any) => {
      setBNPLLoading(false)
      const error: string = err?.response?.data?.message
      dispatch(setModal({}))
      dispatch(
        setBookingErrorMessage(error ?? 'Unknown error, please try again.')
      )
    },
  })

  useEffect(() => {
    if (paymentSecret) {
      setBNPLLoading(true)
      mutation.mutate({
        proId,
        formAnswers: [],
        addons: addons ? addons.split(',') : [],
        paymentMethod: paymentOption,
        comment: comment,
        paymentIntentId: paymentIntent as string,
        services: selectedServices?.split(','),
        date,
        useWallet: useWallet === 'true',
      })
    } else {
      dispatch(setModal({}))
      closeModal()
    }
    //eslint-disable-next-line
  }, [paymentSecret])

  return isBNPLLoading
}

const useFailedModalProps = () => {
  const { termsOfPayment } = useAppSelector(bookingDataSelector)

  const profileInfo = useAppSelector(profileSelector)

  const selectedAddons = useAppSelector(allSelectedAddons)

  const isBookingMobileService = useAppSelector(isBookingHasMobileSelector)

  const travelFee = isBookingMobileService ? termsOfPayment.travelFee || 0 : 0
  const taxPercent = termsOfPayment.taxPercent || 0

  const travelFeeTax = travelFee * (taxPercent / 100)

  const totalPrice =
    useAppSelector(addedBookingsTotalPrice) + travelFeeTax + travelFee
  const addonsFullPrice = (selectedAddons || []).reduce(
    (acc, item) => acc + (item?.price || 0),
    0
  )
  return {
    price: totalPrice + (addonsFullPrice || 0),
    currency: getCurrencySignByName(profileInfo.data.currency || ''),
    handleTryAgain: closeModal,
  }
}

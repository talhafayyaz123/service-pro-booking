import { useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { SpinnerFullScreen } from '@/components/Loaders'
import { MODALS_TYPE } from '@/core/consts/common'
import { AddInfoStepMobile } from '@/features/paymentLink/components/Steps/AddInfoStep/AddInfoStepMobile'
import { AddInfoModal } from '@/features/paymentLink/components/Steps/AddInfoStep/components/AddInfoModal/AddInfoModal'
import { BaseInfoStepDesktop } from '@/features/paymentLink/components/Steps/BaseInfoStep/desktop/BaseInfoStepDesktop'
import { BaseInfoStepMobile } from '@/features/paymentLink/components/Steps/BaseInfoStep/mobile/BaseInfoStepMobile'
import { ExpiredLink } from '@/features/paymentLink/components/Steps/expiredLink/ExpiredLink'
import { FailedStep } from '@/features/paymentLink/components/Steps/failedStep/FailedStep'
import { OTPVerifyMobile } from '@/features/paymentLink/components/Steps/OTPStep/OTPVerifyMobile'
import { PaymentProcessStep } from '@/features/paymentLink/components/Steps/PaymentProcessStep/PaymentProcessStep'
import { PendingStep } from '@/features/paymentLink/components/Steps/pendingStep/PendingStep'
import { SuccessStep } from '@/features/paymentLink/components/Steps/successStep/SuccessStep'
import { useAfterPayCheckout } from '@/features/paymentLink/hooks'
import { useGetInfoByExternalLinkQuery } from '@/features/paymentLink/store/paymentLinkApi'
import {
  useDepositRequestedBookingStore,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import { getProfileProByIdThunk } from '@/features/profile/store/profileRequests'
import { useAppDispatch } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { setModal } from '@/store/modals/modalsSlice'

export const DepositRequestedBooking = () => {
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const id = router.query.bookingId as string

  const { isFetching, data } = useGetInfoByExternalLinkQuery(id)
  const { step, accessToken } = usePaymentLinkStore()
  const loadingRetrivePayment = useAfterPayCheckout(stripe)

  const proId = data?.booking?.pro.id
  const isShowModal = step[0] === 1 && [2, 3].includes(step[1])
  const { isSmall, isTablet, isLaptop } = useMediaScreen()
  const isDesktop = !isSmall && !isTablet && !isLaptop

  const {
    bookingType,
    isInfoPhotoUpload,
    step: photoUploadStep,
  } = useDepositRequestedBookingStore()

  useEffect(() => {
    if (accessToken) return

    if (isShowModal && isDesktop) {
      dispatch(
        setModal({
          currentModal: MODALS_TYPE.PAYMENT_LINK_INFO_MODAL,
          text: 'Add your info',
        })
      )
    } else {
      dispatch(
        setModal({
          currentModal: undefined,
          text: '',
        })
      )
    }
  }, [dispatch, isShowModal, isDesktop, step, bookingType, accessToken])

  // get pro profile info for consuming in custom forms in walking booking
  useEffect(() => {
    if (proId) {
      dispatch(getProfileProByIdThunk(proId))
    }
  }, [proId, dispatch])

  // If link is expired or paid
  if (data?.status === 'PAID' || data?.status === 'CANCELLED') {
    return <ExpiredLink />
  }

  if (loadingRetrivePayment || isFetching) {
    return <SpinnerFullScreen />
  }

  // open screens based on saved steps in state
  const [leftStep, rightStep] = step
  const isBasicInfoOpen = leftStep === 1 && rightStep === 1
  const isAddingInfoOpen = leftStep === 1 && rightStep === 2
  const isOTPVerifyOpen = leftStep === 1 && rightStep === 3
  const isPaymentOpen = leftStep === 2 && rightStep === 1

  return (
    <>
      {/* Desktop flow */}
      {(isBasicInfoOpen || isShowModal) && <BaseInfoStepDesktop />}
      {(isShowModal || bookingType === 'walkIn') && isDesktop && (
        <AddInfoModal />
      )}

      {/* Mobile flow */}
      {isBasicInfoOpen && !isInfoPhotoUpload && photoUploadStep !== 'otp' && (
        <BaseInfoStepMobile />
      )}

      {(isAddingInfoOpen ||
        (isInfoPhotoUpload && photoUploadStep === 'auth')) &&
        !isDesktop && <AddInfoStepMobile isWalkInBookingDeposit />}

      {isOTPVerifyOpen && photoUploadStep === 'otp' && <OTPVerifyMobile />}

      {/*mobile & desktop components*/}
      {isPaymentOpen && (
        <PaymentProcessStep stripe={stripe} elements={elements} />
      )}

      {/*/success process/*/}
      {leftStep === 2 && rightStep === 2 && <SuccessStep />}

      {/* fail process */}
      {leftStep === 2 && rightStep === 3 && <FailedStep />}
      {leftStep === 2 && rightStep === 4 && <PendingStep />}
    </>
  )
}

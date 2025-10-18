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
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'
import { useAppDispatch } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { setModal } from '@/store/modals/modalsSlice'

export const CheckoutLink = () => {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const id = router.query.bookingId as string

  const { isFetching, data } = useGetInfoByExternalLinkQuery(id)
  const { step } = usePaymentLinkStore()

  const dispatch = useAppDispatch()

  const isShowModal = step[0] === 1 && [2, 3].includes(step[1])
  const { isSmall, isTablet, isLaptop } = useMediaScreen()
  const isDesktop = !isSmall && !isTablet && !isLaptop

  useEffect(() => {
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
  }, [dispatch, isShowModal, isDesktop, step])

  const loadingRetrivePayment = useAfterPayCheckout(stripe)
  if (data?.status === 'PAID') {
    return <ExpiredLink />
  }

  if (loadingRetrivePayment || isFetching) {
    return <SpinnerFullScreen />
  }

  return (
    <>
      {((step[0] === 1 && step[1] === 1) || isShowModal) && (
        <BaseInfoStepDesktop />
      )}
      {isShowModal && <AddInfoModal />}
      {step[0] === 1 && step[1] === 1 && <BaseInfoStepMobile />}
      {step[0] === 1 && step[1] === 2 && <AddInfoStepMobile />}
      {step[0] === 1 && step[1] === 3 && <OTPVerifyMobile />}
      {/*mobile & desktop components*/}
      {step[0] === 2 && step[1] === 1 && (
        <PaymentProcessStep stripe={stripe} elements={elements} />
      )}
      {/*/success process/*/}
      {step[0] === 2 && step[1] === 2 && <SuccessStep />}
      {step[0] === 2 && step[1] === 3 && <FailedStep />}
      {step[0] === 2 && step[1] === 4 && <PendingStep />}
    </>
  )
}

import { useCallback } from 'react'

import { Modal } from '@/components/modals/Modal'
import { MODALS_TYPE } from '@/core/consts/common'
import { AddInfoStepDesktop } from '@/features/paymentLink/components/Steps/AddInfoStep/AddInfoStepDesktop'
import { OTPVerifyDesktop } from '@/features/paymentLink/components/Steps/OTPStep/OTPVerifyDesktop'
import {
  useDepositRequestedBookingStore,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import { setSuccessModal } from '@/features/userProfile/store/userProfileSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { modalsSelector } from '@/store/modals/modalsSelectors'

export const AddInfoModal = () => {
  const { currentModal } = useAppSelector(modalsSelector)
  const isOpen = currentModal === MODALS_TYPE.PAYMENT_LINK_INFO_MODAL
  const dispatch = useAppDispatch()

  const onClose = useCallback(
    () => dispatch(setSuccessModal({ isOpen: false, text: 'Add your info' })),
    [dispatch]
  )

  const step = usePaymentLinkStore((state) => state.step)
  const photoUploadStep = useDepositRequestedBookingStore((state) => state.step)

  return (
    <Modal
      maxWidth={463}
      titleClassName="pb-6 border-b border-lightGray"
      noHeader
      space=""
      isOpen={isOpen}
      onClose={onClose}
    >
      {((step[0] === 1 && step[1] === 2) || photoUploadStep === 'auth') && (
        <AddInfoStepDesktop />
      )}
      {((step[0] === 1 && step[1] === 3) || photoUploadStep === 'otp') && (
        <OTPVerifyDesktop />
      )}
    </Modal>
  )
}

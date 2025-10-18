import { useCallback } from 'react'

import { CloseButton } from '@/components/common/buttons/CloseButton'
import { H16, H28 } from '@/components/typography'
import { AddInfoForm } from '@/features/paymentLink/components/Steps/AddInfoStep/components/common/AddInfoForm'
import {
  useDepositRequestedBookingStore,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const AddInfoStepDesktop = () => {
  const dispatch = useAppDispatch()
  const setStore = usePaymentLinkStore.getState().setStore
  const setBookingStep = useDepositRequestedBookingStore.getState().changeStep

  const onClose = useCallback(() => {
    dispatch(setModal({ currentModal: undefined }))
    setStore({ step: [1, 1] })
    setBookingStep('auth')
  }, [dispatch, setStore, setBookingStep])

  return (
    <>
      <div className={'w-fit ml-auto px-8 mt-8 h-fit'}>
        <CloseButton onClick={onClose} />
      </div>
      <H28>Add your info</H28>
      <H16 color="text-gray" className="mt-4 max-w-[295px] mx-auto">
        Please, add your information to proceed to payment.
      </H16>
      <AddInfoForm />
    </>
  )
}

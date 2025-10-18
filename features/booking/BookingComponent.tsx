import { MODALS_TYPE } from '@/core/consts/common'
import { BookingContent } from '@/features/booking/BookingContent'
import { AddAServiceBottomSheet } from '@/features/booking/components/modals/addServices/AddAServiceBottomSheet'
import { AddServicesModal } from '@/features/booking/components/modals/addServices/AddServicesModal'
import { SignUpToConfirmBooking } from '@/features/booking/components/modals/register/SignUpToConfirmBooking'
import { SelectDateBottomSheet } from '@/features/booking/components/modals/SelectDateBottomSheet'
import { SelectDateModal } from '@/features/booking/components/modals/SelectDateModal'
import { useAppSelector } from '@/hooks/hooks'
import { modalsSelector } from '@/store/modals/modalsSelectors'

export const BookingComponent = () => {
  const { currentModal } = useAppSelector(modalsSelector)
  return (
    <>
      <BookingContent />

      <SelectDateModal />
      <AddServicesModal />

      <SelectDateBottomSheet />
      {currentModal === MODALS_TYPE.CHOOSE_SERVICE && (
        <AddAServiceBottomSheet />
      )}

      <SignUpToConfirmBooking />
    </>
  )
}

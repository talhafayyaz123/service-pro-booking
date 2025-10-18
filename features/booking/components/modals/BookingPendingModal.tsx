import { useRouter } from 'next/router'

import { Button } from '@/components/common/buttons/Button'
import { Modal, useModalData } from '@/components/modals/Modal'
import { MODALS_TYPE } from '@/core/consts/common'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import {
  addedBookingsTotalPrice,
  allSelectedAddons,
  bookingDataSelector,
  isBookingHasMobileSelector,
} from '@/features/booking/store/bookingSelectors'
import { PendingApproval } from '@/features/paymentLink/components/Steps/pendingStep/components/PendingApproval'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'

export const BookingPendingModal = () => {
  const { onCloseModal, isOpen } = useModalData(
    MODALS_TYPE.BOOKING_PENDING_MODAL
  )
  const { termsOfPayment } = useAppSelector(bookingDataSelector)

  const profileInfo = useAppSelector(profileSelector)

  const selectedAddons = useAppSelector(allSelectedAddons)

  const router = useRouter()
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

  const onClose = () => {
    onCloseModal()
    router.replace('/')
  }
  return (
    <Modal maxWidth={503} space="p-8 " isOpen={isOpen} onClose={onClose}>
      <PendingApproval
        price={totalPrice + (addonsFullPrice || 0)}
        currency={getCurrencySignByName(profileInfo.data.currency || '')}
      />
      <Button className="w-full mt-6" buttonType="orange" onClick={onClose}>
        Close
      </Button>
    </Modal>
  )
}

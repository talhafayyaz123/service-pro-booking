import {
  addedBookingsTax,
  addedBookingsTotalPrice,
  addonsTotalPriceSelector,
  bookingDataSelector,
  isBookingHasMobileSelector,
} from '@/features/booking/store/bookingSelectors'
import { useAppSelector } from '@/hooks/hooks'

export const useConfirmBooking = () => {
  const { termsOfPayment } = useAppSelector(bookingDataSelector)
  const taxPercent = termsOfPayment.taxPercent || 0
  const totalAddonsPrice = useAppSelector(addonsTotalPriceSelector)

  const isAddedMobileService = useAppSelector(isBookingHasMobileSelector)

  const travelFee = isAddedMobileService ? termsOfPayment.travelFee || 0 : 0

  const travelFeeTax = travelFee * (taxPercent / 100)

  const totalTax = useAppSelector(addedBookingsTax) + travelFeeTax
  const totalPrice =
    useAppSelector(addedBookingsTotalPrice) +
    travelFeeTax +
    travelFee +
    totalAddonsPrice

  return { totalPrice, totalTax, travelFee, taxPercent }
}

import classNames from 'classnames'
import { memo } from 'react'

import { SpinnerFullScreen } from '@/components/Loaders'
import { useBookingFooterConfig } from '@/features/booking/BookingFooter'

export const BookingLoaderScreen = memo(() => {
  const { isLoading } = useBookingFooterConfig()
  return isLoading ? (
    <div
      className={classNames(
        'transition-all  duration-200  fixed top-0 left-0  h-screen w-screen z-[999] bg-gray/25'
      )}
    >
      <SpinnerFullScreen />
    </div>
  ) : null
})

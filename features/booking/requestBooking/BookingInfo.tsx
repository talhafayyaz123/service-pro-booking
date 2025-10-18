import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import TextArea from '@/components/common/TextArea'
import { H28 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import {
  bookingDataSelector,
  isBookingHasMobileSelector,
} from '@/features/booking/store/bookingSelectors'
import {
  setBookingData,
  setBookingErrorMessage,
  setStep,
} from '@/features/booking/store/bookingStore'
import { BookingInfoCustomForm } from '@/features/customForm/BookingInfoCustomForm'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

import { BookingMobileService } from './BookingMobileService'

export const BookingInfo = () => {
  const dispatch = useAppDispatch()
  const isAddedServicesHasMobile = useAppSelector(isBookingHasMobileSelector)

  const [localLoaded, setLocalLoaded] = useState(false)

  const { t } = useTranslation(TRANSLATE_KEYS.booking)
  const session = useSession()
  const {
    data: { comment, date, address, isLocallySetted, location, startTime },
    errorMessage,
    addedServices,
  } = useAppSelector(bookingDataSelector)

  useEffect(() => {
    if (session.data?.user) {
      const bookingItems: any = JSON.parse(
        localStorage.getItem('bookingItems') || '{}'
      )
      if (Object.keys(bookingItems).length) {
        dispatch(setBookingData({ ...bookingItems, isLocallySetted: true }))
      }
      localStorage.removeItem('bookingItems')
    }

    if (isAddedServicesHasMobile) {
      setLocalLoaded(true)
    }
  }, [isAddedServicesHasMobile, session.data?.user, dispatch])

  const onChangeComment = useCallback(
    (value: ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(setBookingData({ comment: value.target.value }))
    },
    [dispatch]
  )

  useEffect(() => {
    if (
      isLocallySetted &&
      startTime &&
      date &&
      (isAddedServicesHasMobile ? address && location : true) &&
      addedServices.length
    ) {
      dispatch(setStep(2))
      dispatch(setBookingData({ isLocallySetted: false }))
    }
  }, [
    date,
    address,
    location,
    startTime,
    isLocallySetted,
    addedServices.length,
    isAddedServicesHasMobile,
    dispatch,
  ])

  useEffect(() => {
    if (errorMessage) {
      dispatch(setBookingErrorMessage(''))
    }
  }, [dispatch, errorMessage])

  return (
    <CardWrapper className="h-fit maxTablet:pt-0 maxTablet:rounded-t-none maxTablet:shadow-none">
      <H28 className="maxTablet:hidden">{t('titles.booking_info')}</H28>
      <BookingInfoCustomForm />
      <TextArea
        className=" tablet:mt-8"
        value={comment}
        label={t('labels.leave_comment')}
        onChange={onChangeComment}
        minRows={7}
        count
        maxLength={500}
      />
      {isAddedServicesHasMobile && (
        <BookingMobileService localLoaded={localLoaded} />
      )}
    </CardWrapper>
  )
}

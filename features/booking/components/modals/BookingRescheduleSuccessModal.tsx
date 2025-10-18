import moment from 'moment/moment'
import useTranslation from 'next-translate/useTranslation'
import { useMemo } from 'react'

import { BookingCard } from '@/components/cards/bookingCard/BookingCard'
import { Button } from '@/components/common/buttons/Button'
import { Modal, useModalData } from '@/components/modals/Modal'
import { H16, H18, H24, H48 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { generateGoogleCalendar } from '@/core/consts/googleCalendar'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import {
  bookingDataSelector,
  calendarDataSelector,
} from '@/features/booking/store/bookingSelectors'
import { setBottomSheet } from '@/features/bookings/store/bookingsStore'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

export const BookingRescheduleSuccessModal = () => {
  const { onCloseModal, isOpen } = useModalData(
    MODALS_TYPE.BOOKING_RESCHEDULE_SUCCESS_MODAL
  )
  const dispatch = useAppDispatch()
  const calendarData = useAppSelector(calendarDataSelector)

  const data = useAppSelector((state) => state.bookings.viewBooking.data)
  const travelFee = data?.travelFee || 0
  const bookingData = useAppSelector(bookingDataSelector)
  const { t } = useTranslation(TRANSLATE_KEYS.booking)

  const totalPrice =
    useMemo(
      () => data?.services.reduce((acc, item) => acc + item.price, 0),
      [data.services]
    ) + travelFee
  const currencySign = getCurrencySignByName(data?.pro?.currency)
  const date = String(
    moment(data.date)
      .set(
        'hours',
        Number(bookingData.data?.startTime?.value.split(':')?.[0]) || 0
      )
      .set(
        'minutes',
        Number(bookingData.data?.startTime?.value.split(':')?.[1]) || 0
      )
      .toDate()
  )

  return (
    <Modal
      maxWidth={503}
      // noHeader
      outsideClose={false}
      space="p-4  "
      isOpen={isOpen}
      onClose={onCloseModal}
    >
      <H48 className="!font-bold maxTablet:hidden">{t('labels.success')}</H48>
      <H24 className="!font-bold tablet:hidden">{t('labels.success')}</H24>
      <H18 color="text-gray" className="maxTablet:hidden">
        You have rescheduled your booking
      </H18>
      <H16 color="text-gray" className="tablet:hidden">
        You have rescheduled your booking
      </H16>
      <BookingCard
        date={date}
        startTime={bookingData.data.startTime?.label || ''}
        totalPrice={totalPrice}
        className="my-6"
        cardStatus="CONFIRMED"
        iconUrl={data?.pro?.iconUrl || ''}
        proName={
          (data?.pro?.firstName || '') + ' ' + (data?.pro?.lastName || '')
        }
        services={data.services}
        currencySign={currencySign}
        totalDuration={data.duration}
      />
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => {
            onCloseModal()
            dispatch(setBottomSheet())
          }}
          className="w-full"
          buttonType="orange"
        >
          {t('labels.view_my_bookings')}
        </Button>

        <a
          target="_blank"
          href={generateGoogleCalendar(calendarData)}
          rel="noreferrer"
        >
          <Button buttonType="withIcon" className="w-full">
            {t('labels.add_to_calendar')}
          </Button>
        </a>
      </div>
    </Modal>
  )
}

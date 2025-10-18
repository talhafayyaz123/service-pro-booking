import { addMonths, endOfMonth, startOfMonth } from 'date-fns'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useCallback, useMemo } from 'react'

import { ImgCalendar } from '@/assets/images/images'
import { CategoryIcon } from '@/components/common/CategoryCard'
import { ChipBlock } from '@/components/common/datePicker/DatePicker'
import { DefaultDatePicker } from '@/components/common/datePicker/DefoultDatePicker'
import { Spinner } from '@/components/Loaders'
import { Modal } from '@/components/modals/Modal'
import { H18, H24 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { cn } from '@/core/helpers/cn'
import { getPeriodWindows } from '@/features/booking/store/bookingRequests'
import {
  bookingDataSelector,
  bookingPeriodWindowsSelector,
  bookingServicesTimeInMin,
} from '@/features/booking/store/bookingSelectors'
import { setBookingData, setStep } from '@/features/booking/store/bookingStore'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'
import { IChip } from '@/types/common'

export const SelectDateModal = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.booking)

  const dispatch = useAppDispatch()
  const { currentModal } = useAppSelector(modalsSelector)
  const { isSmall, isTablet } = useMediaScreen()

  const open =
    isSmall || isTablet
      ? false
      : currentModal === MODALS_TYPE.BOOKING_SELECT_DATE
  const onClose = useCallback(() => {
    dispatch(setModal({}))
  }, [dispatch])

  return (
    <Modal
      maxWidth={503}
      space={'h-fit py-7 px-2'}
      title={<H24>{t('titles.select_date')}</H24>}
      isOpen={open}
      titleClassName={'border-b border-lightGray pb-6 mb-3 flex mx-7'}
      outsideClose={false}
      onClose={onClose}
    >
      <BookingDatePicker type="modal" />
    </Modal>
  )
}

export const EmptyThisDate = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  return (
    <div
      className={
        'flex justify-start !gap-5 items-center  mx-2 mt-5 pt-5 border-t border-lightGray px-6'
      }
    >
      <CategoryIcon color={'#EEEDFD'} iconUrl={ImgCalendar.src} size={'48'} />
      <H18>{t('text.not_available_slots')}</H18>
    </div>
  )
}
const initChip = { value: '', label: '' }

export const BookingDatePicker = ({
  type,
}: {
  type: 'modal' | 'bottomSheet'
}) => {
  const { data } = useAppSelector(bookingDataSelector)
  const periodWindows = useAppSelector(bookingPeriodWindowsSelector)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const time = useAppSelector(bookingServicesTimeInMin)
  const session = useSession()
  const { query } = router
  const { t } = useTranslation(TRANSLATE_KEYS.booking)

  const handleChangeHeaderDate = (v: Date) => {
    dispatch(
      getPeriodWindows({
        fromDate: moment(startOfMonth(addMonths(new Date(v), 0)))
          .utc(true)
          .toISOString(),
        toDate: moment(endOfMonth(addMonths(new Date(v), 0)))
          .utc(true)
          .toISOString(),
        proId: (query?.proId || '').toString(),
        duration: time,
      })
    )
  }

  const onApply = () => {
    dispatch(setBookingData({ date: data.date, startTime: data.startTime }))
    if (session.data?.user) {
      if (session.data?.user.isVerified) {
        dispatch(setStep(2))
        dispatch(setModal({}))
      } else {
        dispatch(setModal({ currentModal: MODALS_TYPE.SIGN_UP_TO_CONFIRM }))
      }
    } else {
      dispatch(setModal({ currentModal: MODALS_TYPE.SIGN_UP_TO_CONFIRM }))
    }
  }
  const onChange = useCallback(
    (date: Date | null, startTime?: IChip) => {
      dispatch(setBookingData({ date, startTime }))
    },
    [dispatch]
  )

  const windows = useMemo(() => {
    const dateKey = moment(data.date).format('yyyy-MM-DD')
    return periodWindows.days.find(({ key }) => key === dateKey)?.windows || []
  }, [data.date, periodWindows.days])

  const value = useMemo(() => {
    return data.date
  }, [data.date])

  const isLoading = useMemo(() => {
    if (!value) {
      return false
    } else {
      return (
        moment(value).format('MM-YYYY') ===
        moment(new Date(periodWindows?.data[0]?.date)).format('MM-YYYY')
      )
    }
  }, [periodWindows?.data, value])

  return (
    <DefaultDatePicker
      onChangeHeaderDate={handleChangeHeaderDate}
      onApply={onApply}
      initialDate={new Date()}
      windowsPeriod={periodWindows.days}
      onApplyDisable={
        periodWindows.status || !data.date || !data.startTime?.value
      }
      applyWrapperClassName={`border-none ${
        type === 'bottomSheet' ? 'mb-2' : 'mb-0'
      }`}
      contentWrapper="shadow-none !mt-0 p-0 max-w-[503px] w-full pb-0"
      disabledPast
      applyText={t('labels.proceed_to_confirmation')}
      datesLoading={periodWindows.status}
      footerNode={
        <>
          {periodWindows.status ? (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          ) : !data.date ? (
            <></>
          ) : windows?.length !== 0 ? (
            <ChipBlock
              chipWrapperClassName={cn('tablet:!gap-3', {
                'max-h-[300px] overflow-auto': type === 'modal',
                'pb-20': type === 'bottomSheet',
              })}
              chipValue={data.startTime}
              chips={windows}
              setChipValue={(startTime) => {
                onChange(data.date, startTime)
              }}
            />
          ) : (
            <>
              {isLoading ? (
                <EmptyThisDate />
              ) : (
                <div className="w-full h-[75px]" />
              )}
            </>
          )}
        </>
      }
      type={type}
      value={value}
      onChange={(date) => {
        onChange(date, initChip)
      }}
    />
  )
}

import { format, set } from 'date-fns'
import moment from 'moment/moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useMemo } from 'react'

import { ImgProUser } from '@/assets/images/images'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { UserIcon } from '@/components/cardElements/UserIcon'
import { BookingCardStatus } from '@/components/cards/bookingCard/BookingCardStatus'
import { Button } from '@/components/common/buttons/Button'
import { H16, H18, H24, H48 } from '@/components/typography'
import { API_BOOKING } from '@/core/consts/apiLinks'
import { generateGoogleCalendar } from '@/core/consts/googleCalendar'
import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { formatPrice } from '@/core/helpers/formatPrice'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import { setDurationTime } from '@/core/helpers/setDurationTime'
import {
  addedBookingsTotalPrice,
  addedServicesSelector,
  allSelectedAddons,
  bookingDataSelector,
  calendarDataSelector,
  isBookingHasMobileSelector,
} from '@/features/booking/store/bookingSelectors'
import {
  clearBookingData,
  IAddOn,
  updatePaymentStatus,
} from '@/features/booking/store/bookingStore'
import { closeModal, openModal } from '@/features/modalsConfig/modalConfig'
import { DownloadPoints } from '@/features/paymentLink/components/Steps/successStep/components/PLSuccessScreen'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import useMixpanel from '@/hooks/useMixpanel'
import { useSocketStore } from '@/layouts/WebSocketLayout'
import { instance } from '@/store/instance'
import { MixpanelEvents } from '@/types/mixpanel'

export const useBookingSuccessModalOpen = () => {
  const dispatch = useAppDispatch()
  const setResponse = useSocketStore((state) => state.setResponse)
  const router = useRouter()

  return () =>
    openModal({
      currentModal: 'bookingSuccessModal',
      modalSettings: {
        outsideClose: false,
        maxWidth: 463,
        onClose: () => {
          dispatch(
            updatePaymentStatus({
              status: '',
              bookingId: '',
            })
          )
          setResponse({})
          closeModal()
          dispatch(clearBookingData())
          router.push(ROUTES.profile(router.query.proId?.toString() || ''))
        },
      },
    })
}

export const BookingSuccessModal = () => {
  const router = useRouter()
  const { trackEvent } = useMixpanel()
  const { t } = useTranslation(TRANSLATE_KEYS.booking)
  const { data, termsOfPayment, paymentStatusNew } =
    useAppSelector(bookingDataSelector)
  const profileInfo = useAppSelector(profileSelector)
  const addedServices = useAppSelector(addedServicesSelector)
  const isBookingMobileService = useAppSelector(isBookingHasMobileSelector)
  const taxPercent = termsOfPayment.taxPercent || 0
  const travelFee = isBookingMobileService ? termsOfPayment.travelFee || 0 : 0
  const travelFeeTax = travelFee * (taxPercent / 100)
  const totalPrice =
    useAppSelector(addedBookingsTotalPrice) + travelFeeTax + travelFee
  const calendarData = useAppSelector(calendarDataSelector)
  const dispatch = useAppDispatch()
  const selectedAddons = useAppSelector(allSelectedAddons)
  const socketState = useSocketStore((state) => state.response)
  const setResponse = useSocketStore((state) => state.setResponse)
  const addonsFullPrice = (selectedAddons || []).reduce(
    (acc, item) => acc + (item?.price || 0),
    0
  )
  const paymentStatus = JSON.parse(
    sessionStorage.getItem('paymentStatus') || '{}'
  )

  const status =
    socketState?.data?.bookingStatus ||
    paymentStatusNew?.status ||
    paymentStatus?.status
  // const { status } = useWebSocket()
  const date = String(
    moment(data.date)
      .set('hours', Number(data?.startTime?.value.split(':')?.[0]) || 0)
      .set('minutes', Number(data?.startTime?.value.split(':')?.[1]) || 0)
      .toDate()
  )

  // date from query
  const paramDate = router.query?.mainDate as string

  const formattedDate = paramDate
    ? format(
        set(new Date(), {
          year: new Date(paramDate).getFullYear(),
          month: new Date(paramDate).getMonth(),
          date: new Date(paramDate).getDate(),
          hours: new Date(paramDate).getHours(),
          minutes: new Date(paramDate).getMinutes(),
          seconds: 0,
        }),
        'yyyy-MM-dd HH:mm:ss'
      )
    : null
  const isValidFormattedDate = paramDate
    ? moment(formattedDate).isValid()
    : false

  const durationAddedServices = addedServices.reduce(
    (acc, service) => acc + service.duration,
    0
  )
  const duradionAddedAddons = selectedAddons.reduce(
    (acc, addon) => acc + (addon?.duration || 0),
    0
  )

  const dateFrom = useMemo(() => {
    if (isValidFormattedDate) {
      return formattedDate ?? ''
    } else {
      return date
    }
  }, [date, formattedDate, isValidFormattedDate])
  useEffect(() => {
    trackEvent(MixpanelEvents.actions.booking.NEW_BOOKING_CREATED)
  }, [])
  const fetchSingleBooking = async () => {
    const id = paymentStatusNew?.bookingId ?? ''
    try {
      const { data } = await instance.get(API_BOOKING.getSingleBooking(id))
      dispatch(
        updatePaymentStatus({
          status: data?.status,
          bookingId: id,
        })
      )
    } catch (error) {
      console.error('Error fetching booking data:', error)
    }
  }

  useEffect(() => {
    if (socketState?.type === 'BOOKING_STATUS' || status === 'CONFIRMED') {
      return
    } else {
      let intervalId: string | number | NodeJS.Timer | undefined
      if (paymentStatusNew?.status !== 'CONFIRMED') {
        if (paymentStatusNew?.status) {
          intervalId = setInterval(() => {
            fetchSingleBooking()
          }, 4000)
        }
      }

      fetchSingleBooking()

      return () => {
        if (intervalId) {
          clearInterval(intervalId) // Cleanup function
        }
      }
    }
  }, [paymentStatusNew?.status])

  return (
    <section
      className={
        'text-center px-4 py-5 tablet:px-8 tablet:py-10 tablet:my-5 overflow-auto'
      }
    >
      <H48 className="!font-bold maxTablet:hidden">
        {status === 'CONFIRMED' ? 'Success!' : 'In Progress'}
      </H48>
      <H24 className="!font-bold tablet:hidden">
        {status !== 'CONFIRMED' ? 'In Progress' : 'Success!'}
      </H24>
      <H18 color="text-gray" className="px-8 pt-2 maxTablet:hidden">
        {t('labels.you_have_finished_booking', {
          name: profileInfo.data.name || '',
          status: status?.toLocaleLowerCase() ?? '',
        })}
      </H18>
      <H16 color="text-gray" className="pt-2 tablet:hidden">
        {t('labels.you_have_finished_booking', {
          name: profileInfo.data.name || '',
          status: status?.toLocaleLowerCase() ?? '',
        })}
      </H16>
      {/*//*/}
      <CardWrapper
        className={`px-4 pt-4 pb-[18px] tablet:px-6 text-start mt-4`}
      >
        <DownloadPoints />
      </CardWrapper>
      {/*//*/}
      {status === 'CONFIRMED' && (
        <CardWrapper
          className={`px-4 pt-5 pb-[18px] tablet:px-6 text-start mt-4`}
        >
          <div className="flex justify-between pb-4 border-b border-lightGray tablet:pb-5">
            <div className="flex flex-col">
              <H18 className="maxTablet:!text-14 maxTablet:leading-[20px]">
                {moment(dateFrom).format('D MMMM yyyy ')}
                {data.startTime?.label || ''}
              </H18>
              <div className="flex items-center gap-[10px] mt-1.5 tablet:mt-2">
                {profileInfo.data.iconUrl ? (
                  <UserIcon size="24" iconUrl={profileInfo.data.iconUrl} />
                ) : (
                  <div
                    className={
                      'w-6 h-6  rounded-full overflow-hidden p-1 bg-[#EDDFFF]'
                    }
                  >
                    <Image alt={'alt pro icon'} src={ImgProUser} />
                  </div>
                )}
                <H16
                  className="maxTablet:!text-14 maxTablet:leading-[20px]"
                  color="text-gray"
                >
                  {profileInfo.data.name}
                </H16>
              </div>
            </div>
            <BookingCardStatus status={status ?? 'PENDING'} />
          </div>
          <div className="flex flex-col gap-3 py-5 border-b border-lightGray">
            {addedServices.map(({ name, id }) => (
              <div key={id}>
                <div className="flex justify-between gap-2">
                  <H16 className="maxTablet:!text-14 maxTablet:leading-[20px]">
                    {name}
                  </H16>

                  <H18
                    className="maxTablet:!text-14 maxTablet:leading-[20px] whitespace-nowrap	"
                    color="text-gray"
                  >
                    +{setDurationTime(durationAddedServices)}
                  </H18>
                </div>
              </div>
            ))}
            <AddonsInfo addons={selectedAddons} />
          </div>
          <div className="flex justify-between mt-4">
            <H18>Total duration</H18>
            <H18 className="!font-bold">
              {getDate(dateFrom)} -
              {getDate(
                moment(dateFrom)
                  .add('minutes', duradionAddedAddons + durationAddedServices)
                  .toISOString()
              )}
            </H18>
          </div>
          <div className="flex justify-between mt-4">
            <H18>Total</H18>
            <H16 color="text-orange" className="!font-bold">
              {formatPrice({
                currency: getCurrencySignByName(
                  profileInfo.data.currency || ''
                ),
                price: totalPrice + (addonsFullPrice || 0),
              })}
            </H16>
          </div>
        </CardWrapper>
      )}
      {/*//*/}
      <div className="flex flex-col gap-4 mt-6">
        <Button
          disabled={status !== 'CONFIRMED'}
          onClick={() => {
            closeModal()
            router.push(ROUTES.bookings)
            setResponse({})
            dispatch(
              updatePaymentStatus({
                status: '',
                bookingId: '',
              })
            )
            sessionStorage.removeItem('paymentStatus')
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
          <Button
            buttonType="withIcon"
            className="w-full"
            disabled={status !== 'CONFIRMED'}
          >
            {t('labels.add_to_calendar')}
          </Button>
        </a>
      </div>
    </section>
  )
}

const AddonsInfo = ({ addons }: { addons?: (IAddOn | undefined)[] }) => {
  return (
    <div className={'grid gap-3'}>
      {addons?.map((addon) => (
        <div key={addon?.id} className={'flex justify-between'}>
          <H16 className="maxTablet:!text-14 maxTablet:leading-[20px]">
            {addon?.title}
          </H16>
          <H18
            color={'text-gray'}
            className="maxTablet:!text-14 maxTablet:leading-[20px] whitespace-nowrap"
          >
            +{setDurationTime(addon?.duration || 0)}
          </H18>
        </div>
      ))}
    </div>
  )
}

const getDate = (date?: string) => {
  const minutes = moment(date).get('minutes')
  if (minutes !== 0) {
    return moment(date).format(`h:mma`)
  } else {
    return moment(date).format(`ha`)
  }
}

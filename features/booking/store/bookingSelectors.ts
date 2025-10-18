import moment from 'moment'
import { createSelector } from 'reselect'

import { calculateDeposit } from '@/core/helpers/calculateDeposit'
import { convertTimeToAmPm } from '@/core/helpers/convertTimeToAmPm'
import { IAddOn } from '@/features/booking/store/bookingStore'
import { RootStateType } from '@/store/rootStore'
import { IService } from '@/types/categoriesTypes'
import { ITermsOfPayment } from '@/types/common'

const booking = (state: RootStateType) => state.booking
const state = (state: RootStateType) => state

export const bookingServicesSelector = createSelector(
  booking,
  ({ services }) => {
    return services
  }
)
export const bookingDataSelector = createSelector(
  booking,
  ({ services: _, ...rest }) => {
    return {
      ...rest,
      data: { ...rest.data, date: rest.data.date },
      deposit: rest.termsOfPayment.amount,
      currency: rest.termsOfPayment.currency,
      depositType: rest.termsOfPayment.depositType,
    }
  }
)
export const bookingPeriodWindowsSelector = createSelector(
  booking,
  ({ periodWindows }) => {
    return {
      ...periodWindows,
      days: periodWindows.data.map((el) => ({
        day: new Date(el.date).getDate(),
        key: el.date,
        isHaveWindows: !!el.windows.length,
        windows:
          [...new Set([...el.windows])].map((el) => ({
            label: convertTimeToAmPm(el),
            value: el,
          })) || [],
      })),
    }
  }
)

export const bookingWindowsSelector = createSelector(booking, ({ window }) => {
  return {
    ...window,
    data: {
      ...window.data,
      windows:
        window.data?.windows?.map((el) => ({
          label: convertTimeToAmPm(el),
          value: el,
        })) || [],
    },
  }
})

export const bookingServicesTimeInMin = createSelector(
  booking,
  ({ addedServices, addOns }) => {
    const addonsDuration =
      addOns.selectedIds
        .map((key) => addOns.data?.[key as keyof typeof addOns.data])
        .reduce((acc, item) => acc + (item?.duration || 0), 0) || 0
    return (
      addedServices
        .map((el) => el.duration + (el.extraTime || 0))
        .reduce((acc, item) => acc + item, 0) + addonsDuration
    )
  }
)

export const addedServicesSelector = createSelector(
  booking,
  ({ addedServices }) => {
    return addedServices
  }
)

export const isBookingHasMobileSelector = createSelector(
  booking,
  ({ addedServices }) => addedServices.some((s) => s.isMobile)
)

export const addedBookingsTotalPrice = createSelector(
  booking,
  ({ addedServices }) => {
    return addedServices?.length > 0
      ? (addedServices || [])
          .map((el) => el.totalPrice || 0)
          ?.reduce((acc, el) => acc + el)
      : 0
  }
)

export const addedBookingsPrice = createSelector(
  booking,
  ({ addedServices }) => {
    return addedServices?.length > 0
      ? (addedServices || [])
          .map((el) => el.price || 0)
          ?.reduce((acc, el) => acc + el)
      : 0
  }
)

export const depositSelector = createSelector(
  booking,
  ({ addedServices, termsOfPayment }) => {
    const isMobileServiceAdded = addedServices.some((s) => s.isMobile)
    const deposit = calculateDeposit({
      isMobileServiceAdded,
      services: addedServices,
      termsOfPayment: termsOfPayment as ITermsOfPayment,
    })

    return {
      amount: deposit || 0,
      currency: termsOfPayment.currency?.toLowerCase() || 'usd',
    }
  }
)

export const addedBookingsTax = createSelector(booking, ({ addedServices }) => {
  return addedServices?.length > 0
    ? (addedServices || [])
        .map((el) => el.taxPrice || 0)
        ?.reduce((acc, el) => acc + el)
    : 0
})

export const calendarDataSelector = createSelector(
  state,
  ({ booking, profile }) => {
    const date = booking.data.date
    const timezone = profile.iProInfo.data.timezone || ''
    const addonIds = booking.addOns.selectedIds
    const addonDurations = () => {
      return addonIds.reduce(
        (acc, key) => acc + (booking.addOns.data?.[key]?.duration || 0),
        0
      )
    }
    const services = booking.addedServices.map((s) => s.name).join(', ')

    const times = booking.data?.startTime?.label
      .replace('am', '')
      .replace('pm', '')
      .split(':')
    const isAm = !!booking.data?.startTime?.label.includes('am')
    return {
      from:
        moment(date)
          .set({
            hours: getHours(Number(times?.[0] || 0), isAm),
            minutes: Number(times?.[1] || 0),
            seconds: 0,
          })
          .toDate() || undefined,
      descriptions: `Manage your appointment in the app: \n <a target="_blank" href="${process.env.NEXT_PUBLIC_SITE_URL}/bookings">${process.env.NEXT_PUBLIC_SITE_URL}/bookings</a>`,
      location: booking?.data?.address || profile.iProInfo.data.address || '',
      title: `${profile.iProInfo.data.name} - ${services}`,
      duration: getDuration(booking.addedServices, addonDurations()),
      timezone,
    }
  }
)

export const referenceServicesSelector = createSelector(
  booking,
  ({ addedReferenceServices }) => {
    return addedReferenceServices
  }
)

const getHours = (num: number, isAm: boolean) => {
  return isAm ? num : num + 12
}

const getDuration = (value: IService[], addonDurations: number) => {
  const durationInMin =
    (value?.reduce((acc, { duration }) => acc + duration, 0) || 60) +
    (addonDurations || 0)

  const hours = Math.floor(durationInMin / 60)
  return hours === 0
    ? { hours: 0, minutes: durationInMin }
    : { hours, minutes: durationInMin - hours * 60 }
}

export const previewAddOnsSelector = createSelector(booking, ({ addOns }) => {
  const selectedIds = addOns.selectedIds

  const selectedAddons: IAddOn[] = selectedIds.reduce(
    (acc: IAddOn[], id) => [...acc, addOns?.data?.[id] as IAddOn],
    []
  )

  const allAddons = Object.values(addOns?.data || {})

  return [
    ...selectedAddons,
    ...allAddons.filter((el) => !selectedIds.includes(el.id)),
  ]
})

export const addedAddonsIdsSelector = createSelector(
  booking,
  ({ addOns }) => addOns.selectedIds
)
export const allAddonsSelector = createSelector(booking, ({ addOns }) =>
  Object.values(addOns?.data || {})
)
export const allSelectedAddons = createSelector(booking, ({ addOns }) => {
  const selected = addOns.selectedIds
  const allAddons = addOns.data
  return selected ? selected.map((id) => allAddons?.[id]) : []
})
export const addonsTotalPriceSelector = createSelector(
  booking,
  ({ addOns }) => {
    return addOns.selectedIds
      .map((id) => addOns.data?.[id])
      .reduce((acc, addon) => acc + (addon?.price || 0), 0)
  }
)

export const addonsLoadingStatus = createSelector(booking, ({ addOns }) => {
  return addOns.status
})

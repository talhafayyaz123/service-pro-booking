import isPointWithinRadius from 'geolib/es/isPointWithinRadius'
import { useMemo } from 'react'

import { convertMileToKm } from '@/core/helpers/convertMilesToKm'
import { useAppSelector } from '@/hooks/hooks'

import { bookingDataSelector } from '../store/bookingSelectors'

export const useOutOfBookingArea = () => {
  const { about: aboutPro } = useAppSelector((state) => state.profile)
  const {
    data: { location },
  } = useAppSelector(bookingDataSelector)
  return useMemo(() => {
    if (
      !!aboutPro?.data?.coverArea &&
      aboutPro?.data?.coverArea &&
      location?.lat &&
      location.lng
    ) {
      return !isPointWithinRadius(
        {
          latitude: aboutPro.data?.latitude,
          longitude: aboutPro.data?.longitude,
        },
        { latitude: location?.lat, longitude: location?.lng },
        convertMileToKm(aboutPro?.data?.coverArea) * 1000
      )
    }

    return true
  }, [
    aboutPro.data?.coverArea,
    aboutPro.data?.latitude,
    aboutPro.data?.longitude,
    location,
  ])
}

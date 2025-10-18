import GoogleMapReact from 'google-map-react'
import useTranslation from 'next-translate/useTranslation'
import { useCallback, useEffect, useRef, useState } from 'react'

import { IconDirection } from '@/assets/icons/icons'
import { CurrentPositionMarker } from '@/components/common/CurrentPositionMarker'
import { Input } from '@/components/common/Input'
import { MapGeoCode } from '@/components/Map/MapGeoCode'
import { defaultCenter, standardMapOptions } from '@/components/Map/mapOptions'
import { PlacePredictionsList } from '@/components/Map/PlacePredictionsList'
import { H16, OrangeBlock } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { bookingDataSelector } from '@/features/booking/store/bookingSelectors'
import { setBookingData } from '@/features/booking/store/bookingStore'
import { useAutoCompleteService } from '@/features/search/hooks/useAutoCompleteService'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

import { useOutOfBookingArea } from '../hooks/useOutOfBookingArea'

interface Props {
  localLoaded: boolean
}

export const BookingMobileService = ({ localLoaded }: Props) => {
  const dispatch = useAppDispatch()
  const [isLocationSetted, setIsLocationSetted] = useState(false)

  const proName = useAppSelector((state) => state.profile.iProInfo.data.name)
  const {
    data: { address, location },
  } = useAppSelector(bookingDataSelector)
  const { getPlacePredictions, placePredictions, placesService } =
    useAutoCompleteService()
  const isFar = useOutOfBookingArea()
  const locationRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation(TRANSLATE_KEYS.booking)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [showLocations, setShowLocations] = useState(false)
  const onFocus = () => {
    setShowLocations(true)
  }

  const onBlur = () => {
    setTimeout(() => {
      setShowLocations(false)
      handleScrollAndFocus()
    }, 300)
  }

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map)
  }, [])

  useEffect(() => {
    getPlacePredictions({ input: address as string })
    //eslint-disable-next-line
  }, [address])

  const changeLocation = useCallback(
    async (lat: number, lng: number) => {
      const response = await MapGeoCode.fromLatLng(
        lat.toString(),
        lng.toString()
      )
      dispatch(
        setBookingData({ address: response.results[0].formatted_address })
      )
      dispatch(
        setBookingData({
          location: {
            lat,
            lng,
          },
        })
      )
    },
    [dispatch]
  )

  const onSelect = (place_id: string, place: string) => {
    if (placesService) {
      placesService.getDetails({ placeId: place_id }, (result) => {
        const loc = result?.geometry?.location
        if (loc) {
          dispatch(setBookingData({ address: place }))
          dispatch(
            setBookingData({
              location: {
                lat: loc.lat(),
                lng: loc.lng(),
              },
            })
          )
          setShowLocations(false)
        }
      })
    }
  }

  const getAddressByGeolocation = useCallback(() => {
    if (window.navigator.geolocation && (!location || !address)) {
      if (!isLocationSetted) {
        window.navigator.geolocation.getCurrentPosition(
          async (p) => {
            const lat = p.coords.latitude
            const lng = p.coords.longitude
            await changeLocation(lat, lng)
          },
          async () => {
            await changeLocation(defaultCenter.lat, defaultCenter.lng)
          }
        )
        setIsLocationSetted(true)
      }
    }
  }, [changeLocation, address, location, isLocationSetted])

  useEffect(() => {
    if (!localLoaded) {
      return
    }
    setTimeout(() => {
      getAddressByGeolocation()
    }, 100)
  }, [getAddressByGeolocation, localLoaded])

  useEffect(() => {
    if (map && location) {
      map.panTo({
        lat: Number(location.lat),
        lng: Number(location.lng),
      })
    }
  }, [map, location])
  // console.log(location)

  const handleScrollAndFocus = () => {
    const focusLocation = document.getElementById('location-element')
    if (locationRef?.current) {
      // Scroll to the div
      locationRef.current.scrollIntoView({
        behavior: 'smooth', // Smooth scrolling
        block: 'center', // Center the element in the viewport
      })

      // Set focus to the div
      locationRef?.current?.focus()
    }
    if (focusLocation) {
      focusLocation.scrollIntoView({
        behavior: 'smooth', // Smooth scrolling
        block: 'center', // Center the element in the viewport
      })
    }
  }

  return (
    <>
      <div className="w-full h-px my-6 bg-lightGray" />
      <div className={'flex flex-col gap-3'}>
        <OrangeBlock>
          <H16>
            Looks like you're booking a mobile service, please provide your
            address as guidance for {proName || 'Pro'}.
          </H16>
        </OrangeBlock>
        {isFar && (
          <OrangeBlock>
            <H16>You are out of the area that this professional covers</H16>
          </OrangeBlock>
        )}
      </div>
      <div className="relative">
        <Input
          label={t('labels.your_address')}
          value={address || ''}
          onChange={(e) =>
            dispatch(setBookingData({ address: e.target.value }))
          }
          placeholder={t('labels.address_input_placeholder')}
          className="my-6"
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {placePredictions.length && showLocations ? (
          <PlacePredictionsList
            onSelect={onSelect}
            predictions={placePredictions}
            wrapperClassName="max-h-[210px] overflow-y-auto"
          />
        ) : null}
      </div>
      <div className="relative h-[190px] w-full overflow-hidden rounded-[20px]">
        <div
          id="location-element"
          tabIndex={-1}
          ref={locationRef}
          role="button"
          onClick={getAddressByGeolocation}
          className="absolute z-20 flex items-center justify-center w-8 h-8 bg-white rounded-full cursor-pointer bottom-3 right-3 hover:bg-slate-50"
        >
          <IconDirection className="text-black" />
        </div>
        <GoogleMapReact
          {...standardMapOptions}
          onGoogleApiLoaded={({ map }: { map: google.maps.Map }) => onLoad(map)}
          zoom={15}
          onClick={({ lat, lng }) => {
            changeLocation(lat, lng)
          }}
        >
          {location && (
            <CurrentPositionMarker lat={location.lat} lng={location.lng} />
          )}
        </GoogleMapReact>
      </div>
    </>
  )
}

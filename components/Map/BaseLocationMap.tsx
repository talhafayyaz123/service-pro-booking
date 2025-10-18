import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  OverlayView,
  useJsApiLoader,
} from '@react-google-maps/api'
import Link from 'next/link'
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  IconDirection,
  IconMapMarker,
  IconMapMarkerWithDot,
  IconMapMarkerWithoutShadow,
} from '@/assets/icons/icons'
import { CurrentPositionMarker } from '@/components/common/CurrentPositionMarker'
import { locationMapOptions } from '@/components/Map/mapOptions'
import MapZoomControls from '@/components/Map/MapZoomControls'
import { H14, H16, H20 } from '@/components/typography'
import { cn } from '@/core/helpers/cn'
import { formatDistance } from '@/core/helpers/formatDistance'
import { CWMapZoomControls } from '@/features/themes/common/CWMapZoomControls'
import { useAppSelector } from '@/hooks/hooks'
import { meSelector } from '@/store/me/meSelector'
import { IBaseMap, ICurrentLoc } from '@/types/maps'

export const BaseLocationMap = ({
  latitude,
  longitude,
  distance: userDistance,
  address,
  loadedMapOptions,
  customPin,
  customZoomControls,
  className,
  mapContainerClassName,
  classNameAddress,
  classNameDirection,
  classNameCurrentPosition,
  askForLocation = true,
}: IBaseMap & {
  customPin?: ReactElement
  customZoomControls?: boolean
  classNameAddress?: string
  classNameDirection?: string
  classNameCurrentPosition?: string
  askForLocation?: boolean
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [currentLocation, setCurrentLocation] = useState<ICurrentLoc | null>(
    null
  )
  const [distance, setDistance] = useState<number | null>(null)
  const [showDirection, setShowDirection] = useState(false)
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null)

  const { country } = useAppSelector(meSelector)

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  useEffect(() => {
    if (map) {
      if (
        latitude &&
        longitude &&
        !currentLocation?.lat &&
        !currentLocation?.lng
      ) {
        map.setCenter({
          lat: latitude,
          lng: longitude,
        })
      } else if (
        latitude &&
        longitude &&
        currentLocation?.lat &&
        currentLocation?.lng
      ) {
        const address = {
          lat: latitude,
          lng: longitude,
        }

        const bounds1 = new google.maps.LatLngBounds(address)

        const current = {
          lat: currentLocation?.lat,
          lng: currentLocation?.lng,
        }

        bounds1?.extend && bounds1?.extend(current)

        map?.fitBounds && map?.fitBounds(bounds1)
      }
    }
  }, [map, latitude, longitude, currentLocation?.lat, currentLocation?.lng])

  useEffect(() => {
    if (window.navigator.geolocation && askForLocation) {
      window.navigator.geolocation.getCurrentPosition((p) => {
        const lat = p.coords.latitude
        const lng = p.coords.longitude

        setCurrentLocation({ lat, lng })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const directionService =
    !directions && latitude && longitude && currentLocation && showDirection

  const getGoogleMapsDirectionsUrl = (
    origin: { lat: number | null | undefined; lng: number | null | undefined },
    destination: {
      lat: number | null | undefined
      lng: number | null | undefined
    }
  ) => {
    return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}`
  }

  const googleMapsLink = useMemo(() => {
    if (currentLocation) {
      return getGoogleMapsDirectionsUrl(
        { lat: currentLocation.lat, lng: currentLocation.lng },
        { lat: latitude, lng: longitude }
      )
    }
    return ''
  }, [latitude, longitude, currentLocation])

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
  })
  if (!isLoaded) {
    return null
  }

  const defaultMapOptions = loadedMapOptions || locationMapOptions

  return (
    <>
      <div
        className={`rounded-[20px] w-full overflow-hidden relative ${className}`}
      >
        <GoogleMap
          {...defaultMapOptions}
          mapContainerClassName={mapContainerClassName}
          onLoad={(map) => onLoad(map)}
          onUnmount={onUnmount}
        >
          {currentLocation ? (
            <OverlayView
              position={{
                lat: currentLocation.lat,
                lng: currentLocation.lng,
              }}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
            >
              <CurrentPositionMarker className={cn(classNameCurrentPosition)} />
            </OverlayView>
          ) : null}
          {latitude && longitude ? (
            <OverlayView
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              position={{ lat: latitude, lng: longitude }}
            >
              <div className="absolute -translate-x-1/2 -translate-y-full left-1/2 top-full">
                {showDirection ? (
                  <IconMapMarkerWithDot />
                ) : (
                  <>
                    {customPin ? (
                      customPin
                    ) : (
                      <IconMapMarker className="w-[34px] h-[48px]" />
                    )}
                  </>
                )}
              </div>
            </OverlayView>
          ) : null}
          {directionService ? (
            <DirectionsService
              options={{
                destination: {
                  lat: latitude,
                  lng: longitude,
                },
                origin: {
                  lat: currentLocation?.lat,
                  lng: currentLocation?.lng,
                },
                travelMode: google.maps.TravelMode.WALKING,
              }}
              callback={(res) => {
                setDirections(res)
                if (
                  res?.routes.length &&
                  res.routes[0].legs.length &&
                  res.routes[0].legs[0] &&
                  res.routes[0].legs[0].distance
                ) {
                  setDistance(res.routes[0].legs[0].distance.value)
                }
              }}
            />
          ) : null}
          {directions && (
            <DirectionsRenderer
              directions={directions as google.maps.DirectionsResult}
              options={{
                polylineOptions: {
                  strokeColor: '#F36A46',
                  strokeWeight: 6,
                },
                suppressMarkers: true,
              }}
            />
          )}
        </GoogleMap>
        {address ? (
          <div
            className={cn(
              'absolute hidden p-4 bg-white tablet:block rounded-xl left-6 bottom-6',
              classNameAddress
            )}
            style={{
              boxShadow: '0px 4px 27px rgba(182, 190, 206, 0.3)',
            }}
          >
            <H20 className="pr-8">{address}</H20>
            {userDistance ? (
              <div className="flex items-center mt-1">
                <IconMapMarkerWithoutShadow className="h-[14px] w-[14px]" />
                <H16 className="ml-2 !text-[#939DAA]">
                  {formatDistance(userDistance, country)} from you
                </H16>
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="absolute hidden space-y-3 top-6 right-6 tablet:block">
          {customZoomControls ? (
            <CWMapZoomControls map={map} />
          ) : (
            <MapZoomControls map={map} />
          )}
        </div>
        {currentLocation ? (
          <div className="absolute -translate-x-1/2 w-max tablet:bottom-6 tablet:right-6 tablet:left-auto left-1/2 bottom-4 tablet:translate-x-0">
            <Link href={googleMapsLink}>
              <a target={'_blank'}>
                <div
                  role="button"
                  onClick={() => {
                    setShowDirection((prevState) => !prevState)
                    if (directions) {
                      setDirections(null)
                    }
                  }}
                  className={cn(
                    'text-16 font-bold flex items-center gap-2.5 px-6 py-3 transition-colors bg-white cursor-pointer rounded-xl hover:bg-slate-50',
                    classNameDirection
                  )}
                >
                  <IconDirection className="text-black" />
                  Directions
                </div>
              </a>
            </Link>
          </div>
        ) : null}
      </div>
      {address ? (
        <div className={cn('mt-4 tablet:hidden', classNameAddress)}>
          <H16>{address}</H16>
          {distance ? (
            <div className="flex items-center mt-2.5">
              <IconMapMarkerWithoutShadow className="h-[14px] w-[14px]" />
              <H14 color="text-gray" className="ml-2">
                {formatDistance(distance, country)} from you
              </H14>
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  )
}

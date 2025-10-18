import GoogleMapReact from 'google-map-react'
import { memo, useCallback, useEffect, useState } from 'react'

import { CurrentPositionMarker } from '@/components/common/CurrentPositionMarker'
import { MapGeoCode } from '@/components/Map/MapGeoCode'
import { mapOptions } from '@/components/Map/mapOptions'
import MapZoomControls from '@/components/Map/MapZoomControls'
import { useBusinessDetailStep } from '@/features/accountSetup/stepsV2/BusinessDetailV2/BusinessDetailV2'

export const MapSection = memo(() => {
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const { longitude, latitude } = useBusinessDetailStep((state) => state)
  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map)
  }, [])

  const setState = useBusinessDetailStep.getState().setState

  useEffect(() => {
    if (map) {
      setState({ map })
    }
  }, [map, setState])

  const handleClickOnMap = async (lat: number, lng: number) => {
    const response = await MapGeoCode.fromLatLng(lat.toString(), lng.toString())

    const results = response?.results
    const resLength = results?.length
    if (resLength) {
      const lastResult = results[resLength - 1]
      const countryCode = lastResult.address_components?.find(
        (address: any) => {
          return address.types.includes('country') ? address.short_name : false
        }
      )?.short_name as string

      if (map) {
        setTimeout(() => {
          map?.panTo({
            lat,
            lng,
          })
        }, 200)
      }
      const addr = response.results[0].formatted_address
      setState({
        address: addr,
        latitude: lat,
        longitude: lng,
        countryCode,
        currentLocation: false,
      })
    }
  }

  return (
    <div className="rounded-[20px] w-full h-[240px] overflow-hidden relative mt-4 tablet:mt-6">
      <div className="absolute z-20 space-y-3 top-3 right-3">
        <MapZoomControls map={map} />
      </div>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
          libraries: ['places'],
        }}
        yesIWantToUseGoogleMapApiInternals
        center={center}
        zoom={12}
        options={mapOptions}
        onGoogleApiLoaded={({ map }: { map: google.maps.Map }) => {
          onLoad(map)
        }}
        onClick={({ lat, lng }: any) => {
          handleClickOnMap(lat, lng)
        }}
      >
        {latitude && longitude ? (
          <CurrentPositionMarker lat={latitude} lng={longitude} />
        ) : null}
      </GoogleMapReact>
    </div>
  )
})

const center = {
  lat: 40.713051,
  lng: -74.007233,
}

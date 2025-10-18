import useTranslation from 'next-translate/useTranslation'
import { useEffect, useRef, useState } from 'react'
import usePlacesService from 'react-google-autocomplete/lib/usePlacesAutocompleteService'

import { Checkbox } from '@/components/common/Checkbox'
import { Input } from '@/components/common/Input'
import { MapGeoCode } from '@/components/Map/MapGeoCode'
import { PlacePredictionsList } from '@/components/Map/PlacePredictionsList'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useBusinessDetailStep } from '@/features/accountSetup/stepsV2/BusinessDetailV2/BusinessDetailV2'
import useMixpanel from '@/hooks/useMixpanel'
import { MixpanelEvents } from '@/types/mixpanel'
import AutocompletePrediction = google.maps.places.AutocompletePrediction

export const LocationSection = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { address, map, currentLocation } = useBusinessDetailStep(
    (state) => state
  )
  const { trackEvent } = useMixpanel()
  const [loading, setLoading] = useState(false)
  const setState = useBusinessDetailStep.getState().setState

  const {
    placesService,
    placePredictions,
    isPlacePredictionsLoading,
    getPlacePredictions,
  } = usePlacesService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    debounce: 200,
    language: 'en',
  })

  const handleChange = async () => {
    if (window.navigator.geolocation) {
      setLoading(true)
      window.navigator.geolocation.getCurrentPosition(
        async (p) => {
          const lat = p.coords.latitude
          const lng = p.coords.longitude
          const response = await MapGeoCode.fromLatLng(String(lat), String(lng))

          const results = response?.results
          const resLength = results?.length
          if (resLength) {
            const lastResult = results[resLength - 1]
            const countryCode = lastResult.address_components?.find(
              (address: any) => {
                return address.types.includes('country')
                  ? address.short_name
                  : false
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
              currentLocation: !currentLocation,
            })
            setLoading(false)
          }
        },
        () => setLoading(false)
      )
    }
  }

  const isSetPredictions = useRef(false)
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([])

  const onFocus = () => {
    isSetPredictions.current = false
    getPlacePredictions({
      input: address || 'New York',
    })
  }

  useEffect(() => {
    if (!isSetPredictions.current && placePredictions?.length > 0) {
      isSetPredictions.current = true
      setPredictions(placePredictions)
    }
  }, [placePredictions])

  const [localAddress, setLocalAddress] = useState('')

  useEffect(() => {
    setLocalAddress(address)
  }, [address])
  useEffect(() => {
    if (currentLocation) {
      trackEvent(MixpanelEvents.actions.business_listing.CURRENT_LOCATION_USED)
    }
    if (localAddress) {
      trackEvent(MixpanelEvents.actions.business_listing.ADDRESS_MANUALLY)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onBlur = () => {
    setTimeout(() => {
      isSetPredictions.current = false
      setPredictions([])

      if (localAddress !== address) {
        setLocalAddress(address)
      }
    }, 200)
  }

  return (
    <>
      <Checkbox
        className="mt-4 tablet:mt-6"
        checked={currentLocation}
        disabled={loading}
        onChange={handleChange}
        rightLabel={
          <span className={'flex gap-2 items-center'}>
            {t('labels.use_current_location') + '?'}
            {loading && <div className="loader_spinner_mini_orange" />}
          </span>
        }
      />
      <div className={'relative mt-4 tablet:mt-6'}>
        <Input
          label={'Business address'}
          isLoading={isPlacePredictionsLoading}
          value={localAddress}
          onChange={(e) => {
            isSetPredictions.current = false
            setLocalAddress(e.target.value)
            getPlacePredictions({
              input: e.target.value,
            })
          }}
          placeholder={t('text.address')}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {predictions.length > 0 && (
          <PlacePredictionsList
            onSelect={(v) => {
              placesService?.getDetails({ placeId: v }, (res) => {
                const location = res?.geometry?.location

                if (location) {
                  const addr =
                    predictions.find((item) => item.place_id === v)
                      ?.description ?? ''
                  setLocalAddress(addr)
                  setState({
                    currentLocation: false,
                    latitude: location.lat(),
                    longitude: location.lng(),
                    countryCode: res.address_components?.find((component) =>
                      component.types.includes('country')
                    )?.short_name,
                    address: addr,
                  })

                  if (map) {
                    setTimeout(() => {
                      map?.panTo({
                        lat: location.lat(),
                        lng: location.lng(),
                      })
                    }, 200)
                  }
                }
              })
            }}
            predictions={predictions}
          />
        )}
      </div>
    </>
  )
}

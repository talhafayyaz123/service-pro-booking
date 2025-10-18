import GoogleMapReact from 'google-map-react'
import useTranslation from 'next-translate/useTranslation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { getProBusinessData } from '@/api/pro/getProBusinessData'
import { CurrentPositionMarker } from '@/components/common/CurrentPositionMarker'
import { FormCheckboxWithLabel } from '@/components/common/FormCheckbox'
import { FormInput } from '@/components/common/FormInput'
import { FormMilesDropdown } from '@/components/common/FormMilesDropdown'
import { MapGeoCode } from '@/components/Map/MapGeoCode'
import { mapOptions } from '@/components/Map/mapOptions'
import MapZoomControls from '@/components/Map/MapZoomControls'
import { PlacePredictionsList } from '@/components/Map/PlacePredictionsList'
import {
  ErrorMessage,
  H16,
  H18,
  H20,
  H32,
  Label,
} from '@/components/typography'
import { getDistanceOptions } from '@/core/consts/durations'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { checkCountryForDistance } from '@/core/helpers/formatDistance'
import { CurrentLocation } from '@/features/accountSetup/components/CurrentLocation/CurrentLocation'
import { inputs, steps } from '@/features/accountSetup/helpers/steps'
import { TOnboardingSchema } from '@/features/accountSetup/schema/onboarding'
import { useAutoCompleteService } from '@/features/search/hooks/useAutoCompleteService'
import { useAppSelector } from '@/hooks/hooks'
import { useProCurrency } from '@/hooks/useProCurrency'
import { meSelector } from '@/store/me/meSelector'
import { ISetupBusinessForm } from '@/types/onboarding'

const center = {
  lat: 40.713051,
  lng: -74.007233,
}

const SetupBusiness = () => {
  const methods = useFormContext<TOnboardingSchema>()
  const { watch, setValue } = methods
  const { currency } = useProCurrency()
  const {
    map,
    lat,
    lng,
    isMiles,
    showLocations,
    useOwnLocation,
    placePredictions,
    onLoad,
    onBlur,
    onFocus,
    onSelect,
    onSuccess,
    areaCoverErrorMessage,
    setUseOwnLocation,
    currLocError,
  } = useSetupBusiness({
    watch,
    setValue,
  })

  const ref = useRef(null)

  const isInHome = watch(inputs[steps.businessDetail].isInHome)
  const isInVenue = watch(inputs[steps.businessDetail].isInVenue)
  const isMobile = watch(inputs[steps.businessDetail].isMobile)

  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const distanceOptions = getDistanceOptions(isMiles)

  return (
    <div className="maxTablet:max-w-[425px] max-w-[620px] bg-white mx-auto  pt-8  tablet:p-[60px] tablet:mt-20 rounded-[20px] tablet:shadow-xl mb-[50px]">
      <div className="flex flex-col small:px-0 px-5 gap-2 tablet:gap-1">
        <H32 className="!font-bold">{t('titles.where_work')}</H32>
        <H18 color="text-gray">{t('text.where_work_text')}</H18>
      </div>
      <div className="mt-5 rounded-[20px] shadow-xl p-5">
        <H20 className="font-bold !leading-6">
          {t('titles.type_of_services')}
        </H20>

        {serviceTypes.map((service) => (
          <FormCheckboxWithLabel
            key={service.id}
            wrapperClassName={'mt-5 flex items-center justify-between'}
            name={service.name}
            label={service.label}
          />
        ))}
      </div>
      {isInHome || isInVenue || isMobile ? (
        <div className="mt-5 rounded-[20px] shadow-xl small:p-6 p-5">
          <H20 className="font-bold !leading-6">{t('titles.location')}</H20>
          <div className="flex flex-col items-start justify-between mt-5">
            <CurrentLocation
              checked={useOwnLocation}
              onSelect={onSelect}
              onChange={() => setUseOwnLocation((prevState) => !prevState)}
            />

            {currLocError && useOwnLocation && (
              <ErrorMessage className="mt-2">{currLocError}</ErrorMessage>
            )}
          </div>
          <div className="relative mt-6">
            <Label className={`flex small:mb-2 mb-2.5 overflow-hidden`}>
              {t('text.business_address')}
            </Label>
            <div ref={ref}>
              <FormInput
                placeholder={t('text.address')}
                name={inputs[steps.businessDetail].address}
                onFocus={onFocus}
                onBlur={onBlur}
              />
              {placePredictions.length && showLocations ? (
                <PlacePredictionsList
                  predictions={placePredictions}
                  onSelect={onSelect}
                />
              ) : null}
            </div>
          </div>

          {isMobile && (
            <>
              <div className="pb-6 border-b border-lightGray" />
              <div className="mt-6">
                <FormMilesDropdown
                  label={t('labels.the_area_cover')}
                  placeholder={t('text.enter_distance')}
                  options={distanceOptions}
                  isMiles={isMiles}
                  error={areaCoverErrorMessage}
                  name={inputs[steps.businessDetail].coverArea}
                />
              </div>
              <div className="relative mt-6">
                <H16 className="absolute top-11 left-5 z-40" color="text-black">
                  {currency?.sign}
                </H16>
                <FormInput
                  name={inputs[steps.businessDetail].travelFee}
                  type="number"
                  label={t('labels.travel_fee')}
                  inputClassName="pl-9"
                  placeholder="Amount"
                />
              </div>
            </>
          )}
          <div className="mt-6">
            <div className="rounded-[20px] w-full h-[240px] overflow-hidden relative">
              <div className="absolute z-20 space-y-3 top-3 right-3">
                <MapZoomControls map={map} />
              </div>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
                }}
                yesIWantToUseGoogleMapApiInternals
                center={center}
                zoom={12}
                options={mapOptions}
                onGoogleApiLoaded={({ map }: { map: google.maps.Map }) =>
                  onLoad(map)
                }
                onClick={({ lat, lng }: any) => {
                  onSuccess({ lat, lng })
                }}
              >
                {lat && lng ? (
                  <CurrentPositionMarker lat={lat} lng={lng} />
                ) : null}
              </GoogleMapReact>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

interface IUseSetupBusiness {
  setValue: any
  watch: any
}

const useSetupBusiness = ({ setValue, watch }: IUseSetupBusiness) => {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const lat = watch(inputs[steps.businessDetail].latitude)
  const lng = watch(inputs[steps.businessDetail].longitude)
  const address = watch(inputs[steps.businessDetail].address)
  const [currLocError, setcurrLocError] = useState('')
  const [useOwnLocation, setUseOwnLocation] = useState(false)
  const { country } = useAppSelector(meSelector)
  const isMiles = checkCountryForDistance(country)
  const { placePredictions, getPlacePredictions, placesService } =
    useAutoCompleteService()
  const [showLocations, setShowLocations] = useState(false)
  const isMobile = watch(inputs[steps.businessDetail].isMobile)
  const areaCover = watch(inputs[steps.businessDetail].coverArea)?.value

  const areaCoverErrorMessage = useMemo(() => {
    if (!isMobile) {
      return ''
    }
    if (areaCover < 1) {
      return 'The area I cover must be greater than 1 mile'
    } else if (areaCover > 1000) {
      return 'The area I cover must not exceed 1000 miles.'
    }
    return ''
  }, [areaCover, isMobile])

  useEffect(() => {
    setValue(inputs[steps.businessDetail].isMiles, isMiles)
  }, [isMiles, setValue])

  const onSelect = (place_id: string, place: string) => {
    if (placesService) {
      placesService.getDetails({ placeId: place_id }, (result) => {
        const loc = result?.geometry?.location
        if (loc) {
          setValue(inputs[steps.businessDetail].isSelected, true)
          onSuccess({
            lat: loc.lat(),
            lng: loc.lng(),
            address: place,
            dontSetAddress: false,
          })
        }
      })
    }
  }

  useEffect(() => {
    getPlacePredictions({
      input: address,
      ...(isMobile && { componentRestrictions: { country: 'US' } }),
    })
    //eslint-disable-next-line
  }, [address, isMobile])

  useEffect(() => {
    if (isMobile) {
      if (currLocError) setValue(inputs[steps.businessDetail].address, '')
      map?.setCenter(center)
    }
    //eslint-disable-next-line
  }, [useOwnLocation, isMobile])

  const onFocus = () => {
    setShowLocations(true)
  }

  const onBlur = () => {
    setTimeout(() => {
      setShowLocations(false)
    }, 300)
  }

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map)
  }, [])

  const onSuccess = useCallback(
    async ({
      lat,
      lng,
      address,
      dontSetAddress,
    }: {
      lat: number
      lng: number
      address?: string
      dontSetAddress?: boolean
    }) => {
      if (map) {
        const response = await MapGeoCode.fromLatLng(
          lat.toString(),
          lng.toString()
        )

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
          // if (isMobile && countryCode !== 'US') {
          setcurrLocError('Location must be within the United States.')
          // return
          // }
          setcurrLocError('')
          if (countryCode) {
            setValue(inputs[steps.businessDetail].countryCode, countryCode)
          }
        }
        setValue(inputs[steps.businessDetail].latitude, lat)
        setValue(inputs[steps.businessDetail].longitude, lng)

        setTimeout(() => {
          map.panTo({
            lat,
            lng,
          })
        }, 200)
        if (!dontSetAddress) {
          const addr = response.results[0].formatted_address
          setValue(inputs[steps.businessDetail].address, address || addr, {
            shouldValidate: true,
          })
        }
      }
    },
    //eslint-disable-next-line
    [map, setValue, isMobile]
  )
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getProBusinessData()
        const cArea = res.coverArea?.toString() || ''
        const coverArea = res.coverArea
          ? {
              label: cArea,
              value: res.coverArea,
            }
          : undefined

        const businessDetails: ISetupBusinessForm = {
          address: res.address,
          coverArea,
          isInPerson: res.isInPerson,
          isMobile: res.isMobile,
          isVirtual: res.isVirtual,
          isInHome: res?.isInHome,
          isInVenue: res?.isInVenue,
          businessName: res.businessName,
          name: res.businessName ? 'createBusinessName' : 'useName',
          latitude: res.latitude,
          longitude: res.longitude,
          travelFee: res.travelFee || undefined,
          countryCode: res.countryCode,
        }
        setValue(steps.businessDetail, businessDetails)
      } catch {
        return
      }
    }
    getData()
  }, [setValue])

  return {
    onLoad,
    onBlur,
    onFocus,
    onSelect,
    onSuccess,
    setUseOwnLocation,
    map,
    lat,
    lng,
    isMiles,
    showLocations,
    useOwnLocation,
    placePredictions,
    areaCoverErrorMessage,
    currLocError,
  }
}

export default SetupBusiness

const serviceTypes = [
  {
    id: 1,
    label: 'Home based',
    name: inputs[steps.businessDetail].isInHome,
  },
  {
    id: 2,
    label: 'Venue based',
    name: inputs[steps.businessDetail].isInVenue,
  },
  {
    id: 3,
    label: 'Mobile',
    name: inputs[steps.businessDetail].isMobile,
  },
  {
    id: 4,
    label: 'Virtual',
    name: inputs[steps.businessDetail].isVirtual,
  },
]

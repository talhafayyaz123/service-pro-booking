import GoogleMapReact from 'google-map-react'
import useTranslation from 'next-translate/useTranslation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { getProBusinessData } from '@/api/pro/getProBusinessData'
import { Checkbox } from '@/components/common/Checkbox'
import { CurrentPositionMarker } from '@/components/common/CurrentPositionMarker'
import { FormCheckboxWithLabel } from '@/components/common/FormCheckbox'
import { FormInput } from '@/components/common/FormInput'
import { FormMilesDropdown } from '@/components/common/FormMilesDropdown'
import { FormRadioWithLabel } from '@/components/common/FormRadio'
import { RadioWithLabel } from '@/components/common/Radio'
import { MapGeoCode } from '@/components/Map/MapGeoCode'
import { mapOptions } from '@/components/Map/mapOptions'
import MapZoomControls from '@/components/Map/MapZoomControls'
import { PlacePredictionsList } from '@/components/Map/PlacePredictionsList'
import { H16, H20, H40, Label } from '@/components/typography'
import { getDistanceOptions } from '@/core/consts/durations'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { checkCountryForDistance } from '@/core/helpers/formatDistance'
import { useAutoCompleteService } from '@/features/search/hooks/useAutoCompleteService'
import { useAppSelector } from '@/hooks/hooks'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useProCurrency } from '@/hooks/useProCurrency'
import { meSelector } from '@/store/me/meSelector'
import { IOnboardingFormState, ISetupBusinessForm } from '@/types/onboarding'

const center = {
  lat: 40.713051,
  lng: -74.007233,
}

const SetupBusiness = () => {
  const methods = useFormContext<IOnboardingFormState<ISetupBusinessForm>>()
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
  } = useSetupBusiness({
    watch,
    setValue,
  })

  const ref = useRef(null)

  //eslint-disable-next-line
  // @ts-ignore
  const name = watch('businessDetails.name')
  //eslint-disable-next-line
  // @ts-ignore
  const isInPerson = watch('businessDetails.isInPerson')
  const isMobile = watch('businessDetails.isMobile')
  const address = watch('businessDetails.address')

  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const distanceOptions = getDistanceOptions(isMiles)

  const isExistedLocation = placePredictions.some(
    (i) => i.description === address
  )

  useClickOutside(ref, () => {
    if (!isExistedLocation) setValue('businessDetails.address', '')
  })

  return (
    <div className="maxTablet:max-w-[425px] max-w-[620px] bg-white mx-auto  pt-8  tablet:p-[60px] tablet:mt-20 rounded-[20px] tablet:shadow-xl mb-[50px]">
      <H40 className="!font-bold small:px-0 px-5">
        {t('titles.setup_business')}
      </H40>
      <div className="mt-8 rounded-[20px] shadow-xl small:p-6 p-5">
        <H20 className="font-bold !leading-6">{t('titles.business_name')}</H20>
        <RadioWithLabel
          label={t('labels.use_your_name')}
          wrapperClassName="mt-5 flex items-center justify-between"
          onChange={() => {
            setValue(
              'businessDetails.name',
              name === 'useName'
                ? 'createBusinessName'
                : !name
                ? 'useName'
                : 'useName'
            )
          }}
          value="useName"
          checked={name === 'useName'}
        />
        <FormRadioWithLabel
          wrapperClassName="mt-4 flex items-center justify-between"
          name="businessDetails.name"
          label={t('labels.create_business_name')}
          value="createBusinessName"
        />

        {name === 'createBusinessName' ? (
          <div className="mt-4">
            <FormInput
              name="businessDetails.businessName"
              placeholder={t('text.business_name')}
              required
            />
          </div>
        ) : null}
      </div>
      <div className="mt-5 rounded-[20px] shadow-xl small:p-6 p-5">
        <H20 className="font-bold !leading-6">
          {t('titles.type_of_services')}
        </H20>
        <FormCheckboxWithLabel
          wrapperClassName={'mt-5 flex items-center justify-between'}
          name="businessDetails.isInPerson"
          label="In-person"
        />
        <FormCheckboxWithLabel
          wrapperClassName={'mt-5 flex items-center justify-between'}
          name="businessDetails.isMobile"
          label="Mobile"
        />

        <FormCheckboxWithLabel
          wrapperClassName={'mt-5 flex items-center justify-between'}
          name="businessDetails.isVirtual"
          label="Virtual"
        />
      </div>
      {isInPerson || isMobile ? (
        <div className="mt-5 rounded-[20px] shadow-xl small:p-6 p-5">
          <H20 className="font-bold !leading-6">{t('titles.location')}</H20>
          <div className="flex items-center justify-between mt-5">
            <Checkbox
              checked={useOwnLocation}
              onChange={() => {
                setUseOwnLocation((prevState) => !prevState)
              }}
              rightLabel={t('labels.use_current_location')}
            />
          </div>
          <div className="relative mt-6">
            <Label className={`flex small:mb-2 mb-2.5 overflow-hidden`}>
              {t('text.business_address')}
            </Label>
            <div ref={ref}>
              <FormInput
                placeholder={t('text.address')}
                name="businessDetails.address"
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
                  name="businessDetails.coverArea"
                />
              </div>
              <div className="relative mt-6">
                <H16
                  className="absolute bottom-3.5 left-5 z-40"
                  color="text-black"
                >
                  {currency?.sign}
                </H16>
                <FormInput
                  name="businessDetails.travelFee"
                  type="number"
                  required
                  label={t('labels.travel_fee')}
                  inputClassName="pl-9"
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
  const lat = watch('businessDetails.latitude')
  const lng = watch('businessDetails.longitude')
  const address = watch('businessDetails.address')
  const [isSetted, setIsSetted] = useState(false)
  const { country } = useAppSelector(meSelector)
  const isMiles = checkCountryForDistance(country)
  const { placePredictions, getPlacePredictions, placesService } =
    useAutoCompleteService()
  const [showLocations, setShowLocations] = useState(false)
  const isMobile = watch('businessDetails.isMobile')
  const areaCover = watch('businessDetails.coverArea')?.value

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
    setValue('businessDetails.isMiles', isMiles)
  }, [isMiles, setValue])

  const onSelect = (place_id: string, place: string) => {
    if (placesService) {
      placesService.getDetails({ placeId: place_id }, (result) => {
        const loc = result?.geometry?.location
        if (loc) {
          setValue('businessDetails.isSelected', true)
          onSuccess({ lat: loc.lat(), lng: loc.lng(), address: place })
        }
      })
    }
  }

  useEffect(() => {
    getPlacePredictions({ input: address })
    //eslint-disable-next-line
  }, [address])

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

  const [useOwnLocation, setUseOwnLocation] = useState(false)

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

          if (countryCode) {
            setValue('businessDetails.countryCode', countryCode)
          }
        }
        setValue('businessDetails.latitude', lat)
        setValue('businessDetails.longitude', lng)

        setTimeout(() => {
          map.panTo({
            lat,
            lng,
          })
        }, 200)
        if (!dontSetAddress) {
          const addr = response.results[0].formatted_address
          setValue('businessDetails.address', address || addr)
        }
      }
    },
    [map, setValue]
  )

  useEffect(() => {
    if (map && lat && lng && !isSetted) {
      onSuccess({ lat, lng, dontSetAddress: true })
      setIsSetted(true)
    }
  }, [map, lat, lng, onSuccess, isSetted])

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
          businessName: res.businessName,
          name: res.businessName ? 'createBusinessName' : 'useName',
          latitude: res.latitude,
          longitude: res.longitude,
          travelFee: res.travelFee,
          countryCode: res.countryCode,
        }

        Object.keys(businessDetails).forEach((k) => {
          setValue(
            `businessDetails.${k as keyof ISetupBusinessForm}`,
            //eslint-disable-next-line
            // @ts-ignore
            businessDetails[k]
          )
        })
      } catch {
        return
      }
    }
    getData()
  }, [setValue])

  useEffect(() => {
    if (useOwnLocation) {
      if (window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition((p) =>
          onSuccess({ lat: p.coords.latitude, lng: p.coords.longitude })
        )
      }
    }
  }, [useOwnLocation, onSuccess])

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
  }
}

export default SetupBusiness

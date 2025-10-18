import useTranslation from 'next-translate/useTranslation'
import { memo, useMemo, useRef } from 'react'

import { MilesDropdown } from '@/components/common/dropdown/MilesDropdown'
import { getDistanceOptions } from '@/core/consts/durations'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { checkCountryForDistance } from '@/core/helpers/formatDistance'
import { useBusinessDetailStep } from '@/features/accountSetup/stepsV2/BusinessDetailV2/BusinessDetailV2'
import { useAppSelector } from '@/hooks/hooks'
import { meSelector } from '@/store/me/meSelector'

export const DistanceSection = memo(() => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { distance, typeOfServices } = useBusinessDetailStep((state) => state)
  const isTouched = useRef(false)
  const setState = useBusinessDetailStep.getState().setState

  const { country } = useAppSelector(meSelector)
  const isMiles = checkCountryForDistance(country)
  const distanceOptions = getDistanceOptions(isMiles)

  const error = useMemo(() => {
    if (!isTouched.current) {
      return undefined
    } else {
      if (!distance?.value || distance.value < 1) {
        return 'The area I cover must be greater than 1 mile'
      } else if (distance.value >= 1000) {
        return 'The area I cover must not exceed 1000 miles.'
      }
    }
  }, [distance?.value])

  if (!typeOfServices.includes('isMobile')) {
    return <></>
  }

  return (
    <MilesDropdown
      className="w-full mt-4 tablet:mt-6"
      label={t('labels.the_area_cover')}
      placeholder={t('text.enter_distance')}
      options={distanceOptions}
      isMiles={isMiles}
      value={distance}
      error={error}
      onChange={(e) => {
        isTouched.current = true
        setState({
          distance: e as any,
        })
      }}
    />
  )
})

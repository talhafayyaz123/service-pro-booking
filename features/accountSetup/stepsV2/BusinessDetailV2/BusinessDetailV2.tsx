import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import React, { useCallback, useMemo } from 'react'
import { create } from 'zustand'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { SpinnerFullScreen } from '@/components/Loaders'
import { H18, H20, H32 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { BdHeader } from '@/features/accountSetup/stepsV2/BusinessDetailV2/components/BdHeader/BdHeader'
import { BusinessDetailFooter } from '@/features/accountSetup/stepsV2/BusinessDetailV2/components/BusinessDetailFooter/BusinessDetailFooter'
import { DistanceSection } from '@/features/accountSetup/stepsV2/BusinessDetailV2/components/DistanceSection/DistanceSection'
import { LocationSection } from '@/features/accountSetup/stepsV2/BusinessDetailV2/components/LocationSection/LocationSection'
import { MapSection } from '@/features/accountSetup/stepsV2/BusinessDetailV2/components/MapSecton/MapSection'
import { SelectTypeSection } from '@/features/accountSetup/stepsV2/BusinessDetailV2/components/SelectTypeSection/SelectTypeSection'
import { TravelFeeSection } from '@/features/accountSetup/stepsV2/BusinessDetailV2/components/TravelFeeSection/TravelFeeSection'
import { serviceTypes } from '@/features/accountSetup/stepsV2/BusinessDetailV2/constants'
import { TTypeOfServices } from '@/features/accountSetup/stepsV2/BusinessDetailV2/types'
import useMixpanel from '@/hooks/useMixpanel'
import BaseLayout from '@/layouts/BaseLayout'
import {
  useGetBusinessDetailQuery,
  useSetBusinessDetailMutation,
} from '@/store/onboarding/onboardingApi'
import { MixpanelEvents } from '@/types/mixpanel'

const initialState = {
  typeOfServices: [],
  address: '',
  currentLocation: false,
}

interface IStore {
  typeOfServices: TTypeOfServices[]
  address: string
  countryCode?: string
  latitude?: number
  longitude?: number
  distance?: { label: string; value: number }
  setState: (params: Partial<IStore>) => void
  travelFee?: number | string
  map?: google.maps.Map | null
  currentLocation?: boolean
}

export const useBusinessDetailStep = create<IStore>((set, get) => ({
  ...initialState,
  setState: (params) => set({ ...get(), ...params }),
}))

export const BusinessDetailV2 = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.onboarding)
  const { isFetching } = useGetBusinessDetailQuery()

  return (
    <BaseLayout
      seoTitle={t('pro_seo_title')}
      seoDescription={t('pro_seo_description')}
    >
      {isFetching ? <SpinnerFullScreen /> : <_BusinessDetailV2 />}
    </BaseLayout>
  )
}

export const _BusinessDetailV2 = () => {
  const router = useRouter()
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { trackEvent } = useMixpanel()
  const { typeOfServices, address, distance, travelFee } =
    useBusinessDetailStep((state) => state)

  const isShowLocationSection = typeOfServices.some((type) =>
    ['isInHome', 'isInVenue', 'isMobile'].includes(type)
  )

  const isDisabled = useMemo(() => {
    if (typeOfServices.length === 0) {
      return true
    }

    if (isShowLocationSection) {
      if (!address) {
        return true
      } else if (Number(travelFee) > 100000) {
        return true
      }
    }

    if (typeOfServices.length > 1 && typeOfServices.includes('isMobile')) {
      if (
        !distance?.value ||
        Number(distance?.value) < 1 ||
        Number(distance?.value) >= 1000
      ) {
        return true
      }
    }

    return false
  }, [
    address,
    distance?.value,
    isShowLocationSection,
    travelFee,
    typeOfServices,
  ])

  const [setData, response] = useSetBusinessDetailMutation()

  const handleSubmit = async () => {
    const state = useBusinessDetailStep.getState()

    const response: any = await setData({
      address: state.address ?? '',
      countryCode: state.countryCode ?? 'US',
      coverArea: state.distance?.value ?? 0,
      latitude: state.latitude,
      longitude: state.longitude,
      travelFee: state.travelFee,
      ...serviceTypes.reduce(
        (acc, key) => ({ ...acc, [key]: state.typeOfServices.includes(key) }),
        {}
      ),
    })

    if (response && response?.data?.id) {
      await router.push(
        getUrlWithSearchParams(router.pathname, { step: 'services' }),
        undefined,
        { shallow: true }
      )
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const trackBusinessLocationPageEvent = useCallback(() => {
    trackEvent(MixpanelEvents.pages.onboarding.BUSINESS_LOCATION_PAGE)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // trackBusinessLocationPageEvent()
  return (
    <section className={'flex flex-col h-screen'}>
      <BdHeader />
      <div className="w-full h-[346px] hidden tablet:block absolute top-0 left-0 bg-violet z-[0]" />

      <div className="flex w-full z-[1]  flex-col items-center flex-1 h-full tablet:py-10 small:py-5 overflow-auto">
        <section className="w-full maxTablet:max-w-[425px] max-w-[620px] bg-white mx-auto  pt-8  tablet:p-[60px] tablet:mt-20 rounded-[20px] tablet:shadow-xl mb-[50px]">
          <H32 className="!font-bold">{t('titles.where_work')}</H32>
          <H18 color="text-gray">{t('text.where_work_text')}</H18>

          <SelectTypeSection />
          {isShowLocationSection && (
            <CardWrapper className="mt-3">
              <H20 className="font-bold !leading-6">{t('titles.location')}</H20>
              <LocationSection />
              <DistanceSection />
              <TravelFeeSection />
              <MapSection />
            </CardWrapper>
          )}
        </section>
      </div>
      <BusinessDetailFooter
        onClick={handleSubmit}
        isLoading={response.isLoading}
        disabled={isDisabled}
      />
    </section>
  )
}

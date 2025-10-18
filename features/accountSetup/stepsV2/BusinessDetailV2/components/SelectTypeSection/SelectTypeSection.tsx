import useTranslation from 'next-translate/useTranslation'
import { shallow } from 'zustand/shallow'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { CheckboxWithLabel } from '@/components/common/Checkbox'
import { H20 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useBusinessDetailStep } from '@/features/accountSetup/stepsV2/BusinessDetailV2/BusinessDetailV2'
import {
  serviceTypes,
  typeOfServicesLabel,
} from '@/features/accountSetup/stepsV2/BusinessDetailV2/constants'
import { TTypeOfServices } from '@/features/accountSetup/stepsV2/BusinessDetailV2/types'
import useMixpanel from '@/hooks/useMixpanel'
import { MixpanelEvents } from '@/types/mixpanel'

export const SelectTypeSection = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { trackEvent } = useMixpanel()
  const selectedTypes = useBusinessDetailStep(
    (state) => state.typeOfServices,
    shallow
  )
  const setState = useBusinessDetailStep.getState().setState

  const handleChange = (item: TTypeOfServices) => {
    let res = [...selectedTypes]
    if (res.includes(item)) {
      res = res.filter((el) => el !== item)
    } else {
      res = [...res, item]
    }
    setState({ typeOfServices: res })
    if (item) {
      switch (item) {
        case 'isInHome':
          trackEvent(MixpanelEvents.actions.onboarding.HOME_BASE_SELECTED)
          break
        case 'isMobile':
          trackEvent(MixpanelEvents.actions.onboarding.MOBILE_BASE_SELECTED)
          break
        case 'isVirtual':
          trackEvent(MixpanelEvents.actions.onboarding.VIRTUAL_BASE_SELECTED)
          break
        case 'isInVenue':
          trackEvent(MixpanelEvents.actions.onboarding.VENUE_BASE_SELECTED)
          break
        default:
          null
          break
      }
    }
  }

  return (
    <CardWrapper className="w-full mt-4 tablet:mt-6">
      <H20 className="font-bold !leading-6">{t('titles.type_of_services')}</H20>

      {serviceTypes.map((item) => (
        <CheckboxWithLabel
          checked={selectedTypes.includes(item)}
          onChange={() => handleChange(item)}
          wrapperClassName={'mt-5 flex items-center justify-between'}
          key={item}
          label={typeOfServicesLabel?.[item] ?? ''}
        />
      ))}
    </CardWrapper>
  )
}

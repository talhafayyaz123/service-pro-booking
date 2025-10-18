import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'
import { useController, useFormContext } from 'react-hook-form'

import {
  getbusinessTypes,
  getstepBusinessTypes,
} from '@/api/onboarding-pro/get-business-types'
import { CategoryCard } from '@/components/common/CategoryCard'
import { Checkbox } from '@/components/common/Checkbox'
import { H18, H32 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { inputs, steps } from '@/features/accountSetup/helpers/steps'
import { TOnboardingSchema } from '@/features/accountSetup/schema/onboarding'
import useMixpanel from '@/hooks/useMixpanel'
import { MixpanelEvents } from '@/types/mixpanel'

const ChooseCategory = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { data: session } = useSession()
  const { trackEvent } = useMixpanel()
  const { setValue } = useFormContext<TOnboardingSchema>()
  const {
    field: { onChange, value },
  } = useController({
    name: inputs[steps.businessTypes].categories,
    defaultValue: [],
  })

  const { data: businessTypes } = useQuery({
    queryKey: ['business-types'],
    queryFn: getbusinessTypes,
  })

  const { data: businessTypesStep } = useQuery({
    queryKey: ['step-business-types', session?.user?.accessToken],
    queryFn: getstepBusinessTypes,
    refetchOnMount: true,
  })

  useEffect(() => {
    if ((businessTypesStep?.categories || []).length > 0) {
      setValue(
        inputs[steps.businessTypes].categories,
        businessTypesStep?.categories.map((category) => category.id)
      )
    }
    //eslint-disable-next-line
  }, [businessTypesStep])
  useEffect(() => {
    trackEvent(MixpanelEvents.pages.onboarding.BUSINESS_TYPE_PAGE)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleChange = (id: string) => {
    trackEvent(MixpanelEvents.actions.onboarding.CATEGORY_NAME_SELECTED)
    if (value?.includes(id)) {
      onChange(value?.filter((item: string) => item !== id))
      return
    }
    onChange([...value, id])
  }

  return (
    <div className="maxTablet:max-w-[425px] max-w-[620px] bg-white mx-auto  pt-8 px-5 tablet:p-[60px] tablet:my-20 rounded-[20px] tablet:shadow-xl">
      <div className="flex flex-col gap-1 mb-8">
        <H32 className="!font-bold">{t('titles.service_offer')}</H32>
        <H18 color="text-gray">{t('text.service_offer_text')}</H18>
      </div>
      <div className="grid grid-cols-1 tablet:gap-px bg-lightGray">
        {businessTypes?.categories?.map((data, index) => (
          <CategoryCard
            key={index}
            className={'cursor-pointer'}
            onClick={() => {
              handleChange(data.id)
            }}
            data={data}
          >
            <Checkbox
              value={data.id}
              // onClick={() => {
              //   field.onChange(data.id)
              // }}
              checked={value?.includes(data.id)}
            />
          </CategoryCard>
        ))}
      </div>
    </div>
  )
}

export default ChooseCategory

import useTranslation from 'next-translate/useTranslation'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'

import { Button } from '@/components/common/buttons/Button'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { cn } from '@/core/helpers/cn'
import {
  stepNumbers,
  steps,
  TSteps,
} from '@/features/accountSetup/helpers/steps'
import { TOnboardingSchema } from '@/features/accountSetup/schema/onboarding'

const arr: TSteps[] = [steps.welcome, steps.trial]

const SetupFooter = ({ step }: { step: TSteps }) => {
  const { buttonText, disabled, hidden } = useFooterData(step)

  // if on specific step footer is hidden
  if (hidden) {
    return null
  }

  return (
    <>
      {!arr.includes(step) && (
        <div className="h-[82px] hidden tablet:flex mt-auto bg-white  items-center justify-end shadow-xl px-20">
          <Button
            disabled={disabled}
            type="submit"
            buttonType="3d"
            className="px-10"
          >
            {buttonText}
          </Button>
        </div>
      )}
      <div
        className={cn(
          'py-3 px-5 bg-white tablet:hidden rounded-t-[20px] z-[1] shadow-xl',
          step === steps.trial && 'pb-[74px] shadow-none'
          // isSmall && 'pb-4'
        )}
      >
        <Button
          type="submit"
          disabled={disabled}
          className="w-full"
          buttonType="orange"
          size="50"
        >
          {buttonText}
        </Button>
      </div>
    </>
  )
}

const useFooterData = (step: TSteps) => {
  const { watch, formState } = useFormContext<TOnboardingSchema>()

  const { t } = useTranslation(TRANSLATE_KEYS.common)
  const {
    basicInfo,
    businessTypes,
    businessDetail: {
      isInHome,
      isInVenue,
      isMobile,
      isVirtual,
      address,
      coverArea,
    },
    services,
    portfolio,
  } = watch()

  const first = !(basicInfo.bio && basicInfo.businessName && basicInfo.iconUrl)
  const second = !businessTypes?.categories?.length

  const place = isInHome || isInVenue || isMobile || isVirtual
  let addressCheck = false
  let areaCheck = false

  if (isInHome || isInVenue || isMobile) {
    addressCheck = !address || !!formState.errors?.businessDetail?.address
  }

  if (isMobile) {
    areaCheck =
      !coverArea?.value ||
      !!formState.errors?.businessDetail?.coverArea ||
      !!formState.errors?.businessDetail?.coverArea?.value
  }

  const businessDetailDisabled = addressCheck || areaCheck
  const third = !place || businessDetailDisabled

  const fourth = !!services?.every((service) => !service.categories?.length)
  const fifth =
    (portfolio.portfolioPhotos?.filter((photo) => !!photo.url)?.length || 0) < 2

  const disabled: Record<number, boolean> = useMemo(
    () => ({
      1: first,
      2: second,
      3: third,
      4: fourth,
    }),
    [first, second, third, fourth]
  )

  const buttonText: Record<number, string> = useMemo(
    () => ({
      0: t('buttons.get_started'),
      1: t('buttons.save_and_continue'),
      6: t('buttons.get_started'),
    }),
    [t]
  )

  const hidden: Record<number, boolean> = useMemo(
    () => ({
      5: fifth,
    }),
    [fifth]
  )
  return useMemo(
    () => ({
      buttonText:
        buttonText[stepNumbers[step] in buttonText ? stepNumbers[step] : 1],
      disabled: disabled?.[stepNumbers[step]] || false,
      hidden: hidden?.[stepNumbers[step]] || false,
    }),
    [buttonText, disabled, step, hidden]
  )
}

export default SetupFooter

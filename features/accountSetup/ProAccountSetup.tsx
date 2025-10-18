import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm, UseFormWatch } from 'react-hook-form'
import uuid from 'react-uuid'

import { checkOnboardingv2 } from '@/api/onboarding'
import { ProSetupHeader } from '@/components/header/ProSetupHeader'
import { SpinnerFullScreen } from '@/components/Loaders'
import { AddQuestionModal } from '@/components/modals/AddQuestionModal'
import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { getLastStep } from '@/features/accountSetup/helpers/check-step'
import { steps, TStepKeys, TSteps } from '@/features/accountSetup/helpers/steps'
import { useOnboardingSubmit } from '@/features/accountSetup/hooks/useOnboardingSubmit'
import {
  onboardingSchema,
  TOnboardingSchema,
} from '@/features/accountSetup/schema/onboarding'
import AdditionalInfo from '@/features/accountSetup/steps/AdditionalInfo-new'
import { BasicInfo } from '@/features/accountSetup/steps/BasicInfo'
import ChooseCategory from '@/features/accountSetup/steps/ChooseCategory-new'
import ChooseServices from '@/features/accountSetup/steps/ChooseServices-new'
import SetupBusiness from '@/features/accountSetup/steps/SetupBusiness-new'
import Trial from '@/features/accountSetup/steps/Trial'
import Welcome from '@/features/accountSetup/steps/Welcome'
import { useYupValidationResolver } from '@/hooks/useYupResolver'
import BaseLayout from '@/layouts/BaseLayout'

const SetupFooter = dynamic(() => import('features/accountSetup/SetupFooter'))

const arr: TSteps[] = [steps.welcome, steps.trial]

const defaultValues = {
  [steps.basicInfo]: {
    usename: false,
  },
  [steps.businessTypes]: {
    categories: [],
  },
  [steps.businessDetail]: {
    address: '',
    travelFee: undefined,
  },
  [steps.portfolio]: {
    portfolioPhotos: [
      {
        id: '',
        uniqueId: uuid(),
        url: '',
        order: 0,
        isCover: true,
      },
      {
        id: '',
        uniqueId: uuid(),
        url: '',
        order: 1,
        isCover: false,
      },
    ],
  },
}

export const ProAccountSetup = () => {
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const { data: session } = useSession()
  const step = router.query?.step as TSteps

  const { data } = useQuery({
    queryKey: ['onboarding', 'pro', session?.user?.accessToken, step],
    queryFn: checkOnboardingv2,
  })
  const { last } = getLastStep({
    steps: data?.steps || {},
  }) as { last: TSteps & 'otp' }

  const resolver = useYupValidationResolver<TOnboardingSchema>(
    onboardingSchema({ step: step || last })
  )

  const methods = useForm<TOnboardingSchema>({
    resolver,
    defaultValues,
    mode: 'onChange',
  })

  const { onBack, type, content, onNextStep, isFetching } = useSetupPro(
    tooltipRef,
    methods.watch
  )

  const { t } = useTranslation(TRANSLATE_KEYS.onboarding)

  const submit = useOnboardingSubmit({
    step: type,
    onNextStep,
  })

  const onSubmit = async (data: TOnboardingSchema) => {
    submit(data[type])
  }

  return (
    <BaseLayout
      seoTitle={t('pro_seo_title')}
      seoDescription={t('pro_seo_description')}
    >
      <div ref={tooltipRef} />
      <FormProvider {...methods}>
        <form
          id="app_layout"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="grid grid-rows-[auto_1fr_auto] relative !overflow-y-hidden  tablet:grid-rows-[82px_1fr]"
        >
          <ProSetupHeader
            step={isFetching ? steps.welcome : type}
            onNextStep={onNextStep}
            onBack={onBack}
          />
          {!arr.includes(type) ? (
            <div className="w-full h-[346px] hidden tablet:block absolute top-0 left-0 bg-violet z-[0]" />
          ) : null}
          <div className="z-[1] overflow-auto !p-0">
            {isFetching ? <SpinnerFullScreen /> : content[type]}
          </div>
          <SetupFooter step={type} />
        </form>
        <AddQuestionModal />
      </FormProvider>
    </BaseLayout>
  )
}

const useSetupPro = (
  tooltipRef: React.MutableRefObject<HTMLDivElement | null>,
  watch: UseFormWatch<TOnboardingSchema>
) => {
  const router = useRouter()
  const { pathname } = router
  const step = router.query?.step as TSteps
  const { data: session } = useSession()
  const [type, setType] = useState<TSteps>(steps.welcome)

  const { data, isFetching } = useQuery({
    queryKey: ['onboarding', 'pro', pathname, session?.user.isVerified, step],
    queryFn: checkOnboardingv2,
  })

  const { isMobile } = watch(steps.businessDetail)

  const { last } = getLastStep({
    steps: data?.steps || {},
  }) as { last: TSteps & 'otp' }

  const next = Object.keys(steps)[
    Object.values(steps).indexOf(type) + 1
  ] as TStepKeys

  const prev =
    (Object.keys(steps)[Object.values(steps).indexOf(type) - 1] as TStepKeys) ||
    steps.welcome

  const onBack = useCallback(() => {
    router.push(
      getUrlWithSearchParams(pathname, { step: steps[prev] }),
      undefined,
      {
        shallow: true,
      }
    )
  }, [pathname, router, prev])

  const onNextStep = useCallback(() => {
    if (data?.steps && last && last !== steps[next] && last !== type) {
      return router.push(
        getUrlWithSearchParams(pathname, {
          step: last,
          ...(isMobile && { mobile: 'true' }),
        }),
        undefined,
        {
          shallow: true,
        }
      )
    }

    if (type === steps.trial) {
      return router.push(ROUTES.myProfile, ROUTES.myProfile)
    }

    if (type === steps.welcome) {
      router.push(
        getUrlWithSearchParams(pathname, { step: steps.basicInfo }),
        undefined,
        {
          shallow: true,
        }
      )
    } else {
      router.push(
        getUrlWithSearchParams(pathname, {
          step: steps[next],
          ...(isMobile && { mobile: 'true' }),
        }),
        undefined,
        {
          shallow: true,
        }
      )
    }
  }, [pathname, router, type, last, data?.steps, isMobile, next])

  const Component = components[type]

  const content = useMemo(
    () => ({
      [type]: <Component {...{ onBack, onNextStep, tooltipRef, type }} />,
    }),
    [onBack, onNextStep, tooltipRef, type, Component]
  )

  useEffect(() => {
    if (step) {
      setType(step as TSteps)
      return
    } else {
      if (data) {
        if (last === 'otp') return
        setType(last || steps.welcome)
        return
      }
      setType(steps.welcome)
    }
  }, [step, data, last, router])

  return { onBack, onNextStep, content, type, setType, isFetching }
}

const components = {
  [steps.welcome]: Welcome,
  [steps.basicInfo]: BasicInfo,
  [steps.businessTypes]: ChooseCategory,
  [steps.businessDetail]: SetupBusiness,
  [steps.services]: ChooseServices,
  [steps.portfolio]: AdditionalInfo,
  [steps.trial]: Trial,
}

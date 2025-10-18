/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import React, { useMemo, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { CheckboxWithLabel } from '@/components/common/Checkbox'
import { FormInput } from '@/components/common/FormInput'
import { FormTextArea } from '@/components/common/FormTextArea'
import { SpinnerFullScreen } from '@/components/Loaders'
import RestrictedWordsModal from '@/components/modals/RestrictedWordsModal'
import { H16, H18, H20, H32 } from '@/components/typography'
// import { RestrictedWords } from '@/core/consts/restrictedWords'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
// import { checkForRestrictedWords } from '@/core/helpers/restrictedWordsValidation'
import { Card } from '@/features/accountSetup/steps/CardWrapper'
import { Footer } from '@/features/accountSetup/stepsV2/BasicInfoV2/components/footer'
import { BiHeader } from '@/features/accountSetup/stepsV2/BasicInfoV2/components/header'
import { UploadImage } from '@/features/accountSetup/stepsV2/BasicInfoV2/components/uploadImage'
import { IBasicInfoForm } from '@/features/accountSetup/stepsV2/BasicInfoV2/types'
import { useAppSelector } from '@/hooks/hooks'
// import useMixpanel from '@/hooks/useMixpanel'
import BaseLayout from '@/layouts/BaseLayout'
import { meSelector } from '@/store/me/meSelector'
import {
  IBasicInfoResponse,
  useGetBasicInfoQuery,
  useSetBasicInfoMutation,
} from '@/store/onboarding/onboardingApi'
// import { MixpanelEvents } from '@/types/mixpanel'

export const BasicInfoV2 = () => {
  const { data, isFetching } = useGetBasicInfoQuery()
  // const { trackEvent } = useMixpanel()
  const me = useAppSelector(meSelector)

  const meName = `${me?.firstName} ${me?.lastName}`

  const defaultValues: IBasicInfoForm = useMemo(
    () => ({
      bio: data?.bio,
      businessName: data?.businessName,
      asName: meName === data?.businessName,
      file: {
        iconUrl: data?.iconUrl,
        localeImage: '',
        file: null,
      },
    }),
    //eslint-disable-next-line
    [data]
  )
  // trackEvent(MixpanelEvents.pages.onboarding.BUSINESS_GENERAL_DETAILS_PAGE)
  return isFetching ? (
    <SpinnerFullScreen />
  ) : (
    <_BasicInfoV2 meName={meName} defaultValues={defaultValues} />
  )
}

export const _BasicInfoV2 = ({
  defaultValues,
  meName,
}: {
  defaultValues: IBasicInfoForm
  meName: string
}) => {
  const { t } = useTranslation(TRANSLATE_KEYS.onboarding)
  const translate = useTranslation(TRANSLATE_KEYS.account_setup)
  // const { trackEvent } = useMixpanel()
  const tt = translate.t
  // const [restrictedWords, setRestrictedWords] =
  //   useState<string[]>(RestrictedWords)
  const [showModal, setShowModal] = useState(false)
  const [detectedRestrictedWords, setDetectedRestrictedWords] = useState<
    string[]
  >([])
  // async function fetchRestrictedWords(): Promise<string[]> {
  //   return new Promise((resolve) =>
  //     setTimeout(() => resolve(RestrictedWords), 1000)
  //   )
  // }
  const methods = useForm<IBasicInfoForm>({
    defaultValues: defaultValues,
  })
  const router = useRouter()
  const [save, saveResponse] = useSetBasicInfoMutation()

  const onNextStep = () => {
    router.push(
      getUrlWithSearchParams(router.pathname, { step: 'businessTypes' }),
      undefined,
      { shallow: true }
    )
  }

  const onSubmit = async (data: IBasicInfoForm) => {
    // const hasRestrictedWords = checkForRestrictedWords(
    //   data.bio,
    //   restrictedWords,
    //   setDetectedRestrictedWords,
    //   setShowModal
    // )
    // if (hasRestrictedWords) {
    //   return
    // }

    const isDirty = JSON.stringify(defaultValues ?? {}) !== JSON.stringify(data)
    // if (data?.asName) {
    //   trackEvent(MixpanelEvents?.actions.onboarding.ACCOUNT_NAME_USED)
    // } else {
    //   trackEvent(MixpanelEvents?.actions.onboarding.NAME_MANUALLY_ENTERED)
    // }
    if (!isDirty) {
      onNextStep()
      return
    } else {
      const response = (await save(data).then((e) => e)) as {
        data: IBasicInfoResponse
      }

      if (
        !response?.data?.validationStatus &&
        response?.data?.restrictedWords?.length > 0
      ) {
        setDetectedRestrictedWords(response?.data?.restrictedWords)
        setShowModal(true)
        return
      }
      if (response?.data?.id) {
        onNextStep()
      }
    }
  }

  const isDisabled = useMemo(
    () => Object.keys(methods.formState.errors).length !== 0,
    //eslint-disable-next-line
    [JSON.stringify(methods.formState.errors ?? {})]
  )
  // useEffect(() => {
  //   fetchRestrictedWords().then(setRestrictedWords)
  // }, [])
  return (
    <BaseLayout
      seoTitle={t('pro_seo_title')}
      seoDescription={t('pro_seo_description')}
    >
      <section className={'flex flex-col h-screen'}>
        <BiHeader />
        <div className="w-full h-[346px] hidden tablet:block absolute top-0 left-0 bg-violet z-[0]" />
        <FormProvider {...methods}>
          <form
            id="baseInfoForm"
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex z-[1]  flex-col items-center flex-1 h-full tablet:py-10 small:py-5 overflow-auto"
          >
            <div className="max-w-[620px] w-full rounded-20 tablet:p-15 small:px-5 flex flex-col gap-6 py-6 bg-white shadow-xl">
              <div className="flex flex-col gap-1 maxTablet:px-5">
                <H32 className="!font-bold">{tt('titles.introduce')} </H32>
                <H18 color="text-gray">{tt('text.intro_text')}</H18>
              </div>
              <Controller
                name={'file'}
                rules={{
                  validate: (v: IBasicInfoForm['file']) => {
                    if (v.localeImage || v.iconUrl) {
                      return true
                    } else {
                      return 'Please upload a photo'
                    }
                  },
                }}
                render={({ field, fieldState }) => (
                  <>
                    <UploadImage
                      value={field.value}
                      error={fieldState.error?.message}
                      onChange={(v) => {
                        field.onChange({ ...(field?.value ?? {}), ...v })
                      }}
                    />
                  </>
                )}
              />

              <Card>
                <div className="flex flex-col gap-4">
                  <H20 className="mt-1">{tt('titles.business_name')}</H20>
                  <FormInput
                    rules={{
                      required: {
                        value: true,
                        message: 'Business name field is Required',
                      },
                    }}
                    name="businessName"
                    placeholder={tt('placeholders.business_name')}
                  />
                  <Controller
                    name="asName"
                    render={({ field }) => (
                      <CheckboxWithLabel
                        onChange={() => {
                          if (!field.value) {
                            methods.setValue('businessName', meName)
                          }
                          field.onChange(!field.value)
                        }}
                        value={field.value}
                        checked={field.value}
                        wrapperClassName="flex justify-between"
                        rightLabel={tt('text.use_name')}
                      />
                    )}
                  />
                </div>
              </Card>
              <Card>
                <div className="flex flex-col gap-4">
                  <H20 className="mt-1">{tt('titles.about_me')}</H20>
                  <H16 color="text-gray">{tt('text.about_text')}</H16>

                  <FormTextArea
                    count
                    maxLength={500}
                    name="bio"
                    rules={{
                      required: {
                        value: true,
                        message: 'About me field is Required',
                      },
                    }}
                    placeholder={tt('text.about_placeholder')}
                    inputClassName="min-h-52"
                  />
                </div>
              </Card>
            </div>
            <RestrictedWordsModal
              detectedWords={detectedRestrictedWords}
              isOpen={showModal}
              onClose={() => {
                setShowModal(false)
                setDetectedRestrictedWords([])
              }}
            />
          </form>
        </FormProvider>
        <Footer
          isLoading={saveResponse.isLoading}
          watch={methods.watch()}
          disabled={isDisabled}
        />
      </section>
    </BaseLayout>
  )
}

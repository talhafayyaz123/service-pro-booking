import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'

import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { SignUpAsClient } from '@/features/signUp/client/SignUpAsClient'
import { useSignUpStepper } from '@/features/signUp/hooks/useSignUpStepper'
import { OnboardingLayout } from '@/features/signUp/OnboardingLayout'
import BaseLayout from '@/layouts/BaseLayout'

const Client: NextPage = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.onboarding)
  const { data } = useSession()
  const { onBack } = useSignUpStepper(data?.user)

  return (
    <BaseLayout
      seoTitle={'Client onboarding'}
      seoDescription={t('client_seo_description')}
    >
      <OnboardingLayout onBack={onBack}>
        <SignUpAsClient />
      </OnboardingLayout>
    </BaseLayout>
  )
}
export default Client

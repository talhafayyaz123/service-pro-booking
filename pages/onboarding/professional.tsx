import { GetServerSideProps, NextPage } from 'next'
import { getSession, useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'

import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useSignUpStepper } from '@/features/signUp/hooks/useSignUpStepper'
import { OnboardingLayout } from '@/features/signUp/OnboardingLayout'
import { SignUpAsPro } from '@/features/signUp/pro/SignUpAsPro'
import BaseLayout from '@/layouts/BaseLayout'

const Professional: NextPage = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.onboarding)
  const { data } = useSession()
  const { onBack } = useSignUpStepper(data?.user)

  useEffect(() => {
    document.body.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return (
    <BaseLayout
      seoDescription={t('pro_seo_description')}
      seoTitle="Pro onboarding"
    >
      <OnboardingLayout onBack={onBack}>
        <SignUpAsPro />
      </OnboardingLayout>
    </BaseLayout>
  )
}
export default Professional

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (session?.user && session.user.role === 'PRO' && session.user.isVerified) {
    const query = ctx.query?.step ? `?step=${ctx.query.step}` : ''
    return {
      redirect: {
        destination: ROUTES.setup_pro + query,
        permanent: false,
      },
    }
  }

  return { props: {} }
}

import { useQuery } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { getSession, useSession } from 'next-auth/react'

import { checkOnboardingv2 } from '@/api/onboarding'
import { SpinnerFullScreen } from '@/components/Loaders'
import { ISteps } from '@/features/accountSetup/helpers/steps'
import { ProAccountSetup } from '@/features/accountSetup/ProAccountSetup'
import { BasicInfoV2 } from '@/features/accountSetup/stepsV2/BasicInfoV2/BasicInfoV2'
import { BusinessDetailV2 } from '@/features/accountSetup/stepsV2/BusinessDetailV2/BusinessDetailV2'

const Index = () => {
  const { data: session } = useSession()

  const { isFetched } = useQuery({
    queryKey: ['onboarding', 'pro', session?.user?.accessToken],
    queryFn: checkOnboardingv2,
    enabled: !!session?.user?.accessToken && session?.user?.role === 'PRO',
  })

  return isFetched ? <Content /> : <SpinnerFullScreen />
}

const Content = () => {
  const router = useRouter()
  const step = router?.query?.step as ISteps

  return (
    <>
      {step === 'basicInfo' && <BasicInfoV2 />}
      {step === 'businessDetail' && <BusinessDetailV2 />}
      {!['basicInfo', 'businessDetail'].includes(step) && <ProAccountSetup />}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  if (session?.user.role === 'CLIENT') {
    return {
      notFound: true,
      props: {},
    }
  }

  return { props: {} }
}

export default Index

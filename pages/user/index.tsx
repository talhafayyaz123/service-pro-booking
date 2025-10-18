import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { API_ONBOARDING, API_USER } from '@/core/consts/apiLinks'
import { getServerSideUrl } from '@/core/helpers/getUrlWithSearchParams'
import { updateMeSlice } from '@/features/userProfile/store/userProfileSlice'
import { UserProfile } from '@/features/userProfile/UserProfile'
import { useAppDispatch } from '@/hooks/hooks'
import BaseLayout from '@/layouts/BaseLayout'
import {
  setAccountSetup,
  setOnboardingData,
} from '@/store/accountSetup/accountSetupSlice'
import { universalInstance } from '@/store/instance'
import { IListedCheck, IOnboardingRequest } from '@/types/onboarding'

const Index = ({
  lested,
  onboarding,
}: {
  lested: null | IListedCheck
  onboarding: IOnboardingRequest
}) => {
  const dispatch = useAppDispatch()
  const { data } = useSession()

  useEffect(() => {
    if (onboarding) {
      dispatch(setOnboardingData(onboarding as IOnboardingRequest))
      dispatch(setAccountSetup({ onboardingStatus: false }))
    }

    if (lested?.steps) {
      dispatch(
        updateMeSlice({ listed: { steps: lested?.steps, status: false } })
      )
    }
  }, [data, dispatch, lested?.steps, onboarding])

  return (
    <BaseLayout seoTitle="My profile" seoDescription="User profile">
      <UserProfile />
    </BaseLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getToken(ctx)

  if (!session?.accessToken) {
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    }
  }

  if (session.role === 'CLIENT') {
    return {
      props: {},
    }
  }
  const instance = await universalInstance(ctx)
  try {
    const res = await instance.get<IOnboardingRequest>(
      getServerSideUrl(API_ONBOARDING.getAllOnboarding)
    )
    const { data } = await instance.get<IListedCheck>(
      getServerSideUrl(API_USER.listedCheck)
    )

    return {
      props: {
        lested: data,
        onboarding: res.data,
      },
    }
  } catch (e) {
    return {
      props: { lested: null, onboarding: null },
    }
  }
}

export default Index

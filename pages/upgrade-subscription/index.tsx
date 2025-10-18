import { Elements } from '@stripe/react-stripe-js'
import { StripeElementLocale } from '@stripe/stripe-js'
import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useLayoutEffect } from 'react'

import { getUserInfo } from '@/api/user/getUserInfo'
import { ROUTES } from '@/core/consts/routes'
import getStripe from '@/core/helpers/getStripe'
import { UpgradeSubscription } from '@/features/upgradeSubscription/UpgradeSubscription'
import { updateMeSlice } from '@/features/userProfile/store/userProfileSlice'
import { useAppDispatch } from '@/hooks/hooks'
import { changeBillingData } from '@/store/billingMethodsStore/billingMethodsSlice'
import {
  checkOnboarding,
  ICheckOnboardingResponse,
} from '@/store/me/meRequests'
import { setModal } from '@/store/modals/modalsSlice'

const stripePromise = getStripe()

const UpgradeSubscriptionPage = ({
  onboarding,
}: {
  onboarding: ICheckOnboardingResponse
}) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setModal({}))
  }, [dispatch])

  useLayoutEffect(() => {
    dispatch(updateMeSlice({ onboarding }))
  }, [dispatch, onboarding])

  useEffect(() => {
    dispatch(
      changeBillingData({
        globalErrorMessage: '',
      })
    )
  }, [dispatch])

  const { lang } = useTranslation()
  return (
    <Elements
      stripe={stripePromise}
      options={{
        locale: (lang || 'en') as StripeElementLocale,
      }}
    >
      <UpgradeSubscription />
    </Elements>
  )
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getToken(ctx)
  if (!session?.role) {
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    }
  }

  try {
    const onboarding = await checkOnboarding(ctx)
    const user = await getUserInfo(session.accessToken)

    if (user?.subscription?.type === 'ACTIVE') {
      return {
        redirect: {
          destination: ROUTES.user,
        },
        props: {},
      }
    }
    return {
      props: {
        onboarding: onboarding.data,
      },
    }
  } catch {
    return {
      props: {},
    }
  }
}

export default UpgradeSubscriptionPage

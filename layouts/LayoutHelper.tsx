import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

import { checkOnboardingv2 } from '@/api/onboarding'
import { ROUTES } from '@/core/consts/routes'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { handleSignOut } from '@/core/helpers/handleSignOut'
import { setMarkAboutProAccount } from '@/core/helpers/isHaveProAccountFlow'
import { steps } from '@/features/accountSetup/helpers/steps'
import { clear } from '@/features/searchHeader/store/searchHeaderSlice'
import { useSignUpStep } from '@/features/signUp/hooks/useSignUpStepper'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { meSelector } from '@/store/me/meSelector'

export const LayoutHelper = ({ children }: { children: ReactNode }) => {
  const { data, status } = useSession()
  const loading = status === 'loading'
  const dispatch = useAppDispatch()
  const me = useAppSelector(meSelector)
  const router = useRouter()
  const { setStep, isOtpStepped } = useSignUpStep()
  const pathname = router.pathname

  const {
    data: onboarding,
    isLoading,
    isFetched,
  } = useQuery({
    queryKey: ['onboarding', 'pro'],
    queryFn: checkOnboardingv2,
    enabled: data?.user?.role === 'PRO' && !!data?.user?.isVerified,
    refetchInterval({ state: { data } }) {
      if (data) {
        if (data.percentage !== 100) {
          return 5000
        } else {
          return false
        }
      }
    },
  })

  useEffect(() => {
    if (data?.user.role === 'PRO' && me.email) {
      setMarkAboutProAccount(me.email || '')
    }
  }, [data, data?.user.email, data?.user.role, me.email])

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (typeof window !== 'undefined') {
      if (data?.user && !data.error) {
        localStorage.setItem('data', JSON.stringify(data))
      } else {
        if (data?.error === 'refresh_error') {
          signOut()
          dispatch(clear())

          // helper function that consists of all functions that are should be called while signing out
          handleSignOut()
        }
        localStorage.removeItem('data')
      }
    }
  }, [data, dispatch, isLoading])

  // this effect only works when user is PRO
  useEffect(() => {
    // works if user is PRO and router is ready
    if (data?.user.role === 'PRO' && router.isReady) {
      // check for verified users
      if (data?.user.isVerified) {
        // if PRO user is coming from OTP first, then show him Welcome page
        if (
          isOtpStepped &&
          !pathname.includes(ROUTES.setup_pro) &&
          onboarding &&
          onboarding.percentage !== 100
        ) {
          router.replace(
            getUrlWithSearchParams(ROUTES.setup_pro, { step: steps.welcome })
          )

          // early return
          return
        }

        if (isFetched && onboarding && !pathname.includes(ROUTES.setup_pro)) {
          const steps = onboarding?.steps ?? {}
          let untouchedStep = ''

          Object.keys(steps).forEach((key) => {
            if (!untouchedStep) {
              const value = steps?.[key as keyof typeof steps]
              if (typeof value === 'boolean' && !value) {
                untouchedStep = key
              }
            }
          })

          if (untouchedStep) {
            router.replace(
              getUrlWithSearchParams(ROUTES.setup_pro, { step: untouchedStep })
            )
          }
        }
      } else {
        const path = {
          pathname: ROUTES.onboarding_professional,
        }

        if (!pathname.includes(ROUTES.onboarding_professional)) {
          setStep(3)
          router.replace(path, path)
        }
      }
    }
  }, [
    data?.user,
    onboarding,
    pathname,
    isFetched,
    router,
    setStep,
    isOtpStepped,
  ])

  if (isLoading || loading) {
    return <></>
  }

  return <>{children}</>
}

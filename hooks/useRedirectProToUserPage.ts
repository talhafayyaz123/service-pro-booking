import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { checkOnboardingv2 } from '@/api/onboarding'
import { ROUTES } from '@/core/consts/routes'

export const useRedirectProToUserPage = () => {
  const session = useSession()
  const router = useRouter()

  const { data: onboarding } = useQuery({
    queryKey: ['onboarding', 'pro', session?.data?.user?.accessToken],
    queryFn: checkOnboardingv2,
    enabled:
      !!session?.data?.user?.accessToken && session?.data?.user?.role === 'PRO',
  })

  useEffect(() => {
    const last = onboarding?.steps?.portfolio === true
    if (session.data?.user.role === 'PRO' && last) {
      router.replace(ROUTES.myProfile)
    } //eslint-disable-next-line
  }, [session.data?.user.role, onboarding])
}

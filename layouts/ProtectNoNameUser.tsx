import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect, useMemo } from 'react'

import { ROUTES } from '@/core/consts/routes'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'

export const ProtectNoNameUserLayout = () => {
  const { data } = useSession()
  const { replace, pathname } = useRouter()

  const fullName = useMemo(() => {
    if (typeof data?.user.firstName === 'string') {
      return (
        (data?.user.firstName || '')?.trim() +
        (data?.user.lastName || '')?.trim()
      )
    } else if (data?.user.name === 'null null') {
      return ''
    } else {
      return data?.user.name?.trim()
    }
  }, [data?.user.firstName, data?.user.lastName, data?.user.name])

  useEffect(() => {
    if (!data?.user || data?.user.role === 'PRO') {
      return
    } else if (stopRedirectFrom.includes(pathname)) {
      return
    } else if (!fullName) {
      if (data.user.role === 'CLIENT') {
        replace(
          getUrlWithSearchParams(ROUTES.onboarding_client, {
            validation: 'true',
          })
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.user, pathname, data?.user.role, fullName])

  return <></>
}

const stopRedirectFrom = [
  ROUTES.upgradeSubscription,
  ROUTES.privacyPolicy,
  ROUTES.termsAndConditions,
  ROUTES.cancellationPolicy,
  ROUTES.onboarding_client,
  '/mobile_login',
]

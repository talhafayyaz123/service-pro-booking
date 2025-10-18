import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { ROUTES } from '@/core/consts/routes'

const ReferralPage: NextPage = () => {
  const { data, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    if (status === 'authenticated') {
      router.replace('/')
    } else {
      const token = router.query.refToken
      router.replace({
        pathname: ROUTES.onboarding_professional,
        query: {
          refToken: token,
        },
      })
    }
  }, [status, data?.user.accessToken, router])

  return <></>
}

export default ReferralPage

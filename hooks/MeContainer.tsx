import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import { ROUTES } from '@/core/consts/routes'
import { useAppDispatch } from '@/hooks/hooks'
import { meRequest } from '@/store/me/meRequests'

interface Props {
  pathname: string
}

export const MeContainer = ({ pathname }: Props) => {
  const dispatch = useAppDispatch()
  const session = useSession()

  useEffect(() => {
    if (session.data?.user.role && pathname !== ROUTES.user) {
      dispatch(meRequest())
    }
  }, [dispatch, session.data?.user.role, pathname])
  return null
}

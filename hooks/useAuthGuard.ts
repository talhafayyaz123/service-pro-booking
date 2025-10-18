import { useSession } from 'next-auth/react'

import { MODALS_TYPE } from '@/core/consts/common'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const useAuthGuard = () => {
  const { data } = useSession()
  const dispatch = useAppDispatch()

  return (callback: () => void) => {
    if (!data?.user) {
      dispatch(setModal({ currentModal: MODALS_TYPE.SIGN_IN }))
    } else {
      callback()
    }
  }
}

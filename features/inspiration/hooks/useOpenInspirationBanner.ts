import { MODALS_TYPE } from '@/core/consts/common'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const useOpenInspirationBanner = () => {
  const dispatch = useAppDispatch()

  const openWait = () =>
    setTimeout(
      () =>
        dispatch(
          setModal({ currentModal: MODALS_TYPE.CONTINUE_IN_APP_BANNER })
        ),
      3000
    )
  const openPermanent = () =>
    dispatch(setModal({ currentModal: MODALS_TYPE.CONTINUE_IN_APP_BANNER }))

  return { openWait, openPermanent }
}

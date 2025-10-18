import { useRouter } from 'next/router'
import { memo, ReactNode, useMemo } from 'react'

import { IconCheck, IconErrorWarning } from '@/assets/icons/icons'
import { H14 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { getFormDataByIdSelector } from '@/features/customForm/store/selectors'
import { IFormsStatus } from '@/features/customForm/store/slice'
import { useAppSelector } from '@/hooks/hooks'

export const CustomFormStatus = memo(
  ({
    id,
    isAnswered,
  }: {
    id: string
    isRequiredForm: boolean
    isAnswered?: boolean
  }) => {
    const router = useRouter()
    const isViewBookingPage = router.pathname === ROUTES.bookings
    const _status = useAppSelector((state) =>
      getFormDataByIdSelector(state, id)
    )

    const status = useMemo((): IFormsStatus => {
      if (isViewBookingPage) {
        return getStatus(isAnswered)
      } else {
        return _status || 'notFilled'
      }
    }, [_status, isAnswered, isViewBookingPage])

    return <div>{text[status]}</div>
  }
)

const text: Record<IFormsStatus, ReactNode> = {
  error: (
    <div className={'flex items-center gap-1'}>
      <IconErrorWarning />
      <H14 className={'!text-[#EB001B]'}>Please fill the form first</H14>
    </div>
  ),
  completed: (
    <div className={'flex items-center gap-1'}>
      <IconCheck />
      <H14 className={'!text-completed'}>Complete</H14>
    </div>
  ),
  notFilled: (
    <div className={'flex'}>
      <H14 className={'!text-black'}>Not filled</H14>
    </div>
  ),
}

const getStatus = (isAnswered?: boolean) => {
  return isAnswered ? 'completed' : 'notFilled'
}

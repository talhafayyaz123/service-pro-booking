import { useCallback, useMemo } from 'react'

import { Switcher } from '@/components/common/Switcher'
import { H14 } from '@/components/typography'
import { proPlanSubscriptionSelector } from '@/features/userProfile/store/userProfileSelectors'
import { setProPlan } from '@/features/userProfile/store/userProfileSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

export const PlanSwitch = ({
  className,
  showSave = true,
  save = true,
}: {
  className?: string
  showSave?: boolean
  save?: boolean
}) => {
  const dispatch = useAppDispatch()
  const planSubs = useAppSelector(proPlanSubscriptionSelector)
  const setToggle = useCallback(() => {
    dispatch(setProPlan())
  }, [dispatch])

  const toggle = useMemo(() => planSubs === 'year', [planSubs])
  return (
    <div className={`flex flex-nowrap gap-2 items-center ${className}`}>
      <H14
        className="maxTablet:!text-[12px]"
        color={toggle ? 'text-gray' : 'text-black'}
      >
        Billed Monthly
      </H14>
      <Switcher checked={toggle} setChecked={setToggle} />
      <span className="h-fit">
        <H14
          className="maxTablet:!text-[12px] h-fit block"
          color={!toggle ? 'text-gray' : 'text-black'}
        >
          Billed Annually{' '}
        </H14>
        {save && (
          <H14
            color={'text-orange'}
            className={showSave ? '' : 'maxTablet:hidden'}
          >
            <span className={'text-black'}>·</span> save up to 25%
          </H14>
        )}
      </span>
    </div>
  )
}

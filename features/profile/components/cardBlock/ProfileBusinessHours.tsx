import { memo } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { H18, H28 } from '@/components/typography'
import { setFirstUpperCase } from '@/core/helpers/setFirstUpperCase'
import { formatTimeTo12 } from '@/features/accountSetup/helpers/sixOnSubmit'
import { profileBusinessHoursSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'
import { IDefaultWorkHours } from '@/types/onboarding'

export const ProfileBusinessHours = memo(() => {
  const hours = useAppSelector(profileBusinessHoursSelector)

  return (
    <div>
      <CardWrapper className="p-8 w-[400px]">
        <H28>Business hours</H28>
        <div className={'grid  gap-4 mt-8'}>
          {hours.map((args) => (
            <WorkHoursRow key={args.weekday} {...args} />
          ))}
        </div>
      </CardWrapper>
    </div>
  )
})

export const WorkHoursRow = ({
  days,
  weekday,
}: {
  days: IDefaultWorkHours[]
  weekday: string
}) => {
  return (
    <div
      className={'grid grid-cols-[40px_1fr] maxTablet:gap-[34px] gap-[60px]'}
    >
      <H18
        color={days.length === 0 ? 'text-gray' : 'text-orange'}
        className={'maxLaptop:!text-16'}
      >
        {setFirstUpperCase(weekday)}
      </H18>
      <div className={'grid'}>
        {days.length === 0 ? (
          <H18 color="text-gray">Day off </H18>
        ) : (
          <div className={'grid gap-0.5'}>
            {days.map(({ fromTime, toTime }, index) => (
              <div key={index} className="flex gap-1">
                <H18 className={'maxLaptop:!text-16'}>
                  {formatTimeTo12(fromTime)}{' '}
                </H18>
                <span>-</span>
                <H18 className={'maxLaptop:!text-16'}>
                  {' '}
                  {formatTimeTo12(toTime)}
                </H18>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

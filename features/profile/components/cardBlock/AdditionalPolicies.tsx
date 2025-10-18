import { memo } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { H16, H28 } from '@/components/typography'
import { profileAboutSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'

export const AdditionalPolicies = memo(() => {
  const { data } = useAppSelector(profileAboutSelector)

  return data.additionalPolicies ? (
    <CardWrapper className={'p-8'}>
      <H28 className={'maxSmall:text-20 maxSmall:leading-[24px]'}>
        Additional Policies
      </H28>
      <div className={'ml-4 mt-4'}>
        <div className={'flex flex-col'}>
          {data.additionalPolicies.split('\n').map((str, index) => (
            <H16 key={index} className={'small:!text-gray'}>
              {str}
            </H16>
          ))}
        </div>
      </div>
    </CardWrapper>
  ) : null
})

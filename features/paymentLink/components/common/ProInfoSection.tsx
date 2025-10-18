import moment from 'moment'
import { memo } from 'react'

import { H16, H24 } from '@/components/typography'
import { UserIconV2 } from '@/components/UserIconV2/UserIconV2'

interface IProps {
  businessName?: string
  date?: string
  iconUrl?: string
}
export const ProInfoSection = memo(
  ({ iconUrl, date, businessName }: IProps) => {
    return (
      <article
        className={
          'flex flex-col items-center mx-5 mb-6  tablet:mb-8 tablet:mt-8'
        }
      >
        <UserIconV2 className={'w-[80px] h-[80px]'} iconUrl={iconUrl} />
        <H24 className={'text-orange mt-4'}>{businessName ?? ''}</H24>
        <H16 data-testid={'pro-info-date'} className={'text-gray mt-0.5'}>
          {date ? moment(date).format('DD MMM YYYY [at] ha') : ''}
        </H16>
      </article>
    )
  }
)

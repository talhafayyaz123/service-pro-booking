import { useMemo } from 'react'

import { H20, H24 } from '@/components/typography'
import {
  PRO_PLAN_ANNUALLY_PRICE,
  PRO_PLAN_MONTHLY_PRICE,
} from '@/core/consts/prices'
import { formatPrice } from '@/core/helpers/formatPrice'

export const SubscriptionPrice = ({
  planSubs,
  v2,
}: {
  price?: number
  planSubs: string
  v2?: boolean
}) => {
  const price = useMemo(
    () =>
      planSubs === 'month' ? PRO_PLAN_MONTHLY_PRICE : PRO_PLAN_ANNUALLY_PRICE,
    [planSubs]
  )
  if (v2) {
    return <H20>{formatPrice({ price, currency: 'usd', onlySign: true })}</H20>
  }
  if (planSubs === 'month') {
    return (
      <H24>
        <span className={'maxTablet:hidden'}>Pro plan ·</span>{' '}
        <span className={'text-orange'}>
          {formatPrice({
            price,
            onlySign: true,
            currency: 'usd',
          })}
          /month
        </span>
      </H24>
    )
  } else {
    return (
      <H24>
        <span className={'maxTablet:hidden'}>Pro plan ·</span>{' '}
        <span className={'text-orange'}>
          {' '}
          {formatPrice({
            onlySign: true,
            currency: 'usd',
            price: price * 12,
          })}{' '}
        </span>{' '}
        or{' '}
        <span className={'text-orange'}>
          {formatPrice({
            price,
            onlySign: true,
            currency: 'usd',
          })}
          /month
        </span>
      </H24>
    )
  }
}

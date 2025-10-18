import { memo, ReactNode } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { H14, H16 } from '@/components/typography'
import { TBookingCorrectData } from '@/core/helpers/bookingCorrectData'
import { cn } from '@/core/helpers/cn'
import { formatPrice } from '@/core/helpers/formatPrice'

interface IProps {
  priceDetails?: { label: string; value: number }[]
  currency?: string
  totalPriceWithTips?: number
  renderDeposit?: () => ReactNode
  isCheckoutLink: boolean
  checkoutLinkData?: TBookingCorrectData
}
export const TransactionSection = memo((props: IProps) => {
  const {
    priceDetails,
    currency,
    totalPriceWithTips,
    renderDeposit,
    isCheckoutLink,
    checkoutLinkData,
  } = props

  let details = null
  if (isCheckoutLink) {
    details = (checkoutLinkData?.data ?? []).map((detail) => (
      <li className={'flex justify-between gap-5'} key={detail.text}>
        <H14 color={'text-black'} className="flex items-center gap-1">
          <span className="truncate w-full inline-block max-w-60">
            {detail.text}
          </span>{' '}
          {detail.additionalText && (
            <span
              className={cn(
                detail.additionalText.color === 'orange' && 'text-orange'
              )}
            >
              {detail.additionalText.text}
            </span>
          )}
        </H14>
        <H14 color={'text-black'} className="flex items-center gap-1">
          {detail.discountPrice && (
            <>
              <span className="text-gray">
                {formatPrice({
                  price: detail.price,
                  currency,
                })}
              </span>
              <span className="size-[2px] rounded-5 bg-gray" />
            </>
          )}
          {formatPrice({
            price: detail.price - (detail.discountPrice || 0),
            currency,
          })}
        </H14>
      </li>
    ))
  } else {
    details = (priceDetails ?? []).map((detail) => (
      <li className={'flex justify-between gap-5'} key={detail.label}>
        <H14 color={'text-black'} className="truncate">
          {detail.label}
        </H14>
        <H14 color={'text-black'}>
          {formatPrice({ price: detail.value, currency })}
        </H14>
      </li>
    ))
  }

  const paymentTotal = isCheckoutLink ? (
    <span className="flex items-center gap-2">
      <span className="text-gray line-through font-normal">
        {formatPrice({ price: checkoutLinkData?.payAmount, currency })}
      </span>
      <span>
        {formatPrice({
          price: checkoutLinkData?.payAmountWithDiscounts,
          currency,
        })}
      </span>
    </span>
  ) : (
    <>{formatPrice({ price: totalPriceWithTips, currency })}</>
  )

  return (
    <CardWrapper
      omitRole={true}
      className="mx-5 mt-3 !p-0 laptop:rounded-none laptop:shadow-none laptop:m-0"
    >
      <H16
        className={
          '!font-extrabold p-5 pb-4 border-b border-lightGray laptop:text-center laptop:pb-6 laptop:px-10'
        }
      >
        Transaction summary
      </H16>
      <ul
        className={
          'flex flex-col gap-4 p-5 py-4 border-b border-lightGray laptop:px-10 laptop:pt-6 laptop:pb-[62px]'
        }
      >
        {details}
      </ul>
      <div
        className={cn(
          'flex py-4 px-5  justify-between tablet:px-10 laptop:pt-6 laptop:pb-8',
          renderDeposit && '!pb-4'
        )}
      >
        <H16 className="font-semibold">Total</H16>
        <H16
          className={cn(
            'font-semibold text-orange',
            renderDeposit && '!font-bold'
          )}
        >
          {paymentTotal}
        </H16>
      </div>
      {renderDeposit && renderDeposit()}
    </CardWrapper>
  )
})

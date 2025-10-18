import Image from 'next/image'

import { ImgEmojiPresent, ImgWarning } from '@/assets/images/images'
import { Button } from '@/components/common/buttons/Button'
import { H16, H28 } from '@/components/typography'
import { cn } from '@/core/helpers/cn'
import { formatPrice } from '@/core/helpers/formatPrice'

import { IFailedStepProps } from '../type'

export const PLFailledStep = ({
  price,
  currency,
  error,
  handleTryAgain,
}: Partial<IFailedStepProps>) => {
  return (
    <div className={cn('flex flex-col gap-6 tablet:gap-8 items-center h-full')}>
      <div className="max-w-[244px] flex flex-col w-full items-center">
        <div className="ring-[3px] ring-white shadow-xl size-[60px] flex justify-center items-center bg-[#FDEDED] rounded-full">
          <Image src={ImgWarning} alt="" width={24} height={24} />
        </div>

        <H28 className="font-bold leading-[34px] mt-7 mb-3">Payment failed</H28>

        <H16 color="text-black" className="text-center">
          Amount due{' '}
          <span className="text-orange">
            {formatPrice({ price, currency })}
          </span>
        </H16>
      </div>

      <div>
        <div className="flex items-start gap-2.5 bg-yellow p-3 rounded-xl tablet:max-w-[335px]">
          <div className="size-[22px] shrink-0">
            <Image src={ImgEmojiPresent} alt="" />
          </div>
          <H16>
            Payment failed please try again or select another payment method.
          </H16>
        </div>
        {error && (
          <H16 className={'pt-2 text-center'} color={'text-cancelled'}>
            {error}
          </H16>
        )}
      </div>

      <Button
        onClick={handleTryAgain}
        buttonType="lightMain"
        className={cn('w-full mt-auto tablet:max-w-[335px]')}
      >
        Try again
      </Button>
    </div>
  )
}

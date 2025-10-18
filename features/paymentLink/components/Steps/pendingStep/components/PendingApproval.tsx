import Image from 'next/image'
import Link from 'next/link'

import { ImgAppleStore, ImgGooglePlay } from '@/assets/images/images'
import { H16, H18, H28, OrangeBlock } from '@/components/typography'
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/core/consts/common'
import { cn } from '@/core/helpers/cn'
import { formatPrice } from '@/core/helpers/formatPrice'
import { points } from '@/features/paymentLink/components/Steps/successStep/components/PLSuccessScreen'

export const PendingApproval = ({
  price,
  currency,
}: {
  price: number | string
  currency?: string
}) => {
  return (
    <section className={cn('flex flex-col items-center h-fit')}>
      <div className="mb-[42px] max-w-[244px] flex flex-col w-full items-center">
        <div className="ring-[3px] ring-white shadow-xl size-[60px] flex justify-center items-center bg-yellow rounded-full">
          <span className="text-[24px] block">⏱️</span>
        </div>

        <H28 className="font-bold leading-[34px] mt-7 mb-3">
          Pending Approval
        </H28>

        <H16 color="text-black" className="text-center">
          Amount due{' '}
          <span className={'text-orange'}>
            {formatPrice({ price, currency })}
          </span>
        </H16>
      </div>
      <OrangeBlock>
        Awaiting confirmation from the service provider. You will be notified
        once confirmed
      </OrangeBlock>
      <div className="p-5 flex flex-col rounded-xl shadow-xl w-full  mt-8">
        <H18 className="!font-bold text-center mb-6">
          Download the <span className="text-orange">Readyhubb</span> app!
        </H18>

        <div className="flex flex-col gap-4">
          {points.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="shadow-roundPoint shrink-0 ring-[3px] ring-white rounded-full">
                <div
                  className={cn(
                    'size-[42px] flex justify-center items-center rounded-full',
                    item.style
                  )}
                >
                  {item.icon}
                </div>
              </div>
              <H16>{item.text}</H16>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 mt-6 justify-center">
          <Link href={APP_STORE_URL} target={'_blank'}>
            <Image
              src={ImgAppleStore}
              width={149}
              height={46}
              alt="Download app from Apple store"
            />
          </Link>
          <Link href={GOOGLE_PLAY_URL} target={'_blank'}>
            <Image
              src={ImgGooglePlay}
              width={149}
              height={46}
              alt="Download app from Google play"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

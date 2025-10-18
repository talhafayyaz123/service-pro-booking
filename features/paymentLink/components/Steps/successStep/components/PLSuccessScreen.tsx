import classNames from 'classnames'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'

import {
  IconCalendar,
  IconCheckmark,
  IconMagnifierEmoji,
  IconStarEmoji,
} from '@/assets/icons/icons'
import { ImgAppleStore, ImgGooglePlay } from '@/assets/images/images'
import { H16, H18, H28 } from '@/components/typography'
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/core/consts/common'
import { cn } from '@/core/helpers/cn'
import { formatPrice } from '@/core/helpers/formatPrice'

interface ISuccessStepProps {
  price: number | string
  proName: string
  currency?: string
  date: number
}

export const PLSuccessScreen = ({
  price,
  proName,
  currency,
  date,
}: ISuccessStepProps) => {
  const parsedDate = moment(date).format('MMM D, YYYY [at] h:mm A')

  return (
    <div className={cn('flex flex-col items-center h-fit')}>
      <div className="mb-[42px] max-w-[244px] flex flex-col w-full items-center">
        <div className="ring-[3px] ring-white shadow-xl size-[60px] flex justify-center items-center bg-[#EDFDF5] rounded-full">
          <IconCheckmark />
        </div>

        <H28 className="font-bold leading-[34px] mt-7 mb-3">
          You paid {formatPrice({ price, currency })}
        </H28>

        <H16 color="text-gray" className="text-center">
          You have sent a payment to{' '}
          <span className="font-semibold">{proName}</span> on {parsedDate}
        </H16>
      </div>
      <DownloadPoints
        className={
          'p-5 flex flex-col rounded-xl shadow-xl w-full max-w-[524px]'
        }
      />
    </div>
  )
}

export const DownloadPoints = ({ className }: { className?: string }) => {
  return (
    <article className={classNames(className)}>
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

      <div className="flex items-center justify-center gap-1 mt-6">
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
    </article>
  )
}

export const points = [
  {
    icon: <IconMagnifierEmoji />,
    text: 'Discover thousands of beauty professionals',
    style: 'bg-[#EBEBEB] shadow-[0px_0px_9.33px_0px_#D8A099_inset]',
  },
  {
    icon: <IconCalendar />,
    text: 'Book services and manage your appointments',
    style: 'bg-[#FFE8E2]',
  },
  {
    icon: <IconStarEmoji />,
    text: 'Find inspiration and follow your favorite professionals',
    style: 'bg-[#FFEBCE] shadow-[0px_0px_9.33px_0px_#F5D4A4_inset]',
  },
]

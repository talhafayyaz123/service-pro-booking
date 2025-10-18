import moment from 'moment'
import Image from 'next/image'

import { ImgProUser } from '@/assets/images/images'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { UserIcon } from '@/components/cardElements/UserIcon'
import { BookingCardStatus } from '@/components/cards/bookingCard/BookingCardStatus'
import { BasicSkeleton } from '@/components/common/skeletons/BasicSkeleton'
import { H16, H18 } from '@/components/typography'
import { formatPrice } from '@/core/helpers/formatPrice'
import { setDurationTime } from '@/core/helpers/setDurationTime'
import { IBookingCard } from '@/types/booking'

export const BookingCard = (props: IBookingCard) => {
  const {
    proName,
    iconUrl = '',
    cardStatus,
    services,
    className,
    totalPrice,
    date,
    startTime,
    currencySign,
    footerNode,
    addons,
    totalDuration,
    addonsDuration,
  } = props

  return (
    <CardWrapper
      className={`px-4 pt-5 pb-[18px] tablet:px-6 text-start ${className}`}
    >
      <div className="flex justify-between pb-4 border-b border-lightGray tablet:pb-5">
        <div className="flex flex-col">
          <H18 className="maxTablet:!text-14 maxTablet:leading-[20px]">
            {moment(date).format('D MMMM yyyy ')} {startTime}
          </H18>
          <div className="flex items-center gap-[10px] mt-1.5 tablet:mt-2">
            {iconUrl ? (
              <UserIcon size="24" iconUrl={iconUrl} />
            ) : (
              <div
                className={
                  'w-6 h-6  rounded-full overflow-hidden p-1 bg-[#EDDFFF]'
                }
              >
                <Image alt={'alt pro icon'} src={ImgProUser} />
              </div>
            )}
            <H16
              className="maxTablet:!text-14 maxTablet:leading-[20px]"
              color="text-gray"
            >
              {proName}
            </H16>
          </div>
        </div>
        <BookingCardStatus status={cardStatus} />
      </div>
      <div className="flex flex-col gap-3 py-5 border-b border-lightGray">
        {services.map(({ name, id, duration }) => (
          <div key={id}>
            <div className="flex justify-between gap-2">
              <H16 className="maxTablet:!text-14 maxTablet:leading-[20px]">
                {name}
              </H16>

              <H18
                className="maxTablet:!text-14 maxTablet:leading-[20px]"
                color="text-gray"
              >
                {setDurationTime(duration)}

                {/*{setDurationTime(duration)}*/}
              </H18>
            </div>
          </div>
        ))}
        {(addons?.length || 0) > 0 && (
          <div className={'flex justify-between'}>
            <H16 className="maxTablet:!text-14 maxTablet:leading-[20px]">
              Addons
            </H16>
            <H18
              className="maxTablet:!text-14 maxTablet:leading-[20px]"
              color="text-gray"
            >
              {setDurationTime(addonsDuration || 0)}
            </H18>
          </div>
        )}
      </div>

      <div className={'flex justify-between py-5 border-b border-lightGray'}>
        <H18>Duration</H18>
        <H18 className="maxTablet:!text-14 maxTablet:leading-[20px]">
          {getDate(date)} -{' '}
          {getDate(
            moment(date)
              .add('minutes', totalDuration || 0)
              .toISOString()
          )}
        </H18>
      </div>

      <div className="flex justify-between mt-4">
        <H18>Total</H18>
        <H16 color="text-orange" className="!font-bold">
          {formatPrice({ currency: currencySign, price: totalPrice })}
        </H16>
      </div>
      {footerNode ? footerNode : null}
    </CardWrapper>
  )
}

export const BookingCardSkeleton = () => {
  return (
    <CardWrapper
      className={`px-4 pt-5 pb-4.5 tablet:px-6 tablet:py-4 text-start`}
    >
      <div className="flex justify-between pb-4 border-b border-lightGray tablet:pb-5">
        <div className="flex flex-col">
          <BasicSkeleton width={210} height={20} />
          <div className="flex items-center gap-2.5 mt-1.5 tablet:mt-2">
            <BasicSkeleton width={24} height={24} rounded="100%" />
            <BasicSkeleton width={120} height={20} />
          </div>
        </div>
        <BasicSkeleton width={80} height={32} rounded={6} />
      </div>
      <div className="flex flex-col gap-3 py-5 border-b border-lightGray">
        <div className="flex justify-between">
          <BasicSkeleton width={130} height={22} />
          <BasicSkeleton width={90} height={22} />
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <BasicSkeleton width={50} height={24} />
        <BasicSkeleton width={80} height={24} />
      </div>
    </CardWrapper>
  )
}

const getDate = (date?: string) => {
  const minutes = moment(date).get('minutes')
  if (minutes !== 0) {
    return moment(date).format(`h:mma`)
  } else {
    return moment(date).format(`ha`)
  }
}

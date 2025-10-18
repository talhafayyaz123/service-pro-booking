import { useRef } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Checkbox } from '@/components/common/Checkbox'
import { ShowMore } from '@/components/common/showMoreText/ShowMoreText'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { H12, H16 } from '@/components/typography'
import { formatPrice } from '@/core/helpers/formatPrice'
import { setDurationTime } from '@/core/helpers/setDurationTime'
import { IAddOn } from '@/features/booking/store/bookingStore'

export const AddonCard = ({
  id,
  price,
  duration,
  title,
  isActive,
  description,
  onClick,
}: IAddOn & {
  isActive: boolean
  onClick: (id: string) => void
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <CardWrapper
      onClick={(e) => {
        if (!ref.current?.contains(e.target as any)) {
          onClick?.(id)
        }
      }}
      className={'!p-4 flex flex-col gap-2 cursor-pointer rounded-[16px] h-fit'}
    >
      <div className={'grid grid-cols-[auto_1fr_auto] gap-2 items-center'}>
        <Checkbox checked={isActive} />
        <H16 className={'mr-2'}>{title}</H16>
        <H12 color={'text-black'}>{formatPrice({ price })}</H12>
      </div>
      <div className={'ml-7'}>
        <H12>+{setDurationTime(duration)}</H12>
      </div>
      <div ref={ref}>
        <ShowMore className={'text-16 leading-[22px] '} lines={2}>
          {description}
        </ShowMore>
      </div>
    </CardWrapper>
  )
}

export const AddonCardSkeleton = () => {
  return (
    <CardWrapper
      className={
        '!p-4 min-h-[86px] flex flex-col gap-2 cursor-pointer rounded-[16px]'
      }
    >
      <div className={'grid grid-cols-[auto_1fr_auto] gap-3 items-center'}>
        <BaseSkeleton className={'!w-6'} />
        <BaseSkeleton className={'!h-4 !w-14'} />

        <BaseSkeleton className={'!h-3 !w-10'} />
      </div>
      <div className={'ml-7'}>
        <BaseSkeleton className={'!h-3 '} />
      </div>
    </CardWrapper>
  )
}

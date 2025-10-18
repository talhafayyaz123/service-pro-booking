import { IconPin } from '@/assets/icons/icons'
import { BaseLink } from '@/components/common/links/BaseLink'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { H14 } from '@/components/typography'
import { formatDistance } from '@/core/helpers/formatDistance'

type TDistanceSize = '14' | '16'

export const Distance = ({
  distance,
  status,
  dot = true,
  className,
  onClick,
  country,
  distanceStyle,
}: {
  distance?: number
  className?: string
  status?: boolean
  dot?: boolean
  country?: string
  size?: TDistanceSize
  onClick?: () => void
  distanceStyle?: string
}) => {
  return (
    <div className={`${className}`}>
      {status ? (
        <div className={'flex gap-[10px]'}>
          <BaseSkeleton className={'!w-[150px]'} />
          <span className={'text-black'}>·</span>
          <BaseSkeleton className={'!w-[100px]'} />
        </div>
      ) : distance && distance > 0 ? (
        <div className={'flex items-center flex-shrink-0 gap-x-2 truncate'}>
          <IconPin
            width={10}
            height={16}
            viewBox="0 0 12 20"
            className={'fill-orange flex-shrink-0 '}
          />
          <H14
            color={'text-gray'}
            className={`${distanceStyle} truncate tablet:leading-[22px]`}
          >
            {formatDistance(distance as number, country)} from you
          </H14>
          {dot && <span className={'text-black'}>·</span>}
          {onClick && (
            <BaseLink
              className={'!font-normal maxSmall:!text-[14px]'}
              size={'200'}
              line={false}
              onClick={onClick}
              type="button"
            >
              Show on Map
            </BaseLink>
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  )
}

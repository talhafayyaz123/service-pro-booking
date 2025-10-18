import { ReactNode } from 'react'

import { IconCloseBlack } from '@/assets/icons/icons'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { ShowMore } from '@/components/common/showMoreText/ShowMoreText'
import { BasicSkeleton } from '@/components/common/skeletons/BasicSkeleton'
import { H14, H18 } from '@/components/typography'
import { formatPrice } from '@/core/helpers/formatPrice'
import { setDurationTime } from '@/core/helpers/setDurationTime'
import { IService } from '@/types/categoriesTypes'

interface IServiceInfoProps extends IService {
  button: ReactNode
  className?: string
  middleInfo?: ReactNode
  showMoreClassName?: string
  currencySign: string
  dontShowTax?: boolean
}

export const ServiceInfo = ({
  button,
  className,
  middleInfo,
  isMobile,
  showMoreClassName,
  currencySign,
  taxPrice,
  dontShowTax,
  ...props
}: IServiceInfoProps) => {
  const serviceType = isMobile ? 'Mobile' : ''
  return (
    <CardWrapper className={`p-5 ${className}`}>
      <div className={'flex items-center justify-between'}>
        <H18 className={'maxTablet:text-16 maxTablet:leading-[18px]'}>
          {props.name}
        </H18>
        <div className={'w-fit'}>{button}</div>
      </div>
      {middleInfo ?? (
        <div className="mt-2">
          <span className="tablet:text-gray">
            {' '}
            {setDurationTime(props.duration)}{' '}
          </span>
          <span className="text-gray"> · </span>
          {formatPrice({ price: props.price, currency: currencySign })}{' '}
          {serviceType ? (
            <>
              <span className="text-gray"> · </span>
              {serviceType}
            </>
          ) : (
            ''
          )}
        </div>
      )}
      {taxPrice && !dontShowTax ? (
        <H14 className="!block mt-0.5">
          Tax:{' '}
          <span className="text-black">
            {formatPrice({ price: taxPrice, currency: currencySign })}{' '}
          </span>
        </H14>
      ) : null}
      {/*{props.extraTime ? (*/}
      {/*  <H14 className="!block mt-0.5">*/}
      {/*    Extra time:{' '}*/}
      {/*    <span className="text-black">{setDurationTime(props.extraTime)}</span>*/}
      {/*  </H14>*/}
      {/*) : null}*/}
      {props.description && (
        <ShowMore
          className={`text-gray text-14 leading-[18px] mt-3  w-[85%] ${showMoreClassName}`}
          lines={2}
        >
          {props.description}
        </ShowMore>
      )}
    </CardWrapper>
  )
}

export const DeleteServiceButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className="p-2 border rounded-full cursor-pointer border-lightGray w-fit"
      role={'button'}
      onClick={onClick}
    >
      <IconCloseBlack width="10" className={'!stroke-black'} />
    </div>
  )
}

export const ServiceInfoSkeleton = ({
  className,
  button,
}: {
  className?: string
  button?: ReactNode
}) => {
  return (
    <CardWrapper className={`p-5 ${className}`}>
      <div className={'flex items-center justify-between mb-5'}>
        <BasicSkeleton width={120} height={24} />
        {button ?? <BasicSkeleton width={80} height={42} />}
      </div>
      <BasicSkeleton width={200} height={16} />
      <BasicSkeleton width={300} height={16} className="mt-1" />
      <BasicSkeleton width={300} height={16} className="mt-2" />
    </CardWrapper>
  )
}

import { ReactNode } from 'react'

import { IconStarLarge, IconStarRegular } from '@/assets/icons/icons'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { H16 } from '@/components/typography'

export const Rating = ({
  rating,
  status,
  className,
  textClassName,
  starIcon,
  largeStar,
}: {
  rating?: number
  status?: boolean
  className?: string
  textClassName?: string
  starIcon?: ReactNode
  largeStar?: boolean
}) => {
  return (
    <>
      {status ? (
        <div
          className={`py-[11px] px-4 flex items-center justify-center h-fit  bg-white shadow-xl rounded-[20px] ${className}`}
        >
          <BaseSkeleton className={'!w-[50px] !h-[22px]'} />
        </div>
      ) : (
        <>
          {typeof rating === 'undefined' || rating === 0 ? (
            <></>
          ) : rating > 0 ? (
            <div
              className={`py-[11px] px-4 flex items-center justify-center h-fit bg-white shadow-xl rounded-[20px] ${className}`}
            >
              <div className={'flex items-center gap-[6px] justify-center'}>
                {starIcon ?? largeStar ? (
                  <IconStarLarge />
                ) : (
                  <IconStarRegular />
                )}

                <H16 className={`!font-bold ${textClassName}`}>
                  {(rating || 0).toFixed(1)}
                </H16>
              </div>
            </div>
          ) : null}
        </>
      )}
    </>
  )
}

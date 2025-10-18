import { ReactNode, useMemo } from 'react'

import { IconStart } from '@/assets/icons/icons'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { H14, H18, H38, H40 } from '@/components/typography'
import { profileRatingSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'

export const ProfileReviewsCard = () => {
  const { data } = useAppSelector(profileRatingSelector)

  return (
    <CardWrapper className="py-7 px-8 h-fit w-full tablet:max-w-[400px]">
      <div className="flex pb-6 border-b gap-7 border-lightGray">
        <H40 className="!font-bold">{data.total}</H40>
        <div>
          <div className="flex gap-[11px] mb-2 pt-1">
            {data.stars.map(({ star }) => (
              <IconStart
                height="28"
                width="28"
                className={'fill-orange'}
                key={star}
              />
            ))}
          </div>
          <H14>based on {data.reviewCount} reviews</H14>
        </div>
      </div>
      <div className={'flex flex-col gap-4 mt-4  '}>
        {data.stars.map(({ star, rating }, index) => (
          <ReviewLine
            key={index}
            star={star}
            count={rating}
            allCount={data.reviewCount}
          />
        ))}
      </div>
    </CardWrapper>
  )
}

export const ProfileReviewsCardMobile = () => {
  const { data } = useAppSelector(profileRatingSelector)

  return (
    <CardWrapper
      className={'  py-[28px] px-[26px] h-fit w-full tablet:max-w-[400px]'}
    >
      <div className={'grid grid-cols-2 gap-[1px] bg-lightGray'}>
        <div className={'bg-white'}>
          <div
            className={
              'flex bg-white flex-col items-center justify-center h-full  border-r border-lightGray pr-[26px]'
            }
          >
            <H38 className={'!font-bold leading-[44px]'}>{data.total}</H38>
            <div>
              <div className={'flex gap-[6px] mb-2 pt-1'}>
                {data.stars.map(({ star }) => (
                  <IconStart
                    height="20"
                    width="20"
                    className={'fill-orange'}
                    key={star}
                  />
                ))}
              </div>
            </div>
            <H14 className={'mx-auto'}>based on {data.reviewCount} reviews</H14>
          </div>
        </div>
        <div className={'flex flex-col gap-[6px] pl-[26px]  bg-white'}>
          {data.stars.map(({ star, rating }) => (
            <ReviewLine
              starIcon={
                <IconStart
                  height="14"
                  width="14"
                  viewBox="0 0 20 20"
                  className={'fill-orange mt-[3px]'}
                />
              }
              key={star}
              star={star}
              count={rating}
              allCount={data.reviewCount}
            />
          ))}
        </div>
      </div>
    </CardWrapper>
  )
}

const ReviewLine = ({
  star,
  count,
  allCount,
  starIcon,
}: {
  star: number
  count: number
  allCount: number
  starIcon?: ReactNode
}) => {
  const percent = useMemo(
    () =>
      allCount === 0
        ? '0%'
        : count / allCount === 0
        ? '0%'
        : `${Math.floor((count / allCount) * 100)}%`,
    [allCount, count]
  )

  return (
    <>
      {percent && (
        <div className={'flex gap-3 items-center w-full'}>
          <div className={'grid grid-cols-2 flex-shrink-0 laptop:gap-1'}>
            <H18>{star}</H18>
            {starIcon ?? <IconStart className={'fill-orange '} />}
          </div>
          <div className={'h-1 w-full  bg-lightGray rounded-[3px]'}>
            <div
              style={{ width: percent }}
              className={`h-full  bg-orange rounded-[3px]`}
            />
          </div>
          <H18>{count}</H18>
        </div>
      )}
    </>
  )
}

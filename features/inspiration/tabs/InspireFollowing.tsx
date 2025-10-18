import { H28 } from '@/components/typography'
import { useOpenInspirationBanner } from '@/features/inspiration/hooks/useOpenInspirationBanner'
import { InspirationFollowingCard } from '@/features/inspiration/InspirationFollowingCard'
import { useGetInspirationsFollowingQuery } from '@/store/commonStor/inspirations/inspirationsRequests'

export const InspireFollowing = () => {
  const { openPermanent } = useOpenInspirationBanner()

  const { isFetching, data } = useGetInspirationsFollowingQuery({
    isFavorite: true,
    page: 1,
  })

  return (
    <>
      {isFetching ? (
        <div className={className}>
          {[1, 2, 3, 4, 5, 6].map((e) => (
            <div
              key={e}
              className={`h-[342px] h-full max-w-[335px] rounded-[12px] shadow-xl w-full tablet:h tablet:max-w-[400px] laptop:h-[465px] mx-auto bg-lightGray animate-pulse`}
            ></div>
          ))}
        </div>
      ) : data?.data.length ? (
        <div className={className}>
          {data?.data.map((el) => (
            <div className={'relative'} key={el.id}>
              <div
                role={'none'}
                className={'absolute w-full h-full z-10 '}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openPermanent()
                }}
              />
              <InspirationFollowingCard
                className={`h-[342px] max-w-[335px]  tablet:h tablet:max-w-[400px] laptop:h-[465px] mx-auto`}
                {...el}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={'flex h-full max-w-full min-h-[100px] items-center'}>
          <H28 className={'mx-auto'}>You are not following any pros</H28>
        </div>
      )}
    </>
  )
}
const className =
  'grid my-[24px] justify-between laptop:mt-[60px] laptop:mb-[120px]  grid-cols-1 tablet:grid-cols-2  laptop:grid-cols-2  desktop:grid-cols-3 gap-[12px] tablet:gap-[40px]'

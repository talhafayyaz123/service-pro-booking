import { H28 } from '@/components/typography'
import { InspirationCard } from '@/features/homePage/inspiration/InspirationCard'
import { useOpenInspirationBanner } from '@/features/inspiration/hooks/useOpenInspirationBanner'
import { IInspirationCard } from '@/types/instiprationTypes'

export const ForYouGridBlock = ({
  data,
  status,
  className,
}: {
  data: IInspirationCard[]
  status: boolean
  className?: string
}) => {
  const { openPermanent } = useOpenInspirationBanner()
  return (
    <>
      {data.length !== 0 ? (
        <div
          className={`grid my-[24px] laptop:mt-[60px] laptop:mb-[120px] grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-3 desktop:grid-cols-4 gap-[10px] tablet:gap-[40px] ${className}`}
        >
          {data.map((el) => {
            return (
              <InspirationCard
                imageSize={{
                  mobile: { height: 360, width: 210 },
                  laptop: { height: 600, width: 400 },
                  desktop: { height: 600, width: 450 },
                }}
                disabledLike
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openPermanent()
                }}
                descriptionClassName={
                  '!text-[18px] !font-normal max-w-[170px] mb-[10px]'
                }
                isLoading={status}
                spacingClassName={'maxLaptop:!p-[14px] !p-[24]'}
                className={`h-[260px] max-w-[162px] small:h-[300px] small:max-w-[210px] tablet:h-[300px] tablet:max-w-[290px] laptop:h-[370px] mx-auto`}
                key={el.id}
                {...el}
              />
            )
          })}
        </div>
      ) : (
        <div className={'flex h-full max-w-full min-h-[100px] items-center'}>
          <H28 className={'mx-auto'}>
            No inspiration posts saved yet - find pros and save posts you love
          </H28>
        </div>
      )}
    </>
  )
}

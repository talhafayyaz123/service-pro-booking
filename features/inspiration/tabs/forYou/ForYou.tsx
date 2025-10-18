import { Fragment } from 'react'

import { ChipBase, IChipProps } from '@/components/Chip/ChipBase'
import { H18 } from '@/components/typography'
import { hexToRGBA } from '@/core/helpers/hexToRGBA'
import { useOpenInspirationBanner } from '@/features/inspiration/hooks/useOpenInspirationBanner'
import { ForYouGridBlock } from '@/features/inspiration/tabs/forYou/ForYouGridBlock'
import { useAppSelector } from '@/hooks/hooks'
import { mainCategoriesSelector } from '@/store/accountSetup/accountSetupSelectors'
import { useGetInspirationsQuery } from '@/store/commonStor/inspirations/inspirationsRequests'
import { inspirationForYouFilterSelector } from '@/store/commonStor/inspirations/inspirationsSelectors'

export const ForYou = ({
  showCatagories = true,
}: {
  showCatagories?: boolean
}) => {
  const { categories } = useAppSelector(mainCategoriesSelector)
  const { categoryId, limit } = useAppSelector(inspirationForYouFilterSelector)
  const { openPermanent } = useOpenInspirationBanner()

  const { isFetching, data } = useGetInspirationsQuery({
    page: 1,
    categoryId,
    limit,
  })
  return (
    <>
      {showCatagories && (
        <div
          className={
            ' flex laptop:pl-[16px] laptop:ml-[-16px] mb-[60px]  laptop:pr-[16px] laptop:mr-[-16px] gap-[8px] z-10 relative laptop:gap-[20px] py-[20px] mt-[32px] overflow-x-auto scrollbar-none'
          }
        >
          {categories.map(({ id, ...el }) => {
            const active = categoryId.includes(id)
            return (
              <Fragment key={id}>
                <div className={'laptop:hidden'}>
                  <ChipBase
                    {...el}
                    id={id}
                    onClick={openPermanent}
                    active={active}
                  />
                </div>
                <div className={'hidden laptop:block relative'}>
                  <ChipWithIcon
                    {...el}
                    id={id}
                    onClick={openPermanent}
                    active={active}
                  />
                </div>
              </Fragment>
            )
          })}
        </div>
      )}
      <ForYouGridBlock data={data?.data || []} status={isFetching} />
    </>
  )
}

export const ChipWithIcon = ({
  name,
  iconUrl,
  active,
  color,
  onClick,
}: IChipProps) => {
  return (
    <div
      role={'button'}
      onClick={onClick}
      className={`py-[9px] select-none px-5 gap-x-[10px] border   whitespace-nowrap   shadow-xl flex items-center  rounded-[12px] w-fit ${
        active ? 'border-orange' : 'border-white'
      }`}
    >
      <div className={'shadow-iconChip rounded-full'}>
        <div
          style={{
            backgroundColor: hexToRGBA(color, 0.6),
            boxShadow: `0px 4px 27px rgba(182, 190, 206, 0.3), inset 0px 0px 12px ${color}`,
          }}
          className={
            'flex items-center border border-white  flex-shrink-0 w-fit justify-center p-[8.5px] rounded-full'
          }
        >
          <img
            className={'min-w-[15px] max-w-[15px] min-h-[15px] max-h-[15px]'}
            src={iconUrl as string}
            alt=""
          />
        </div>
      </div>
      <H18 className={` !leading-normal ${active ? '!text-orange' : ''}`}>
        {name}
      </H18>
    </div>
  )
}

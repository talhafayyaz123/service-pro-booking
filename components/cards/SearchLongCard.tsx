import Image from 'next/image'
import { useRouter } from 'next/router'
import { HTMLAttributeAnchorTarget } from 'react'

import { IconPin, IconStar14, IconStart } from '@/assets/icons/icons'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { CategoryIcon } from '@/components/common/CategoryCard'
import { H14, H20 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { fixInteger } from '@/core/helpers/fixInteger'
import { formatDistance } from '@/core/helpers/formatDistance'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { ICategory } from '@/types/categoriesTypes'

// import { ChipBase } from '../Chip/ChipBase'

export interface ICardData {
  id: string
  name: string
  iconUrl: string
  categories: ICategory[]
  className?: string
  address: string
  latitude: number | null
  isFollowing: boolean
  longitude: number | null
  rating: number
  distance: number
  photos: string[]
  country?: string
  slug: string
  payInBnpl?: boolean
  target?: HTMLAttributeAnchorTarget
}

export const SearchLongCard = ({
  categories,
  name,
  rating,
  address,
  photos,
  country,
  // payInBnpl,
  slug,
  id,
  ...rest
}: ICardData) => {
  const router = useRouter()
  const redirectFrom = getUrlWithSearchParams(router.pathname, router.query)
  return (
    <a
      href={getUrlWithSearchParams(ROUTES.profile(slug || id), {
        redirectFrom,
      })}
      target={'_blank'}
      className="block"
      rel="noreferrer"
    >
      <CardWrapper
        className={
          'p-4 flex maxTablet:gap-[14px] gap-[34px] items-center w-full overflow-hidden laptop:flex-row flex-col'
        }
      >
        {photos[0] ? (
          <div
            style={{ transform: 'translateZ(0)' }}
            className={
              'h-[146px] w-full rounded-2xl overflow-hidden flex items-center justify-center'
            }
          >
            <Image
              alt={'not found'}
              className={'border border-white bg-white'}
              width={336}
              layout={'fixed'}
              objectFit={'cover'}
              height={146}
              src={photos[0]}
            />
          </div>
        ) : null}
        {/*<div*/}
        {/*  className={`border w-[204px] h-[146px] bg-cover bg-center flex-shrink-0 overflow-hidden  border-white bg-white rounded-2xl`}*/}
        {/*  style={{*/}
        {/*    backgroundImage: photos?.length ? `url(${photos[0]})` : undefined,*/}
        {/*  }}*/}
        {/*/>*/}
        <div className={'w-full'}>
          <div className={'flex justify-between maxTablet:mb-[2px] mb-2'}>
            <H20
              className={
                'maxTablet:!text-[16px] maxTablet:!leading-[22px] line-clamp-2'
              }
            >
              {name}
            </H20>
            {+rating > 0 ? (
              <div className={' maxTablet:hidden flex items-center gap-2'}>
                <IconStart className={'fill-orange block'} />
                <H20 className="mb-0.5">{fixInteger(rating).toFixed(1)}</H20>
              </div>
            ) : null}
          </div>
          <H14 className={'line-clamp-2'}>{address}</H14>
          <div className="flex items-center gap-2.5  maxTablet:gap-2 truncate  mt-3 maxTablet:mt-2 flex-shrink-0 overflow-hidden">
            {+rating > 0 ? (
              <div className={' tablet:hidden flex items-center gap-2 mr-1'}>
                <IconStar14 className={'fill-orange  mt-[-3px]'} />
                <H14 color={'text-black'}>{fixInteger(rating).toFixed(1)}</H14>
              </div>
            ) : null}
            {rest.distance > 0 ? (
              <>
                <IconPin className={'fill-orange flex-shrink-0'} />
                <H14 className={'truncate'}>
                  {formatDistance(rest.distance, country)} from you
                </H14>
              </>
            ) : null}
          </div>

          <div className={'maxTablet:hidden flex flex-wrap gap-4 mt-3'}>
            {categories?.map((el) => (
              <CategoryChip {...el} key={el.id} />
            ))}
            {/* {payInBnpl && (
              <ChipBase
                textClassName={'!text-black'}
                name={'Buy now, Pay later'}
                rightIcon={<IconMoney />}
                className="border-orange2 !py-1"
              />
            )} */}
          </div>
        </div>
      </CardWrapper>
    </a>
  )
}

const CategoryChip = (props: ICategory) => {
  return (
    <div className={'flex items-center gap-[6px]'}>
      <CategoryIcon size={'20'} {...props} />
      <H14>{props.name}</H14>
    </div>
  )
}

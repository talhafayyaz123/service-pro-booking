import Image from 'next/image'
import { useRouter } from 'next/router'

import { IconPin, IconStarRegular } from '@/assets/icons/icons'
import { ImgProUser } from '@/assets/images/images'
import { CategoryWithIcon } from '@/components/Chip/CategoryWithIcon'
import { H14, H16, H20 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { fixInteger } from '@/core/helpers/fixInteger'
import { formatDistance } from '@/core/helpers/formatDistance'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { IProfileInfo } from '@/types/profileInfoTypes'

// import { ChipBase } from '../Chip/ChipBase'

export const TopRateCard = ({
  className,
  photos,
  iconUrl,
  name,
  distance,
  country,
  slug,
  id,
  categories,
  categoryWithIcon,
  ...props
}: IProfileInfo & {
  className?: string
}) => {
  return (
    <a
      href={ROUTES.profile(slug || id)}
      draggable={false}
      // className={` mb-6  !h-full  mt-4  w-[288px] flex flex-col  overflow-hidden  tablet:w-[400px] rounded-[12px]   shadow-xl flex-shrink-0  bg-white !p-[16px] ${className}`}
      className={`max-h-[350px] mb-6  !h-full  mt-4 min-h-[350px] w-[288px] flex flex-col  overflow-hidden  tablet:min-h-[420px] tablet:w-[400px] rounded-[12px]   shadow-xl flex-shrink-0  bg-white !p-[16px] ${className}`}
    >
      <div
        className="bg-cover flex-shrink-0 bg-center w-full h-[140px] tablet:h-[199px] overflow-hidden  rounded-[12px] relative  bg-white  "
        style={{
          backgroundImage: photos?.[0] ? `url(${photos[0]})` : undefined,
          filter: 'brightness(0.86)',
        }}
      ></div>
      <div className="relative flex justify-between mx-3 tablet:mx-4">
        {iconUrl ? (
          <div
            className={`'border-2  mt-[-22px] h-[44px] w-[44px] bg-cover bg-center flex-shrink-0 overflow-hidden border-white bg-white ${
              iconUrl ? '' : '!bg-lightGray'
            }  rounded-full h-full w-full'`}
            style={{
              backgroundImage: `url(${iconUrl})`,
            }}
          />
        ) : (
          <div
            className={
              'h-[44px] w-[44px] mt-[-22px]  rounded-full overflow-hidden p-1 bg-[#EDDFFF]'
            }
          >
            <Image alt={'alt pro icon'} src={ImgProUser} />
          </div>
        )}
        {props.rating > 0 ? (
          <div className="h-10 w-[67px] flex items-center justify-center -mt-5 bg-white shadow-xl rounded-[20px]">
            <div className="flex items-center justify-center gap-1">
              <IconStarRegular />
              <H16 className={'!font-bold'}>
                {fixInteger(props.rating).toFixed(1)}
              </H16>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col justify-between flex-1 h-full mt-3 tablet:mt-5">
        <div>
          <H20 className="truncate tablet:text-28 tablet:leading-[28px] !pb-2">
            {name}
          </H20>
          {categoryWithIcon && (
            <div className="flex flex-nowrap overflow-x-auto my-1 scrollbar-none gap-2 mb-3 small:mb-4">
              {categories?.map((el) => (
                <CategoryWithIcon key={el.id} {...el} />
              ))}
            </div>
          )}
          <H16
            color="text-gray"
            className="line-clamp-2  tablet:text-18 tablet:leading-[24px]"
          >
            {props.address}
          </H16>
        </div>
        {distance > 0 ? (
          <div className="flex items-center  flex-shrink-0 gap-x-2.5 mt-2 tablet:mt-3 truncate">
            <IconPin className="flex-shrink-0 fill-orange" />
            <H14
              color="text-gray"
              className="truncate tablet:text-16 leading-[22px]"
            >
              {formatDistance(distance, country)} from you
            </H14>
          </div>
        ) : null}
      </div>
    </a>
  )
}

export const TopRateCardWithCategories: React.FC<IProfileInfo> = ({
  address,
  name,
  distance,
  categories,
  iconUrl,
  rating,
  photos,
  country,
  slug,
  id,
  // payInBnpl,
  categoryWithIcon,
}) => {
  const router = useRouter()

  const redirectFrom = getUrlWithSearchParams(router.pathname, router.query)
  return (
    <a
      href={getUrlWithSearchParams(ROUTES.profile(slug || id), {
        redirectFrom,
      })}
      target={'_blank'}
      className={`w-full flex flex-col overflow-hidden rounded-xl shadow-xl flex-shrink-0 bg-white small:p-4 p-3 pb-5`}
      rel="noreferrer"
    >
      <div
        className="bg-cover flex-shrink-0 bg-center w-full small:h-[199px] h-[169px] overflow-hidden  rounded-[12px] relative  bg-white"
        style={{
          backgroundImage: `url(${photos?.length ? photos[0] : ''})`,
          filter: 'brightness(0.86)',
        }}
      />

      <div className="relative flex justify-between mx-3 tablet:mx-4">
        {iconUrl ? (
          <div
            className="border-2 mt-[-22px] small:h-11 small:w-11 h-10 w-10 bg-cover bg-center flex-shrink-0 overflow-hidden  border-white bg-white rounded-full"
            style={{
              backgroundImage: `url(${iconUrl})`,
            }}
          />
        ) : (
          <div
            className={
              'border-2 mt-[-22px] small:h-11 small:w-11 h-10 w-10 border-white  rounded-full overflow-hidden p-1 bg-[#EDDFFF]'
            }
          >
            <Image alt={'alt pro icon'} src={ImgProUser} />
          </div>
        )}
        {rating > 0 ? (
          <div className="h-10 w-[67px] flex items-center justify-center  mt-[-20px] bg-white shadow-xl rounded-[20px]">
            <div className={'flex items-center gap-1 justify-center'}>
              <IconStarRegular />
              <H16 className={'font-bold'}>{rating?.toFixed(1)}</H16>
            </div>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col justify-between flex-1 h-full px-3 mt-3 small:px-4 small:pb-4 tablet:mt-5">
        <div>
          <H20 className="truncate tablet:text-28 tablet:!leading-[28px] !leading-5 small:mb-3 mb-2">
            {name}
          </H20>
          <div className="flex flex-wrap items-center gap-2 mb-3 small:mb-4">
            {categories?.map((el) => (
              <>
                <CategoryWithIcon
                  className={categoryWithIcon ? 'laptop:hidden' : ``}
                  key={el.id}
                  {...el}
                />
              </>
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
          <H16
            color="text-gray"
            className="line-clamp-2  tablet:text-18 tablet:leading-[24px]"
          >
            {address}
          </H16>
        </div>
        {distance > 0 ? (
          <div className="flex items-center flex-shrink-0 gap-x-2.5 small:mt-3 mt-2.5 truncate">
            <IconPin className="flex-shrink-0 fill-orange" />
            <H14
              color="text-gray"
              className="truncate tablet:text-16 small:leading-[22px]"
            >
              {formatDistance(distance, country)} from you
            </H14>
          </div>
        ) : null}
      </div>
    </a>
  )
}

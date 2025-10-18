import Image from 'next/image'

import { IconPin } from '@/assets/icons/icons'
import { ImgProUser } from '@/assets/images/images'
import { Rating } from '@/components/cardElements/Rating'
import { ICardData } from '@/components/cards/SearchLongCard'
import { H14, H16 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { formatDistance } from '@/core/helpers/formatDistance'

export const RecentlyCard = ({
  name,
  address,
  photos,
  className,
  country,
  slug,
  id,
  ...props
}: ICardData) => {
  return (
    <a
      href={ROUTES.profile(slug || id)}
      draggable={false}
      className={`max-h-[252px] mb-6 mt-4 tablet:pb-[24px] min-h-[252px] w-[182px] flex flex-col  h-full overflow-hidden tablet:min-h-[361px] tablet:w-[290px] rounded-[16px]  shadow-xl flex-shrink-0  bg-white ${className}`}
    >
      <div
        className="bg-cover flex-shrink-0 bg-center w-full h-[142px] tablet:h-[226px] overflow-hidden rounded-t-2xl relative bg-white"
        style={{
          backgroundImage: photos?.[0] ? `url(${photos[0]})` : undefined,
          filter: 'brightness(0.86)',
        }}
      ></div>
      <div className="flex flex-col relative rounded-t-2xl bg-white flex-1 h-full mt-[-22px] tablet:-mt-10 justify-between">
        <div className={''}>
          <LogoAndRate {...props} />
          <H16
            className={
              'truncate px-3 tablet:px-6 pt-2 tablet:pt-[17px] font-bold tablet:text-28 tablet:leading-7 pb-1.5 tablet:pb-2'
            }
          >
            {name}
          </H16>
          <H14
            color="text-gray"
            className="px-3 tablet:px-6 line-clamp-2  tablet:text-18 tablet:leading-[27px]"
          >
            {address}
          </H14>
        </div>
        <div className="flex items-center px-3 tablet:px-6 pb-3 tablet:pb-6 flex-shrink-0 mt-2 gap-x-2.5 tablet:mt-2 truncate">
          {props.distance > 0 ? (
            <>
              <IconPin className="flex-shrink-0 fill-orange" />
              <H14
                color="text-gray"
                className="truncate tablet:text-16 leading-[22px]"
              >
                {formatDistance(props.distance, country)} from you
              </H14>
            </>
          ) : null}
        </div>
      </div>
    </a>
  )
}

const LogoAndRate = ({ iconUrl, rating }: Partial<ICardData>) => {
  return (
    <div
      className={'flex justify-between mt-[-18px]  mx-[12px] tablet:mx-[24px]'}
    >
      {
        <div
          className={
            'border-[2px] h-[36px] w-[36px] tablet:h-[40px]  tablet:w-[40px] bg-cover bg-center flex-shrink-0 overflow-hidden  border-white bg-lightGray rounded-full'
          }
        >
          {iconUrl && iconUrl !== 'https://string' ? (
            <Image alt={'logo'} width={120} height={120} src={iconUrl} />
          ) : (
            <div className={'p-1.5 bg-[#EDDFFF]'}>
              <Image alt={'alt pro icon'} src={ImgProUser} />
            </div>
          )}
        </div>
      }

      {rating && rating > 0 ? (
        <div
          className={
            'h-9 tablet:h-10 w-[67px] flex items-center justify-center  bg-white shadow-xl rounded-[20px]'
          }
        >
          <Rating
            className="maxSmall:h-[36px]"
            textClassName="!text-[12px] whitespace-nowrap"
            rating={rating}
          />
        </div>
      ) : null}
    </div>
  )
}

import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'

import { IconPin } from '@/assets/icons/icons'
import { ImgProUser } from '@/assets/images/images'
import { Rating } from '@/components/cardElements/Rating'
import { H12, H16, H20 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { formatDistance } from '@/core/helpers/formatDistance'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'

import { ICardData } from './SearchLongCard'

const NewSearchCard = ({
  name,
  address,
  photos,
  className,
  country,
  slug,
  id,
  ...props
}: ICardData) => {
  const router = useRouter()
  const redirectFrom = getUrlWithSearchParams(router.pathname, router.query)

  return (
    <a
      href={getUrlWithSearchParams(ROUTES.profile(slug || id), {
        redirectFrom,
      })}
      target={'_blank'}
      rel="noreferrer"
      className={`rounded-[16px] overflow-hidden shadow-xl bg-white ${className}`}
    >
      <Image
        src={photos?.[0] ? photos[0] : ''}
        alt="Profile image"
        width={500}
        height={400}
        style={{ filter: 'brightness(0.86)' }}
        className="object-cover bg-center"
      />
      <div className="flex flex-col relative rounded-t-2xl bg-white h-[110px] tablet:h-[130px] -mt-0 tablet:-mt-10 mb-2">
        <div className={''}>
          <LogoAndRate {...props} />
          <div className={'tablet:p-4'}>
            <H20 className={'truncate tablet:leading-[28px] '}>{name}</H20>
            <H12
              color="text-gray"
              className="line-clamp-1 tablet:leading-[16.8px]"
            >
              {address}
            </H12>

            <div className="flex items-center flex-shrink-0 mt-3 gap-x-2.5 truncate">
              {props.distance > 0 ? (
                <>
                  <IconPin className="flex-shrink-0 fill-orange" />
                  <H16
                    color="text-black"
                    className="truncate tablet:text-16 leading-[22.4px]"
                  >
                    {formatDistance(props.distance, country)} from you
                  </H16>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

export default NewSearchCard

const LogoAndRate = ({ iconUrl, rating }: Partial<ICardData>) => {
  return (
    <div
      className={'flex justify-between mt-[-18px] mx-[12px] tablet:mx-[24px]'}
    >
      {
        <div
          className={
            'border-[2px] tablet:-mt-4 h-[36px] w-[36px] tablet:h-[60px]  tablet:w-[60px] bg-cover bg-center flex-shrink-0 overflow-hidden  border-white bg-lightGray rounded-full'
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
            textClassName="!text-[16px] whitespace-nowrap"
            rating={rating}
          />
        </div>
      ) : null}
    </div>
  )
}

import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'

import ProCard from '@/components/cards/ProCard'
import { H48 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { RecentlyCard } from '@/features/homePage/recentlyViewed/RecentlyCard'
import { useAppSelector } from '@/hooks/hooks'
import { meSelector } from '@/store/me/meSelector'
import { recentlySelector } from '@/store/topRated/topRatedSelectors'

const HorizontalSlider = dynamic(
  () => import('../../homePage/HorizontalSlider')
)

export const RecentlyViewed = memo(() => {
  const { status, recently } = useSelector(recentlySelector)
  const { country } = useAppSelector(meSelector)
  const { t } = useTranslation(TRANSLATE_KEYS.main_page)

  return recently.length !== 0 ? (
    <HorizontalSlider
      propSettings={{ infinite: false }}
      title={
        <H48 className="maxTablet:text-28 whitespace-nowrap maxTablet:leading-[34px] !font-bold tablet:mb-6">
          {t('titles.recently_viewed')}
        </H48>
      }
      status={status}
      wrapperClassName={'bg-lightMain/60 pt-10 desktop:pt-20 desktop:pb-20'}
      viewAllButton={false}
      skeletonNode={
        <div className="w-[288px] h-[310px] flex-shrink-0 rounded-xl bg-lightGray animate-pulse" />
      }
      content={recently.map((el) => (
        <>
          <div className="tablet:hidden block">
            <RecentlyCard
              className={
                'mx-2.5 tablet:mx-5 desktop:w-[280px] largeDesktop:w-[290px]'
              }
              key={el.id}
              country={country}
              {...el}
            />
          </div>
          <ProCard
            id={el.id}
            slug={el.slug}
            title={el.name}
            location={el.address}
            profileImage={el.iconUrl}
            images={el.photos}
            width={305}
            height={305}
            rating={el.rating}
            distance={el.distance}
          />
        </>
      ))}
    />
  ) : null
})

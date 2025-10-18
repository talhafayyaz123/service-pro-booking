import React from 'react'

import ProCard from '@/components/cards/ProCard'
import { TopRateCard } from '@/components/cards/TopRateCard'
import { H48 } from '@/components/typography'
import HorizontalSlider from '@/features/homePage/HorizontalSlider'
import { useGetFeaturedProsQuery } from '@/features/homePage/store/store'

export const FeaturedPros = () => {
  const { data, isLoading } = useGetFeaturedProsQuery()

  if (data?.data.length === 0 && !isLoading) {
    return null
  } else {
    return (
      <>
        <HorizontalSlider
          title={
            <H48 className="maxTablet:text-28 whitespace-nowrap maxTablet:leading-[34px] !font-bold tablet:mb-6">
              <span className={'!text-orange'}>Featured</span> pro's
            </H48>
          }
          status={isLoading}
          viewAllButton={false}
          wrapperClassName={`tablet:pb-10 desktop:pb-20`}
          sliderHeaderClassName="items-center"
          skeletonNode={
            <div className="w-[305px] h-[305px] flex-shrink-0 rounded-xl bg-lightGray animate-pulse" />
          }
          content={(data?.data || []).map((el) => (
            <>
              <div className="tablet:hidden block">
                <TopRateCard
                  categoryWithIcon
                  className="mx-2.5 tablet:mx-5"
                  key={el.id}
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
      </>
    )
  }
}

import { useRouter } from 'next/router'
import React from 'react'

import ProCard from '@/components/cards/ProCard'
import { TopRateCard } from '@/components/cards/TopRateCard'
import { H48 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import HorizontalSlider from '@/features/homePage/HorizontalSlider'
import { useGetLatestProsQuery } from '@/features/homePage/store/store'
import { getQueriesForSearchRedirect } from '@/features/search/helpers/localLocation'
import { useSearchStore } from '@/features/search/hooks/useSearchStore'

export const LatestPros = () => {
  const router = useRouter()
  const { data, isLoading } = useGetLatestProsQuery()
  const canFetch = useSearchStore((state) => state.canFetch)
  const onViewAllClick = () => {
    canFetch.current = false
    const query = getQueriesForSearchRedirect()
    router.push({
      pathname: ROUTES.search,
      query: { ...query, paidPro: true, topBookingCount: true },
    })
  }

  if ((data?.data.length === 0 || data?.data.length == null) && !isLoading) {
    return null
  } else {
    return (
      <>
        <HorizontalSlider
          title={
            <H48 className="maxTablet:text-28 whitespace-nowrap maxTablet:leading-[34px] !font-bold tablet:mb-6">
              ✨<span>Latest</span> pros
            </H48>
          }
          status={isLoading}
          viewAllButton={true}
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
          onViewAllClick={onViewAllClick}
        />
      </>
    )
  }
}

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import React, { useEffect } from 'react'

import ProCard from '@/components/cards/ProCard'
import { TopRateCard } from '@/components/cards/TopRateCard'
import { H48 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { getQueriesForSearchRedirect } from '@/features/search/helpers/localLocation'
import { useSearchStore } from '@/features/search/hooks/useSearchStore'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { getTopRatedThunk } from '@/store/topRated/topRatedRequests'

const HorizontalSlider = dynamic(
  () => import('../../homePage/HorizontalSlider')
)

export const TopRated = () => {
  const dispatch = useAppDispatch()
  const { data, status } = useAppSelector((state) => state.topRated.topRated)
  const { t } = useTranslation(TRANSLATE_KEYS.main_page)

  const router = useRouter()
  const canFetch = useSearchStore((state) => state.canFetch)

  const onViewAllClick = () => {
    canFetch.current = false
    const query = getQueriesForSearchRedirect()
    router.push({
      pathname: ROUTES.search,
      query: { ...query, topRated: true },
    })
  }

  useEffect(() => {
    dispatch(getTopRatedThunk({}))
  }, [dispatch])

  return (
    <>
      {data.length !== 0 && !status ? (
        <HorizontalSlider
          title={
            <H48 className="maxTablet:text-28 whitespace-nowrap maxTablet:leading-[34px] !font-bold tablet:mb-6">
              {t('titles.top_rated')}
            </H48>
          }
          status={status}
          viewAllClassName="!text-black hover:!text-orange"
          wrapperClassName={`tablet:pb-10 desktop:pb-20`}
          sliderHeaderClassName="items-center"
          skeletonNode={
            <div className="w-[288px] h-[310px] flex-shrink-0 rounded-xl bg-lightGray animate-pulse" />
          }
          content={data.map((el) => (
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
      ) : null}
    </>
  )
}

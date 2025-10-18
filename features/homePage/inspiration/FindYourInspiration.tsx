import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import React from 'react'
import { useSelector } from 'react-redux'

import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { InspirationCard } from '@/features/homePage/inspiration/InspirationCard'
import { inspirationSelector } from '@/store/commonStor/inspirations/inspirationsSelectors'

const HorizontalSlider = dynamic(
  () => import('../../homePage/HorizontalSlider')
)

export const FindYourInspiration = () => {
  const { inspirations, status } = useSelector(inspirationSelector)
  const { t } = useTranslation(TRANSLATE_KEYS.main_page)

  return (
    <>
      {inspirations?.length ? (
        <HorizontalSlider
          title={t('titles.find_inspiration')}
          status={status}
          href={ROUTES.inspiration}
          wrapperClassName="!bg-[#FBECF0] pt-10 desktop:pt-[128px] tablet:pb-20 desktop:pb-[120px]"
          viewAllClassName="!text-black hover:!text-orange"
          skeletonNode={
            <div className="w-[288px] h-[310px] flex-shrink-0 rounded-xl bg-lightGray animate-pulse" />
          }
          content={inspirations.map((item) => (
            <InspirationCard
              className="maxTablet:w-[270px]  maxTablet:h-[300px] mb-6 mt-4 tablet:h-[508px] tablet:w-[390px] desktop:w-[390px]  largeDesktop:w-[401px]  overflow-hidden  flex-shrink-0 relative bg-white rounded-xl mx-2.5 tablet:mx-5"
              key={item.id}
              {...item}
            />
          ))}
        />
      ) : null}
    </>
  )
}

import dynamic from 'next/dynamic'
import React from 'react'
import { useSelector } from 'react-redux'

import ProCard from '@/components/cards/ProCard'
import { H40 } from '@/components/typography'
import { IScrollBlockProps } from '@/features/homePage/HorizontalSlider'
import { profileSimilarSelector } from '@/features/profile/store/profileSelectors'

const HorizontalSlider = dynamic(
  () => import('../../../homePage/HorizontalSlider')
)

export const SimilarPros = (props: Partial<IScrollBlockProps>) => {
  const { data, status } = useSelector(profileSimilarSelector)

  return data?.length ? (
    <HorizontalSlider
      title={
        <H40 className="!font-bold maxSmall:!text-20 maxSmall:!leading-[28px]">
          Similar professionals
        </H40>
      }
      dots={false}
      propSettings={{ infinite: false }}
      status={status}
      viewAllButton={false}
      wrapperClassName={`small:mt-[68px] small:mb-[120px] cursor-pointer`}
      viewAllClassName={'!text-black hover:!text-orange'}
      skeletonNode={
        <div className="w-[288px] h-[310px] flex-shrink-0 rounded-xl bg-lightGray animate-pulse" />
      }
      content={data.map((el) => (
        <React.Fragment key={el.id}>
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
        </React.Fragment>
      ))}
      {...props}
    />
  ) : null
}

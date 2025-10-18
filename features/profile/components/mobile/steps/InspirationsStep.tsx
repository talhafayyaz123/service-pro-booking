import React, { memo } from 'react'
import { useSelector } from 'react-redux'

import { SimplifiedInspirationCard } from '@/features/homePage/inspiration/InspirationCard'
import { inspirationsByIdSelector } from '@/store/commonStor/inspirations/inspirationsSelectors'

const InspirationsStep = memo(() => {
  const { data } = useSelector(inspirationsByIdSelector)

  return (
    <div className={'mt-6'}>
      {data?.length ? (
        <div className={'grid grid-cols-2 gap-3 container'}>
          {data.map((item) => (
            <SimplifiedInspirationCard
              className={'w-[162px] mx-auto h-[210px]'}
              key={item.id}
              {...item}
            />
          ))}
        </div>
      ) : (
        ''
      )}
    </div>
  )
})

export default InspirationsStep

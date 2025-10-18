import { useEffect, useState } from 'react'

import { BaseLocationMap } from '@/components/Map/BaseLocationMap'
import { H20 } from '@/components/typography'
import { IBaseMap } from '@/types/maps'

const LocationMap = (props: IBaseMap) => {
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setRendered(true)
    }, 10_000)
  }, [])

  return props.latitude && props.longitude && rendered ? (
    <div className="rounded-[20px] bg-white tablet:p-0 tablet:pt-0 tablet:pb-0 pt-6 pb-5 tablet:shadow-none shadow-xl">
      <div className="container">
        <H20 className="!font-bold tablet:mb-6 mb-5 tablet:text-[40px] tablet:leading-[48px]">
          Location
        </H20>
        <BaseLocationMap
          {...props}
          mapContainerClassName={'tablet:h-[480px] h-[230px]'}
          className={'tablet:h-[480px] h-[230px]'}
        />
      </div>
    </div>
  ) : null
}

export default LocationMap

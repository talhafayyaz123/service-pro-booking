import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { H40 } from '@/components/typography'
import { SimplifiedInspirationCard } from '@/features/homePage/inspiration/InspirationCard'
import { useAppDispatch } from '@/hooks/hooks'
import { getInspirationById } from '@/store/commonStor/inspirations/inspirationsRequests'
import { inspirationsByIdSelector } from '@/store/commonStor/inspirations/inspirationsSelectors'

const HorizontalSlider = dynamic(
  () => import('@/features/homePage/HorizontalSlider')
)

interface Props {
  proId: string
}

export const ProfileInspirationSlider = ({ proId }: Props) => {
  const { data, status } = useSelector(inspirationsByIdSelector)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getInspirationById(proId))
  }, [proId, dispatch])

  return (
    <>
      {data?.length ? (
        <HorizontalSlider
          propSettings={{ infinite: false }}
          title={<H40 className={'!font-bold'}>Inspiration</H40>}
          status={status || false}
          href={'#'}
          wrapperClassName={'py-[100px]  bg-lightMain'}
          viewAllClassName={'!text-black hover:!text-orange'}
          skeletonNode={
            <div className="w-[288px] h-[310px] flex-shrink-0 rounded-[12px] bg-lightGray animate-pulse" />
          }
          content={data.map((item) => (
            <SimplifiedInspirationCard
              className="w-[290px] h-[322px] mb-4 mt-4  overflow-hidden  flex-shrink-0 relative  bg-white rounded-[12px] mx-[10px] tablet:mx-[20px]"
              key={item.id}
              {...item}
            />
          ))}
          viewAllButton={false}
        />
      ) : (
        ''
      )}
    </>
  )
}

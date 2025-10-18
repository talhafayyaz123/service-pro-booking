import Image from 'next/image'

import { ImgNotFound } from '@/assets/images/images'
import { H24, H42 } from '@/components/typography'

export const NotFoundPic = ({
  className,
  title,
  subtitle,
}: {
  className?: string
  title: string
  subtitle?: string
}) => {
  return (
    <div
      className={
        className ? className : 'container rounded-[24px] mt-20 py-14 my-auto'
      }
      style={{ backgroundColor: 'rgba(245, 125, 60, 0.1)' }}
    >
      <div className={'flex flex-col'}>
        <div
          className={
            'h-[240px] w-[280px]  tablet:h-[298px] tablet:w-[324px] mx-auto  !mb-12'
          }
        >
          <Image
            alt={'Not Found image'}
            objectFit={'cover'}
            width={324}
            height={298}
            src={ImgNotFound.src}
          />
        </div>
        <H42
          color={'text-orange'}
          className={'font-bold text-center maxSmall:text-32'}
        >
          {title}
        </H42>
        {subtitle && (
          <H24
            color={'text-orange'}
            className={'font-bold text-center maxSmall:text-18 mt-4'}
          >
            {subtitle}
          </H24>
        )}
      </div>
    </div>
  )
}

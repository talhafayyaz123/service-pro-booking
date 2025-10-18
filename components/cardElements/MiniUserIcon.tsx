import Image from 'next/image'

import { ImgProUser } from '@/assets/images/images'
import { H14 } from '@/components/typography'
import { TTextColors } from '@/types/typo'

export const MiniUserIcon = ({
  iconUrl,
  name,
  textColor = 'text-white',
  className,
}: {
  iconUrl?: string
  name?: string
  textColor?: TTextColors
  className?: string
}) => {
  return (
    <div
      className={`grid grid-cols-[20px_1fr] items-center gap-[8px] ${className}`}
    >
      {iconUrl && iconUrl !== 'string' ? (
        <div
          className={
            'w-5 h-5 border-white bg-white border overflow-hidden rounded-full'
          }
        >
          <Image
            alt="icon"
            quality={75}
            width={80}
            height={80}
            objectFit="cover"
            src={iconUrl}
            priority
          />
        </div>
      ) : (
        <div
          className={
            'w-5 h-5 border border-white  rounded-full overflow-hidden  bg-[#EDDFFF]'
          }
        >
          <Image alt={'alt pro icon'} src={ImgProUser} />
        </div>
      )}

      <H14 color={textColor} className={'truncate'}>
        {name}
      </H14>
    </div>
  )
}

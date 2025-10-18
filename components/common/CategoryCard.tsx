import Image from 'next/image'
import { memo, ReactNode, useMemo } from 'react'

import { H20 } from '@/components/typography'
import { hexToRGBA } from '@/core/helpers/hexToRGBA'
import { ICategory } from '@/types/categoriesTypes'

type ICategoryCard = Partial<ICategory>
type TCategorySize =
  | '80'
  | '72'
  | '60'
  | '64'
  | '25'
  | '56'
  | '54'
  | '48'
  | '15'
  | '12'
  | '20'
  | '9'
export const CategoryIcon = memo(
  ({
    iconUrl,
    size = '25',
    color,
    borderColor,
    className,
  }: ICategoryCard & {
    size?: TCategorySize
    borderColor?: string
    className?: string
  }) => {
    const currentSize = useCategoryIconConfig(size)
    return (
      <div
        style={{ borderColor: borderColor ? borderColor : 'white' }}
        className={`shadow-xl h-fit w-fit rounded-full ${currentSize.border} flex-shrink ${className}`}
      >
        <div className={'bg-white  rounded-full overflow-hidden'}>
          <div
            style={{
              backgroundColor: hexToRGBA(color, 0.6),
              boxShadow: `0px 4px 27px rgba(182, 190, 206, 0.3), inset 0px 0px 12px ${color}`,
            }}
            className={`flex items-center justify-center   rounded-full ${currentSize.padding}`}
          >
            <div
              className={`${currentSize.img} flex items-center justify-center `}
            >
              {iconUrl &&
                (typeof iconUrl === 'string' ? (
                  <Image
                    alt={'category'}
                    objectFit={'cover'}
                    width={size}
                    height={size}
                    src={iconUrl}
                  />
                ) : (
                  iconUrl
                ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

export const CategoryIconSkeleton = ({ size }: { size: TCategorySize }) => {
  const currentSize = useCategoryIconConfig(size)

  return (
    <div
      className={`shadow-xl h-fit w-fit rounded-full ${currentSize.border} border-white `}
    >
      <div
        className={'rounded-full overflow-hidden  bg-lightGray animate-pulse '}
      >
        <div
          className={`flex items-center justify-center  rounded-full ${currentSize.padding}`}
        >
          <div className={currentSize.img} />
        </div>
      </div>
    </div>
  )
}

const useCategoryIconConfig = (size: TCategorySize) => {
  const currentSize: Record<
    TCategorySize,
    { img: string; padding: string; border: string }
  > = useMemo(
    () => ({
      80: {
        img: `w-[38px] max-h-[38px]`,
        padding: `w-[80px] h-[80px]`,
        border: `border-[3px]`,
      },
      72: {
        img: `w-[38px] max-h-[38px]`,
        padding: `w-[72px] h-[72px]`,
        border: ``,
      },
      64: {
        img: `w-[30px] max-h-[30px]`,
        padding: `w-[64px] h-[64px]`,
        border: `border-[3px]`,
      },
      60: {
        img: `w-[28px]`,
        padding: ` w-[60px] h-[60px] `,
        border: `border-[3px]`,
      },
      54: {
        img: `w-[25px] `,
        padding: `w-[54px] h-[54px]`,
        border: `border-[3px]`,
      },
      56: {
        img: `w-[25px] `,
        padding: `w-[56px] h-[56px]`,
        border: `border-[3px]`,
      },
      48: {
        img: `w-[25px] `,
        padding: `w-[48px] h-[48px]`,
        border: `border-[3px]`,
      },
      25: {
        img: `w-[25px] `,
        padding: `w-[42.5px] h-[42.5px]`,
        border: `border`,
      },
      20: {
        img: `w-[16px] h-[16px]`,
        padding: `w-[25.5px] h-[25.5px]`,
        border: `border border-[1.5px] `,
      },
      15: {
        img: `w-4 h-4`,
        padding: `w-[36px] h-[36px]`,
        border: `border border-[2px]`,
      },
      12: {
        img: `w-[19px] h-[19px]`,
        padding: `w-[25.5px] h-[25.5px]`,
        border: `border `,
      },
      9: {
        img: 'w-[9.5px] h-[9.5px]',
        padding: 'w-[14.5px] h-[14.5px]',
        border: 'border-[2px]',
      },
    }),
    []
  )
  return currentSize[size]
}

export const CategoryCard = memo(
  ({
    data,
    className,
    children,
    onClick,
    size,
  }: {
    data: Partial<ICategory>
    className?: string
    children?: ReactNode
    onClick?: () => void
    size?: TCategorySize
  }) => {
    return (
      <div
        role="button"
        onClick={onClick}
        className={`bg-white py-2 tablet:py-6 flex items-center justify-between ${className}`}
      >
        <div className="flex items-center maxTablet:gap-3.5 gap-5">
          <CategoryIcon {...data} size={size} />
          <div>
            <H20 className={'maxTablet:!text-[18px] maxTablet:!font-normal'}>
              {data.name}
            </H20>
          </div>
        </div>
        {children}
      </div>
    )
  }
)

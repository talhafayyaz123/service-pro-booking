import React from 'react'

import { H12 } from '@/components/typography'
import { ICategory } from '@/types/categoriesTypes'

export type TBaseChipSize = '12' | '14' | '16'

export interface IChipProps extends Partial<ICategory> {
  onClick?: () => void
  active?: boolean
  size?: TBaseChipSize
  className?: string
  textClassName?: string
  rightIcon?: React.ReactNode
}

export const ChipBase = ({
  onClick,
  active,
  name,
  size = '12',
  textClassName,
  className,
  rightIcon,
}: IChipProps) => {
  const sizeConfig = {
    12: {
      wrapper: 'py-[8px] px-[12px] rounded-[18px]',
      text: '',
    },
    14: {
      wrapper: 'py-[8px] px-[12px] rounded-[20px]',
      text: '!text-[14px] !leading-[18px]',
    },
    16: {
      wrapper: 'py-[8px] px-[12px] rounded-[20px]',
      text: '!text-[16px] !leading-[22px]',
    },
  }

  return (
    <div
      role={'none'}
      onClick={onClick}
      className={`w-fit border flex place-content-center place-items-center gap-2 h-fit  ${
        active ? 'border-orange bg-orange' : 'border-lightGray bg-white'
      } ${onClick ? 'cursor-pointer' : ''} ${
        sizeConfig[size].wrapper
      } ${className} `}
    >
      {rightIcon}
      <H12
        className={`${
          active ? '!text-white' : ''
        } !font-medium whitespace-nowrap ${
          sizeConfig[size].text
        } ${textClassName}`}
      >
        {name}
      </H12>
    </div>
  )
}

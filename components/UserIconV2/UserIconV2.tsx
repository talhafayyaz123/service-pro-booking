import Image from 'next/image'

import { cn } from '@/core/helpers/cn'

interface IProps {
  className?: string
  iconUrl?: string
}
export const UserIconV2 = ({ iconUrl, className, ...rest }: IProps) => {
  return (
    <div
      data-testid={'user-icon-mark'}
      className={cn(
        'overflow-hidden relative  border-white bg-lightGray rounded-full',
        className
      )}
      {...rest}
    >
      {iconUrl ? (
        <Image
          priority
          quality={80}
          objectFit={'cover'}
          layout={'fill'}
          alt={'user icon'}
          src={iconUrl ?? ''}
        />
      ) : null}
    </div>
  )
}

import { ReactNode } from 'react'

import { H14 } from '@/components/typography'

export const ShareElement = ({
  icon,
  text,
  className,
  onClick,
}: {
  icon: ReactNode
  text: string
  className?: string
  onClick?: () => void
}) => {
  return (
    <div
      role={'button'}
      onClick={() => onClick?.()}
      className={`flex flex-col mx-auto text-center gap-3 cursor-pointer ${className} `}
    >
      <div className="border border-lightGray rounded-full pb-1 h-[66px] w-[66px] small:h-[77px] small:w-[77px] flex items-center justify-center hover:bg-lightGray transition">
        {icon}
      </div>
      <H14 color={'text-black'}>{text}</H14>
    </div>
  )
}

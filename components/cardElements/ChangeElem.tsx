import { ReactNode } from 'react'

import { IconArrow, IconTrash } from '@/assets/icons/icons'
import { H16 } from '@/components/typography'

interface Props {
  value: ReactNode
  onClick: () => void
  className?: string
  onRemove?: (cardId: string) => void
  withArrow?: boolean
}

export const ChangeElem = ({
  value,
  onClick,
  className,
  onRemove,
  withArrow,
}: Props) => {
  return (
    <div
      role="button"
      className={`flex justify-between rounded-xl shadow-xl h-[60px] items-center px-6 ${
        withArrow ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      {typeof value === 'string' ? <H16>{value}</H16> : value}
      <div className="flex items-center h-full">
        {onRemove ? (
          <div className="flex items-center h-full">
            <IconTrash
              onClick={onRemove}
              className="w-4 h-4 transition-colors cursor-pointer hover:text-black text-gray"
            />
            {withArrow ? <div className="w-px h-6 mx-4 bg-gray" /> : null}
          </div>
        ) : null}
        {withArrow ? (
          <IconArrow
            className="rotate-180 cursor-pointer stroke-black"
            width={18}
          />
        ) : null}
      </div>
    </div>
  )
}

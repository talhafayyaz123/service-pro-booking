import { IconClose } from '@/assets/icons/icons'
import { cn } from '@/core/helpers/cn'

interface ICloseButton {
  onClick: () => void
  className?: string
}

export const CloseButton = ({ onClick, className }: ICloseButton) => {
  return (
    <div
      role={'button'}
      className={cn(
        'hover:shadow-base hover:bg-lightGray p-1.5 rounded-full transition duration-200 -m-1',
        className
      )}
      onClick={onClick}
    >
      <IconClose className="h-5 w-5 stroke-[#939DAA]" />
    </div>
  )
}

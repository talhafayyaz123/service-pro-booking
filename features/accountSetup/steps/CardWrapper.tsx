import { cn } from '@/core/helpers/cn'

interface ICardProps {
  className?: string
  children: React.ReactNode
}

export const Card = ({ className, children, ...rest }: ICardProps) => {
  return (
    <div
      className={cn(
        'flex flex-1 flex-col p-5 gap-5 bg-white shadow-xl rounded-20',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

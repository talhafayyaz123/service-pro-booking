import { H14, H16, H24 } from '@/components/typography'
import { cn } from '@/core/helpers/cn'

interface IDepositCardProps {
  depositAmount: number
  className?: string
}

export const DepositCard = ({
  depositAmount,
  className,
}: IDepositCardProps) => {
  if (depositAmount === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'flex items-center gap-6 border border-orange rounded-xl px-5 py-[14px]',
        className
      )}
    >
      <div>
        <H16 color="text-orange" className="mb-1">
          Deposit Due Now
        </H16>
        <H14 color="text-gray">
          Secure your booking today, and pay the rest after the service!
        </H14>
      </div>

      <H24 color="text-orange" className="font-bold">
        ${Number(depositAmount.toFixed(2))}
      </H24>
    </div>
  )
}

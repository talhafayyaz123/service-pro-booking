import { cn } from '@/core/helpers/cn'

interface Props {
  lat?: number | string
  lng?: number | string
  className?: string
}

export const CurrentPositionMarker: React.FC<Props> = ({ className }) => {
  return (
    <div className="h-[70px] w-[70px] bg-white/80 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
      <div
        className={cn(
          'h-3.5 w-3.5 bg-orange rounded-full border-[1.5px] border-white',
          className
        )}
        style={{
          boxShadow: '0px 2px 9px rgba(83, 83, 94, 0.3)',
        }}
      />
    </div>
  )
}

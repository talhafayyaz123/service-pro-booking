import { CSSProperties } from 'react'

export const BaseSkeleton = ({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) => {
  return (
    <div
      style={style}
      className={`animate-pulse bg-lightGray h-[24px] w-[200px] rounded-[12px] ${className}`}
    />
  )
}

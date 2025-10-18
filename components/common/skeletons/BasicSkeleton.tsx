interface Props {
  width: number | string
  height: number | string
  rounded?: number | string
  className?: string
}

export const BasicSkeleton = ({
  height,
  rounded = 8,
  width,
  className = '',
}: Props) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: rounded,
      }}
      className={`bg-lightGray animate-pulse ${className}`}
    />
  )
}

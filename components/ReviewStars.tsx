import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { IconStarUncolor } from '@/assets/icons/icons'
const stars = [1, 2, 3, 4, 5]

export const ReviewStars = ({
  onChange,
  value,
}: {
  onChange: (arr: number[]) => void
  value?: number[]
}) => {
  const [hover, setHover] = useState<number>(0)
  const [data, setData] = useState<number[]>([])

  useEffect(() => {
    value && setData(value)
  }, [value])

  const onSetHover = useDebouncedCallback(
    (num: number, type: 'enter' | 'leave') => {
      if (type === 'enter') {
        setHover(num)
      } else {
        setHover(0)
      }
    },
    50
  )

  const onClick = (num: number) => {
    const newData = stars.filter((star) => star <= num)
    setData(newData)
    onChange && onChange(newData)
  }
  return (
    <div className={'flex justify-center gap-[6px]'}>
      {stars.map((el) => {
        const className = data.includes(el)
          ? 'stroke-orange fill-orange'
          : el <= hover
          ? 'stroke-orange fill-orange '
          : 'stroke-lightGray'
        return (
          <div
            role={'button'}
            key={el}
            onClick={() => onClick(el)}
            onMouseLeave={() => onSetHover(el, 'leave')}
            onMouseEnter={() => onSetHover(el, 'enter')}
          >
            <IconStarUncolor
              className={`cursor-pointer transform h-[34px] small:h-10  ${className}`}
            />
          </div>
        )
      })}
    </div>
  )
}

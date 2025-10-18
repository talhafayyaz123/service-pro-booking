import { useEffect, useState } from 'react'

import { IconFavorit, IconRedFavorit } from '@/assets/icons/icons'

export const Like = ({
  isLiked,
  className,
}: {
  isLiked?: boolean
  className?: string
}) => {
  const [like, setLike] = useState(isLiked)

  useEffect(() => {
    setLike(isLiked)
  }, [isLiked])
  return (
    <div className={`${className}`}>
      <div
        role={'button'}
        onClick={(e) => {
          e.stopPropagation()
          setLike(!like)
        }}
        className={
          'h-[40px] select-none w-[40px] bg-white rounded-full flex items-center justify-center transition-all cursor-pointer group hover:shadow-xl'
        }
      >
        {!like ? <IconFavorit /> : <IconRedFavorit className={`m-auto`} />}
      </div>
    </div>
  )
}

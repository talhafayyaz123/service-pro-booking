import { useEffect, useState } from 'react'

import {
  IconFingerLike,
  IconFingerLike18,
  IconFingerLikeRed,
  IconFingerLikeRed18,
} from '@/assets/icons/icons'
import { H14 } from '@/components/typography'

export const FingerLike = ({
  likesCount = 0,
  isLiked = false,
  onClick,
  onDislike,
  onLike,
  className,
  withoutCount,
  black,
}: {
  likesCount?: number
  isLiked?: boolean
  onClick?: () => void
  onDislike?: () => void
  onLike?: () => void
  className?: string
  withoutCount?: boolean
  black?: boolean
}) => {
  const [like, setLike] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likesCount)

  const [effect, setEffect] = useState(false)
  const handleLike = async () => {
    if (like) {
      setLike(false)
      onDislike && onDislike()
      setLikeCount((prev) => (prev > 0 ? prev - 1 : prev))
    } else {
      setEffect(true)
      onLike && onLike()
      setLike(true)
      setLikeCount((prev) => (prev > 0 ? prev + 1 : prev))
      setTimeout(() => setEffect(false), 300)
    }
  }

  useEffect(() => {
    setLikeCount(likesCount)
  }, [likesCount])

  useEffect(() => {
    setLike(isLiked)
  }, [isLiked])

  return (
    <div
      role={'button'}
      onClick={(e) => {
        e.stopPropagation()
        handleLike()
        onClick && onClick()
      }}
      className={`flex select-none  items-center max-w-[60px] flex-shrink-0  justify-start gap-x-[10px] group ${className}`}
    >
      {like ? (
        <IconFingerLikeRed
          className={`fill-cancelled   ${effect && 'animate-wiggle'} `}
        />
      ) : (
        <IconFingerLike className={`fill-gray ${black ? '!fill-black' : ''}`} />
      )}
      {!withoutCount && (
        <>
          {likeCount ? (
            <H14 className={`${like ? '!text-cancelled' : ''} `}>
              {likeCount}
            </H14>
          ) : (
            <div className={'w-3 h-4'} />
          )}
        </>
      )}
    </div>
  )
}

export const FingerLike18 = ({
  likesCount = 0,
  isLiked = false,
  onClick,
  onDislike,
  onLike,
  className,
  withoutCount,
  black,
}: {
  likesCount?: number
  isLiked?: boolean
  onClick?: () => void
  onDislike?: () => void
  onLike?: () => void
  className?: string
  withoutCount?: boolean
  black?: boolean
}) => {
  const [like, setLike] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likesCount)

  const [effect, setEffect] = useState(false)
  const handleLike = async () => {
    if (like) {
      setLike(false)
      onDislike && onDislike()
      setLikeCount((prev) => (prev > 0 ? prev - 1 : prev))
    } else {
      setEffect(true)
      onLike && onLike()
      setLike(true)
      setLikeCount((prev) => (prev > 0 ? prev + 1 : prev))
      setTimeout(() => setEffect(false), 300)
    }
  }

  useEffect(() => {
    setLikeCount(likesCount)
  }, [likesCount])

  useEffect(() => {
    setLike(isLiked)
  }, [isLiked])

  return (
    <div
      role={'button'}
      onClick={(e) => {
        e.stopPropagation()
        handleLike()
        onClick && onClick()
      }}
      className={`flex select-none  items-center max-w-[60px] flex-shrink-0  justify-start gap-x-[10px] group ${className}`}
    >
      {like ? (
        <IconFingerLikeRed18
          className={`fill-cancelled   ${effect && 'animate-wiggle'} `}
        />
      ) : (
        <IconFingerLike18
          className={`fill-gray ${black ? '!fill-black' : ''}`}
        />
      )}
      {!withoutCount && (
        <>
          {likeCount ? (
            <H14 className={`${like ? '!text-cancelled' : ''} `}>
              {likeCount}
            </H14>
          ) : (
            <div className={'w-3 h-4'} />
          )}
        </>
      )}
    </div>
  )
}

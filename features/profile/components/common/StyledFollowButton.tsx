import { memo, useCallback, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { IconFollow, IconFollowing } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { H16 } from '@/components/typography'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import {
  followRequest,
  unfollowRequest,
} from '@/store/commonStor/following/followRequest'

interface IStyledFollowButtonProps {
  follow: boolean
  proId: string
  isDisabled?: boolean
}

export const StyledFollowButton = memo(
  ({ follow, proId, isDisabled }: IStyledFollowButtonProps) => {
    const [currentFollow, setCurrentFollow] = useState(follow)
    const [disabled, setDisabled] = useState(false)

    const dispatch = useAppDispatch()
    const authGuard = useAuthGuard()
    const { accountId } = useAppSelector((state) => state.me.me)

    const debounced = useDebouncedCallback(() => setDisabled(false), 1000)

    useEffect(() => {
      setCurrentFollow(follow)
    }, [follow])

    const handleFollow = useCallback(() => {
      if (currentFollow) {
        dispatch(unfollowRequest((proId || '').toString())).then(() =>
          setCurrentFollow(false)
        )
      } else {
        dispatch(followRequest((proId || '').toString())).then(() =>
          setCurrentFollow(true)
        )
      }
      setDisabled(true)
      debounced()
    }, [currentFollow, debounced, dispatch, proId])

    return (
      <Button
        onClick={(e) => {
          if (isDisabled) {
            return
          } else {
            e.preventDefault()
            authGuard(handleFollow)
          }
        }}
        disabled={disabled || proId === accountId || isDisabled}
        className="w-full !bg-transparent !shadow-none laptop:max-w-[130px]"
      >
        <div className="flex items-center justify-center gap-x-2">
          {currentFollow ? (
            <IconFollowing className="w-5 h-5" />
          ) : (
            <IconFollow className="w-5 h-5" />
          )}

          <H16 className={`!font-bold ${currentFollow && 'text-orange'}`}>
            {currentFollow ? 'Following' : 'Follow'}
          </H16>
        </div>
      </Button>
    )
  }
)

StyledFollowButton.displayName = 'StyledFollowButton'

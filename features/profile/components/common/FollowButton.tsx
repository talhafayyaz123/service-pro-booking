import { memo, useCallback, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

import { Button, IButton } from '@/components/common/buttons/Button'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import {
  followRequest,
  unfollowRequest,
} from '@/store/commonStor/following/followRequest'

interface IProps {
  follow: boolean
  followText?: string
  unfollowText?: string
  proId: string
  buttonProps?: Partial<IButton>
  isDisabled?: boolean
}

export const FollowButton = memo(
  ({
    follow,
    buttonProps,
    followText,
    unfollowText,
    proId,
    isDisabled,
  }: IProps) => {
    const [currentFollow, setCurrentFollow] = useState(follow)

    const dispatch = useAppDispatch()
    const authGuard = useAuthGuard()
    // const isIncludes = data.includes(proId)
    const { accountId } = useAppSelector((state) => state.me.me)
    const [disabled, setDisabled] = useState(false)

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
        textClassName={'!font-bold '}
        size={'44'}
        className={'min-w-fit'}
        {...buttonProps}
      >
        {currentFollow ? followText ?? 'Unfollow' : unfollowText ?? 'Follow'}
      </Button>
    )
  }
)

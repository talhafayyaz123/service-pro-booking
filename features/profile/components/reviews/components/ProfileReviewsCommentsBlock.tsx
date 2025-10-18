import { useEffect } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Button } from '@/components/common/buttons/Button'
import { BaseLink } from '@/components/common/links/BaseLink'
import { H20 } from '@/components/typography'
import { DesktopComment } from '@/features/profile/components/reviews/components/commen/DesktopComment'
import { MobileComment } from '@/features/profile/components/reviews/components/commen/MobileComment'
import { getReviewsProByIdThunk } from '@/features/profile/store/profileRequests'
import {
  profileReviewsSelector,
  profileSelector,
} from '@/features/profile/store/profileSelectors'
import {
  fetchMoreReviews,
  REVIEWS_PER_PAGE,
} from '@/features/profile/store/profileSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

export const ProfileReviewsCommentsBlock = () => {
  const { data, hasMore, onShowMore } = useReviews()
  return (
    <div>
      {data.length ? (
        data.map(({ id, ...el }, index) => (
          <DesktopComment
            key={id}
            isFirst={index === 0}
            {...el}
            {...el.userInfo}
          />
        ))
      ) : (
        <></>
      )}
      {hasMore ? (
        <Button className="mt-6" onClick={onShowMore} buttonType="3d">
          Show more
        </Button>
      ) : null}
    </div>
  )
}

export const ProfileReviewsCommentsBlockMobile = () => {
  const { data, hasMore, onShowMore } = useReviews()

  return data.length !== 0 ? (
    <CardWrapper className={'mt-3'}>
      <H20>Reviews</H20>
      {data.map((el) => (
        <MobileComment key={el.id} {...el} {...el.userInfo} />
      ))}
      {hasMore ? (
        <div className={'flex justify-center w-full my-6'}>
          <BaseLink
            className="hover:!text-orange1"
            type="button"
            line={false}
            size="200"
            onClick={onShowMore}
          >
            Show more
          </BaseLink>
        </div>
      ) : null}
    </CardWrapper>
  ) : null
}

const useReviews = () => {
  const { data, page, limit, total } = useAppSelector(profileReviewsSelector)
  const profile = useAppSelector(profileSelector)
  const dispatch = useAppDispatch()
  const prodId = profile.data.id

  const pagesCount = Math.ceil(total / limit)

  useEffect(() => {
    if (page > 1) {
      dispatch(
        getReviewsProByIdThunk({ id: prodId, page, limit: REVIEWS_PER_PAGE })
      )
    }
  }, [page, dispatch, prodId])

  const onShowMore = () => {
    dispatch(fetchMoreReviews(page + 1))
  }

  const hasMore = pagesCount > page

  return { data, onShowMore, hasMore }
}

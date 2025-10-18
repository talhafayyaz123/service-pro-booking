import { H40 } from '@/components/typography'
import { ProfileReviewsCard } from '@/features/profile/components/reviews/components/ProfileReviewsCard'
import { ProfileReviewsCommentsBlock } from '@/features/profile/components/reviews/components/ProfileReviewsCommentsBlock'
import { profileRatingSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'

export const ProfileReviews = () => {
  const { data } = useAppSelector(profileRatingSelector)

  return data.total ? (
    <div
      id="reviews-section"
      className="mt-[120px] container border-b border-lightGray mb-10 pb-[60px]"
    >
      <H40 className="!font-bold">Reviews</H40>
      <div className={'grid grid-cols-[400px_1fr] mt-10 gap-[150px]'}>
        <ProfileReviewsCard />

        <ProfileReviewsCommentsBlock />
      </div>
    </div>
  ) : null
}

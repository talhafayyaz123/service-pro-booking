import { ProfileReviewsCardMobile } from '@/features/profile/components/reviews/components/ProfileReviewsCard'
import { ProfileReviewsCommentsBlockMobile } from '@/features/profile/components/reviews/components/ProfileReviewsCommentsBlock'

const ReviewStep = () => {
  return (
    <div className={'mt-3'}>
      <ProfileReviewsCardMobile />
      <ProfileReviewsCommentsBlockMobile />
    </div>
  )
}

export default ReviewStep

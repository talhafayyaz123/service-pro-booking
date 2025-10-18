import { API_POST_REVIEW } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'
import { ILeaveReviewParams } from '@/types/booking'

export const setReviewRequest = async ({
  proId,
  bookingId,
  rating,
  text,
  images,
}: Pick<
  ILeaveReviewParams,
  'proId' | 'bookingId' | 'rating' | 'text' | 'images'
>) => {
  return await instance.post(API_POST_REVIEW(proId, bookingId), {
    rating,
    text,
    images,
  })
}

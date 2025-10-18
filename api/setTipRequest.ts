import { API_TIPS } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'
import { ILeaveReviewParams } from '@/types/booking'

export const setTipRequest = async (
  bookingId: ILeaveReviewParams['bookingId'],
  amount: ILeaveReviewParams['amount']
) => {
  return await instance.post(API_TIPS(bookingId), { amount })
}

import { API_BOOKING } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'
import { IBooking, TBookingsStatus } from '@/types/booking'

interface IResponse {
  data: IBooking[]
  total: number
}

interface IParams {
  status?: TBookingsStatus
  limit: number
  page: number
}

export const getClientBookings = async (params: IParams) => {
  try {
    const { data } = await instance.get<IResponse>(API_BOOKING.booking, {
      params,
    })

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}

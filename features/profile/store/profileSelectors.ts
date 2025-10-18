import moment from 'moment'
import { createSelector } from 'reselect'

import { fixInteger } from '@/core/helpers/fixInteger'
import { RootStateType } from '@/store/rootStore'
import { IDefaultWorkHours } from '@/types/onboarding'

const profile = (state: RootStateType) => state.profile

export const profileSelector = createSelector(
  profile,
  ({ iProInfo, termsOfPayment }) => {
    return {
      data: {
        ...iProInfo.data,
        distance: fixInteger(iProInfo.data.distance),
        payInBnpl: termsOfPayment?.data?.payInBnpl,
      },
      status: iProInfo.status,
    }
  }
)

export const profileServicesSelector = createSelector(
  profile,
  ({ profileServices }) => {
    return profileServices
  }
)
export const profileRatingSelector = createSelector(profile, ({ rating }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { total, reviewCount, ...rest } = rating.data
  return {
    ...rating,
    data: {
      ...rating.data,
      total: Number.isInteger(rating.data?.total)
        ? rating.data?.total
        : (rating.data?.total || 0).toFixed(1),
      stars: [
        { star: 5, rating: rest.fiveStars },
        { star: 4, rating: rest.fourStars },
        { star: 3, rating: rest.threeStars },
        { star: 2, rating: rest.twoStars },
        { star: 1, rating: rest.oneStars },
      ],
    },
  }
})

export const profileSimilarSelector = createSelector(profile, ({ similar }) => {
  return similar
})

export const profileReviewsSelector = createSelector(profile, ({ reviews }) => {
  return {
    ...reviews,

    data: (reviews?.data || []).map((el) => ({
      ...el,
      photos: el.photos.map((el) => el?.url),
    })),
  }
})

export const profileBusinessHoursSelector = createSelector(
  profile,
  ({ about }) => {
    const weekdays: string[] = moment
      .weekdaysShort()
      .map((el) => el.toLowerCase())

    const workHours: IDefaultWorkHours[] = about?.data?.workHours || []
    return weekdays.map((el) => {
      const days = workHours
        .filter((day) => day.weekday === el)
        .map((day) => ({
          ...day,
          fromTime: day.fromTime.replaceAll('NaN', '0'),
          toTime: day.toTime.replaceAll('NaN', '0'),
        }))
      return { days, weekday: el }
    })
  }
)

export const additionalPoliciesSelector = createSelector(
  profile,
  ({ about }) => {
    return about.data?.additionalPolicies || ''
  }
)

export const profileAboutSelector = createSelector(profile, ({ about }) => {
  const weekdays = moment.weekdaysShort().map((el) => el.toLowerCase())
  const currentWorkHours: Record<string, IDefaultWorkHours> =
    about.data?.workHours.reduce(
      (acc, item) => ({
        ...acc,
        [item.weekday.toLowerCase()]: item,
      }),
      {}
    ) || []
  const workHours = weekdays.map(
    (weekday) =>
      currentWorkHours[weekday] ?? {
        weekday,
        to: null,
        from: null,
        empty: true,
      }
  )
  const linksNew = about.data?.linksNew || []

  return {
    ...about,
    data: {
      ...about.data,
      workHours: workHours.map((el) => ({
        ...el,
        from: el?.from?.toLowerCase(),
        to: el?.to?.toLowerCase(),
      })),
      linksNew,
    },
  }
})

export const isFullDepositSelector = createSelector(
  profile,
  ({ termsOfPayment }) => {
    return (
      ['PERCENT_OF_SERVICE', 'FULL_PRICE'].includes(
        termsOfPayment.data.depositType
      ) && termsOfPayment.data.amount === 100
    )
  }
)

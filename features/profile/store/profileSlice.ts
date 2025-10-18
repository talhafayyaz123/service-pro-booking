import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  IProfileAbout,
  IProfileCategory,
  IProfileReview,
  IRating,
  ISimilarPro,
  ITermsOfPayment,
  TDepositType,
} from '@/features/profile/profileType'
import {
  getInspirationsProByIdThunk,
  getProfileAboutProThunk,
  getProfileProByIdThunk,
  getProfileProServicesThunk,
  getRatingProByIdThunk,
  getReviewsProByIdThunk,
  getSimilarProByIdThunk,
  getTermsOfPaymentByIdThunk,
} from '@/features/profile/store/profileRequests'
import { TPageStatuses } from '@/types/common'
import { IProfileInfo } from '@/types/profileInfoTypes'

export const REVIEWS_PER_PAGE = 3

const initialState: IInitialState = {
  step: 'services',
  focusPolicies: false,
  pageStatus: 'loading',
  termsOfPayment: {
    data: {
      amount: 0,
      cancellationRule: 0,
      currency: '',
      depositType: 'FIXED',
      id: '',
      payInApp: false,
      payInCash: false,
      payInBnpl: false,
      description: '',
      percentOfService: 0,
      taxPercent: 0,
      travelFee: 0,
    },
    status: false,
  },
  reviews: {
    status: false,
    data: [],
    page: 1,
    limit: REVIEWS_PER_PAGE,
    total: 0,
  },
  iProInfo: {
    data: {
      id: '',
      name: '',
      iconUrl: '',
      slug: '',
      categories: [],
      address: '',
      latitude: 0,
      longitude: 0,
      rating: 0,
      isFollowing: false,
      distance: 0,
      photos: [],
      timezone: '',
      accountId: '',
    },
    status: false,
  },
  rating: {
    data: {
      fiveStars: 0,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStars: 0,
      total: 0,
      reviewCount: 0,
    },
    status: false,
  },

  similar: {
    data: [],
    total: 0,
    status: false,
  },
  about: {
    status: false,
  },
  profileServices: {
    status: false,
    data: [],
  },
}
const profileSlice = createSlice({
  name: 'ProfileSlice',
  initialState,
  reducers: {
    setProfileSlice: (
      state,
      { payload }: PayloadAction<Partial<IInitialState>>
    ) => ({ ...state, ...payload }),
    setFocusPolicies: (state) => {
      state.focusPolicies = !state.focusPolicies
    },
    setStep(state, { payload }) {
      state.step = payload
    },
    setPageStatus(state, { payload }: PayloadAction<TPageStatuses>) {
      state.pageStatus = payload
    },
    fetchMoreReviews(state, { payload }: PayloadAction<number>) {
      state.reviews.page = payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getProfileProByIdThunk.pending, (state) => {
      state.iProInfo.status = true
    })
    builder.addCase(getProfileProByIdThunk.fulfilled, (state, { payload }) => {
      state.iProInfo.status = false
      state.iProInfo.data = payload.data
    })
    builder.addCase(getProfileProByIdThunk.rejected, (state) => {
      state.iProInfo.status = false
    })

    //services

    builder.addCase(getProfileProServicesThunk.pending, (state) => {
      state.profileServices.status = true
    })
    builder.addCase(
      getProfileProServicesThunk.fulfilled,
      (state, { payload }) => {
        state.profileServices.data = payload.categoriesBlock
        state.profileServices.status = false
      }
    )
    builder.addCase(getProfileProServicesThunk.rejected, (state) => {
      state.profileServices.status = false
    })
    ///about

    builder.addCase(getProfileAboutProThunk.pending, (state) => {
      state.about.status = true
    })
    builder.addCase(getProfileAboutProThunk.fulfilled, (state, { payload }) => {
      state.about.data = payload.data
      state.about.status = false
    })
    builder.addCase(getProfileAboutProThunk.rejected, (state) => {
      state.about.status = false
    })

    //similar
    builder.addCase(getSimilarProByIdThunk.pending, (state) => {
      state.similar.status = true
    })
    builder.addCase(getSimilarProByIdThunk.fulfilled, (state, { payload }) => {
      state.similar.data = payload.data
      state.similar.total = payload.total
      state.similar.status = false
    })
    builder.addCase(getSimilarProByIdThunk.rejected, (state) => {
      state.similar.status = false
    })

    //rating
    builder.addCase(getRatingProByIdThunk.pending, (state) => {
      state.rating.status = true
    })
    builder.addCase(getRatingProByIdThunk.fulfilled, (state, { payload }) => {
      state.rating.data = payload.data
      state.rating.status = false
    })
    builder.addCase(getRatingProByIdThunk.rejected, (state) => {
      state.rating.status = false
    })

    //reviews
    builder.addCase(getReviewsProByIdThunk.pending, (state) => {
      state.reviews.status = true
    })
    builder.addCase(getReviewsProByIdThunk.fulfilled, (state, { payload }) => {
      state.reviews.data = [
        ...(state.reviews.data || []),
        ...payload.data.reviews,
      ]
      state.reviews.status = false
    })
    builder.addCase(getReviewsProByIdThunk.rejected, (state) => {
      state.reviews.status = false
    })
    //reviews
    builder.addCase(getInspirationsProByIdThunk.pending, (state) => {
      state.reviews.status = true
    })
    builder.addCase(
      getInspirationsProByIdThunk.fulfilled,
      (state, { payload }) => {
        state.reviews.data = payload.reviews
        state.reviews.status = false
      }
    )
    builder.addCase(getInspirationsProByIdThunk.rejected, (state) => {
      state.reviews.status = false
    })

    //terms-of-payment
    builder.addCase(getTermsOfPaymentByIdThunk.pending, (state) => {
      state.termsOfPayment.status = true
    })
    builder.addCase(
      getTermsOfPaymentByIdThunk.fulfilled,
      (state, { payload }) => {
        state.termsOfPayment = {
          status: false,
          data: {
            ...payload,
            depositType: (
              payload?.depositType || ''
            ).toUpperCase() as TDepositType,
          },
        }
      }
    )
    builder.addCase(getTermsOfPaymentByIdThunk.rejected, (state) => {
      state.termsOfPayment.status = false
    })
  },
})

export const profile = profileSlice.reducer
export const {
  setStep,
  setPageStatus,
  setFocusPolicies,
  setProfileSlice,
  fetchMoreReviews,
} = profileSlice.actions

interface IInitialState {
  step: string
  focusPolicies: boolean
  termsOfPayment: {
    data: ITermsOfPayment
    status: boolean
  }
  iProInfo: {
    data: IProfileInfo
    status: boolean
  }
  reviews: {
    data?: IProfileReview[]
    status: boolean
    page: number
    limit: number
    total: number
  }
  similar: {
    data: ISimilarPro[]
    total: number
    status: boolean
  }
  rating: {
    data: IRating
    status: boolean
  }

  about: {
    data?: IProfileAbout
    status: boolean
  }
  profileServices: {
    status: boolean
    data?: IProfileCategory[]
  }
  pageStatus: TPageStatuses
}

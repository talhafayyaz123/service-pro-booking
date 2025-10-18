import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IUserInfo } from '@/features/userProfile/types'
import {
  checkPasswordRequest,
  meRequest,
  setUserCategoriesRequest,
} from '@/store/me/meRequests'

const initMe: IUserInfo = {
  email: '',
  firstName: '',
  lastName: '',
  iconUrl: '',
  accountId: '',
  country: '',
  phone: '',
  currency: '',
  countryCode: '',
  categories: [],
  isVerified: false,
  role: 'CLIENT',
  subscription: null,
  trialSubscription: null,
  timezone: null,
  bookingReminder: false,
  discounts: false,
  fromPro: false,
  clientBalance: 0,
}

interface IInitialState {
  me: IUserInfo
  banners: {
    proListed: boolean
  }
  meStatus: boolean
  meReference: IUserInfo
  sendStatus: boolean
  checkPassword: {
    value: string
    status: boolean
    result: 'init' | 'error' | 'wrongPassword'
  }
}

const initialState: IInitialState = {
  meReference: initMe,
  banners: {
    proListed: true,
  },
  checkPassword: {
    value: '',
    status: false,
    result: 'init',
  },
  sendStatus: false,
  meStatus: false,
  me: initMe,
}

export const meSlice = createSlice({
  name: 'meSlice',
  initialState,

  reducers: {
    setMeItself: (state, { payload }: PayloadAction<Partial<IUserInfo>>) => {
      state.me = { ...state.me, ...payload }
    },
    setReferenceMe: (state, { payload }: PayloadAction<Partial<IUserInfo>>) => {
      state.meReference = { ...state.meReference, ...payload }
    },
    setBanners: (
      state,
      { payload }: PayloadAction<Partial<IInitialState['banners']>>
    ) => {
      state.banners = { ...state.banners, ...payload }
    },
    setSubscriptions: (
      state,
      { payload }: PayloadAction<IUserInfo['subscription']>
    ) => {
      if (payload) {
        state.me.subscription = { ...state?.me?.subscription, ...payload }
      }
    },
    setCheckPassword: (
      state,
      { payload }: PayloadAction<Partial<IInitialState['checkPassword']>>
    ) => {
      state.checkPassword = { ...state.checkPassword, ...payload }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(meRequest.pending, (state) => {
      state.meStatus = true
    })
    builder.addCase(meRequest.fulfilled, (state, { payload }) => {
      state.me = payload.data
      state.meReference = payload.data
      state.meStatus = false
    })
    builder.addCase(meRequest.rejected, (state) => {
      state.meStatus = false
    })

    builder.addCase(setUserCategoriesRequest.pending, (state) => {
      state.sendStatus = true
    })
    builder.addCase(setUserCategoriesRequest.fulfilled, (state) => {
      state.sendStatus = false
    })
    builder.addCase(setUserCategoriesRequest.rejected, (state) => {
      state.sendStatus = false
    })
    //checkPasswordRequest
    builder.addCase(checkPasswordRequest.pending, (state) => {
      state.checkPassword.status = true
    })
    builder.addCase(checkPasswordRequest.fulfilled, (state) => {
      state.checkPassword.status = false
    })
    builder.addCase(checkPasswordRequest.rejected, (state) => {
      state.checkPassword.status = false
    })
  },
})

export const {
  setMeItself,
  setReferenceMe,
  setCheckPassword,
  setSubscriptions,
  setBanners,
} = meSlice.actions
export const me = meSlice.reducer

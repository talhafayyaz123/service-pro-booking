import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  checkValidEmailRequest,
  getAuthRequest,
} from '@/store/auth/authResponce'

interface IInitialState {
  isAuth: boolean
  isLoading: boolean
  checkEmailStatus: 'init' | 'loading' | 'loaded' | 'error'
  checkEmailResult: 'valid' | 'invalid' | 'init'
}

// const { token } = getUser()
const initialState: IInitialState = {
  isAuth: false,
  isLoading: false,
  checkEmailStatus: 'init',
  checkEmailResult: 'init',
}
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthSlice: (
      state,
      { payload }: PayloadAction<Partial<IInitialState>>
    ) => ({ ...state, ...payload }),
  },
  extraReducers: (builder) => {
    builder.addCase(getAuthRequest.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getAuthRequest.fulfilled, (state) => {
      state.isAuth = true
      state.isLoading = false
    })
    builder.addCase(getAuthRequest.rejected, (state) => {
      state.isLoading = false
    })

    ///check email
    builder.addCase(checkValidEmailRequest.pending, (state) => {
      state.checkEmailStatus = 'loading'
    })
    builder.addCase(checkValidEmailRequest.fulfilled, (state, { payload }) => {
      state.checkEmailResult = !payload.data?.isExist ? 'valid' : 'invalid'
      state.checkEmailStatus = 'loaded'
    })
    builder.addCase(checkValidEmailRequest.rejected, (state) => {
      state.checkEmailStatus = 'error'
    })
  },
})
export const { setAuthSlice } = authSlice.actions
export const auth = authSlice.reducer

// export const { setLogout } = authSlice.actions

// export const setUser = (data: IAuthResponse) => {
//   const { tokens, ...rest } = data
//   nookies.set(undefined, COOKIE_KEYS.user, JSON.stringify(rest), {
//     path: '/',
//     maxAge: expireMs,
//   })
//   nookies.set(undefined, COOKIE_KEYS.token, tokens.accessToken.token, {
//     path: '/',
//     maxAge: expireMs,
//   })
//   nookies.set(undefined, COOKIE_KEYS.refresh, tokens.refreshToken.token, {
//     path: '/',
//     maxAge: expireMs,
//   })
// }

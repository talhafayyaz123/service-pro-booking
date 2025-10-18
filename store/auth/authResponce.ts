import { createAsyncThunk } from '@reduxjs/toolkit'

import { API_LINKS } from '@/core/consts/apiLinks'
import { setAuthSlice } from '@/store/auth/authSlice'
import { instance } from '@/store/instance'
import { IAuthPayload, IAuthResponse } from '@/types/authTypes'

export const postEmailForValidateRequest = async (value: string) => {
  return await instance.post<{ isExist: boolean }>(API_LINKS.checkEmail, {
    email: value,
  })
}
export const getAuthRequest = createAsyncThunk<
  IAuthResponse,
  { data: IAuthPayload; setError: () => void }
>('auth/getAuthRequest', async ({ data, setError }, { rejectWithValue }) => {
  try {
    return await instance.post(API_LINKS.login, data)
  } catch (error: any) {
    setError()
    return rejectWithValue(error.response.data)
  }
})

export const checkValidEmailRequest = createAsyncThunk(
  'checkValidEmail',
  async (
    {
      email,
      action,
      setError,
    }: { email: string; action: () => void; setError: (text: string) => void },
    { dispatch }
  ) => {
    try {
      const res = await postEmailForValidateRequest(email)
      if (!res.data.isExist) {
        dispatch(setAuthSlice({ checkEmailResult: 'valid' }))
        action()
      }
      return res
    } catch (e) {
      const error = e as { response: { data: { email: string } } }
      dispatch(setAuthSlice({ checkEmailResult: 'invalid' }))
      if (error?.response?.data?.email === 'INVALID_EMAIL') {
        setError('Please enter a valid email address')
        return Promise.reject(e)
      }
      setError('This email is already in use by another user')
      return Promise.reject(e)
    }
  }
)

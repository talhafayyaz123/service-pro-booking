import { createSlice } from '@reduxjs/toolkit'

import { ICardData } from '@/components/cards/SearchLongCard'
import {
  getRecentlyThunk,
  getTopRatedThunk,
} from '@/store/topRated/topRatedRequests'
import { IResponseData } from '@/types/common'

interface IInitialState {
  recently: IResponseData<ICardData>
  topRated: IResponseData<ICardData>
}

const initialState: IInitialState = {
  recently: {
    data: [],
    total: 0,
    status: false,
  },
  topRated: {
    data: [],
    total: 0,
    status: false,
  },
}
const topRatedSlice = createSlice({
  name: 'topRated',
  initialState,
  reducers: {
    //
  },
  extraReducers: (builder) => {
    builder.addCase(getRecentlyThunk.pending, (state) => {
      state.recently.status = true
    })
    builder.addCase(getRecentlyThunk.fulfilled, (state, { payload }) => {
      state.recently.status = false
      state.recently = payload
    })
    builder.addCase(getRecentlyThunk.rejected, (state) => {
      state.recently.status = false
    })

    ///top rated
    builder.addCase(getTopRatedThunk.pending, (state) => {
      state.topRated.status = true
    })
    builder.addCase(getTopRatedThunk.fulfilled, (state, { payload }) => {
      state.topRated.status = false
      state.topRated = payload
    })
    builder.addCase(getTopRatedThunk.rejected, (state) => {
      state.topRated.status = false
    })
  },
})

export const topRated = topRatedSlice.reducer

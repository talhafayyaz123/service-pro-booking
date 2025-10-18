import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface State {
  lat: string | null
  lng: string | null
}

const initialState: State = {
  lat: null,
  lng: null,
}

export const currentPositionSlice = createSlice({
  name: 'currentPositon',
  reducers: {
    setCurrentPosition: (state, { payload }: PayloadAction<State>) => {
      state.lat = payload.lat
      state.lng = payload.lng
    },
  },
  initialState,
})

export const { setCurrentPosition } = currentPositionSlice.actions

export const currentPosition = currentPositionSlice.reducer

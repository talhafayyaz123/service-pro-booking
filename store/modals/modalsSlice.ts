import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { MODALS_TYPE } from '@/core/consts/common'

interface IModalState {
  currentModal?: MODALS_TYPE
  text?: string
  subText?: string
  action?: (params: any) => void
  deleteAction?: () => void
  state?: Record<string, any>
}

const initialState: IModalState = {}

const modalsSlice = createSlice({
  name: 'modals/slice',
  initialState,
  reducers: {
    setModal: (state, action: PayloadAction<IModalState>) => ({
      ...action.payload,
    }),
  },
  // extraReducers: (builder) => {},
})
export const modals = modalsSlice.reducer
export const modalsActions = modalsSlice.caseReducers
export const { setModal } = modalsSlice.actions

import { createSelector } from 'reselect'

import { RootStateType } from '@/store/rootStore'

const auth = (state: RootStateType) => state.auth

export const authSelector = createSelector(auth, (items) => {
  return { ...items }
})

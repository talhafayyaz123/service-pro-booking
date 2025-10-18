import { createSelector } from 'reselect'

import { RootStateType } from '@/store/rootStore'

const modals = (state: RootStateType) => state.modals

export const modalsSelector = createSelector(modals, (args) => {
  return { ...args }
})

import { createSelector } from 'reselect'

import { RootStateType } from '@/store/rootStore'

const topRated = (state: RootStateType) => state.topRated

export const recentlySelector = createSelector(topRated, ({ recently }) => {
  return {
    recently: recently.data,
    total: recently.total,
    status: recently.status || false,
  }
})

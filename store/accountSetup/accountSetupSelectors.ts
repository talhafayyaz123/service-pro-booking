import { createRef } from 'react'
import { createSelector } from 'reselect'

import { RootStateType } from '@/store/rootStore'

export const accountSetupSelector = (state: RootStateType) => state.accountSetup
export const mainCategoriesSelector = createSelector(
  accountSetupSelector,
  ({ categories, isLoading }) => {
    return {
      categories: categories.map((e) => ({
        ...e,
        ref: createRef<HTMLDivElement>(),
      })),
      status: isLoading,
    }
  }
)

export const availabilitySelector = createSelector(
  accountSetupSelector,
  ({ availability, proAvailability }) => {
    return { availability: availability || [], proAvailability }
  }
)

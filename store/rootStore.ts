import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { booking } from '@/features/booking/store/bookingStore'
import { bookings } from '@/features/bookings/store/bookingsStore'
import { customForm, customFormApi } from '@/features/customForm/store/slice'
import { mainPageApi } from '@/features/homePage/store/store'
import { paymentLinkApi } from '@/features/paymentLink/store/paymentLinkApi'
import { profile } from '@/features/profile/store/profileSlice'
import { searchHeader } from '@/features/searchHeader/store/searchHeaderSlice'
import { faqApi } from '@/features/userProfile/store/userProfileRequests'
import {
  userProfile,
  userProfileApi,
} from '@/features/userProfile/store/userProfileSlice'
import { accountSetup } from '@/store/accountSetup/accountSetupSlice'
import { auth } from '@/store/auth/authSlice'
import { billingMethods } from '@/store/billingMethodsStore/billingMethodsSlice'
import { follow } from '@/store/commonStor/following/followSlice'
import { homepage } from '@/store/commonStor/homePage/homepageSlice'
import { inspirations } from '@/store/commonStor/inspirations/insirationSlice'
import { inspirationApi } from '@/store/commonStor/inspirations/inspirationsRequests'
import { me } from '@/store/me/meSlice'
import { onboardingApi } from '@/store/onboarding/onboardingApi'
import { topRated } from '@/store/topRated/topRatedSlice'

import { currentPosition } from './currentPosition/currentPositionSlice'
import { modals } from './modals/modalsSlice'

const reducers = {
  searchHeader,
  modals,
  auth,
  me,
  billingMethods,
  accountSetup,
  inspirations,
  topRated,
  profile,
  homepage,
  follow,
  booking,
  bookings,
  userProfile,
  currentPosition,
  [faqApi.reducerPath]: faqApi.reducer,
  [inspirationApi.reducerPath]: inspirationApi.reducer,
  [customFormApi.reducerPath]: customFormApi.reducer,
  [mainPageApi.reducerPath]: mainPageApi.reducer,
  [userProfileApi.reducerPath]: userProfileApi.reducer,
  [paymentLinkApi.reducerPath]: paymentLinkApi.reducer,
  [onboardingApi.reducerPath]: onboardingApi.reducer,
  customForm,
}

export const rootReducer = combineReducers(reducers)
export type RootStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<RootStore['getState']>
const makeStore = ({ isServer }: any) => {
  if (isServer) {
    return configureStore({
      reducer: rootReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        })
          .concat(faqApi.middleware)
          .concat(inspirationApi.middleware)
          .concat(customFormApi.middleware)
          .concat(userProfileApi.middleware)
          .concat(mainPageApi.middleware)
          .concat(paymentLinkApi.middleware)
          .concat(onboardingApi.middleware),
    })
  } else {
    const persistConfig = {
      key: 'root',
      storage: storage,
      whitelist: ['searchHeader'],
      // whitelist: reducersKeys.filter((key) => key !== 'searchHeader'),
    }
    const persistedReducer = persistReducer(persistConfig, rootReducer)
    const state = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        })
          .concat(faqApi.middleware)
          .concat(inspirationApi.middleware)
          .concat(customFormApi.middleware)
          .concat(userProfileApi.middleware)
          .concat(mainPageApi.middleware)
          .concat(paymentLinkApi.middleware)
          .concat(onboardingApi.middleware),
    })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    state.__persisitor = persistStore(state)
    return state
  }
}

const store = makeStore({ isServer: false })

export const wrapper = createWrapper<RootStore>(makeStore, { debug: false })

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export type RootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

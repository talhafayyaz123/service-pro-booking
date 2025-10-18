import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/types/types-external'
import moment from 'moment'
import { HYDRATE } from 'next-redux-wrapper'
import uuid from 'react-uuid'

import { defaultPhoneCode, phoneOptions } from '@/core/consts/countries'
import timezones from '@/core/consts/timezones.json'
import { formatTimeTo12 } from '@/features/accountSetup/helpers/sixOnSubmit'
import {
  getMainOfServicesThunk,
  getOnboardingInfoThunk,
} from '@/store/accountSetup/accountSetupRequests'
import { ICategory } from '@/types/categoriesTypes'
import {
  CurrentWorkHours,
  IOnboardingFormState,
  IOnboardingRequest,
  TSelected,
} from '@/types/onboarding'

interface IInitialState {
  categories: ICategory[]
  copySelectedAvailability: {
    selected: TSelected[]
    data?: { from: string; to: string; weekday: TSelected }
  }
  isLoading: boolean
  image: {
    original: string
    cropped: string
  }[]
  copyAvailabilityActions: Record<string, any>[]
  onboarding?: Partial<IOnboardingFormState<CurrentWorkHours[]>>
  onboardingStatus: boolean
  availability: CurrentWorkHours[]
  proAvailability: IOnboardingFormState['proAvailability']
}

const initialState: IInitialState = {
  categories: [],
  copySelectedAvailability: {
    selected: [],
  },
  onboardingStatus: true,
  image: [],
  proAvailability: {
    window: { value: '' },
    canBook: { value: '' },
    maxBooking: { value: '' },
    timezone: null,
  },
  copyAvailabilityActions: [],
  availability: [],
  isLoading: true,
}

const accountSetupSlice = createSlice({
  name: 'accountSetupSlice',
  initialState,
  reducers: {
    setAccountSetup: (
      state,
      { payload }: PayloadAction<Partial<IInitialState>>
    ) => ({ ...state, ...payload }),
    setOnboardingData: (
      state,
      { payload }: PayloadAction<IOnboardingRequest>
    ) => {
      setOnboardingTransformData(state, payload)
    },
    setCategories: (state, { payload }) => {
      state.categories = payload.categories
    },
    setImage: (
      state,
      {
        payload,
      }: {
        payload: {
          image: { original: string; cropped: string }[]
        }
      }
    ) => {
      state.image = payload.image
    },
    replaceTime: (
      state,
      {
        payload,
      }: PayloadAction<{
        from: string
        to: string
        index?: number
        weekday: TSelected
      }>
    ) => {
      const a = state.availability.map((el) => {
        if (el.weekday === payload.weekday) {
          return {
            ...el,
            timePeriods: el.timePeriods.map((t, index) => {
              if (index === payload.index) {
                return {
                  from: payload.from,
                  to: payload.to,
                  weekday: payload.weekday,
                }
              } else {
                return t
              }
            }),
          }
        }
        return el
      })
      state.availability = [...a]
    },
    setCopySelectedAvailability: (
      state,
      { payload }: PayloadAction<TSelected>
    ) => {
      const selected = state.copySelectedAvailability.selected
      if (payload === 'all') {
        state.copySelectedAvailability.selected = selected.includes('all')
          ? []
          : ['all']
      } else if (selected.includes(payload)) {
        state.copySelectedAvailability.selected = selected.filter(
          (day) => day !== payload && day !== 'all'
        )
      } else {
        state.copySelectedAvailability.selected = [
          ...selected.filter((day) => day !== 'all'),
          payload,
        ]
      }
    },
    replaceSupData: (
      state,
      {
        payload,
      }: PayloadAction<{
        type?: 'append' | 'update' | 'copy' | 'remove'
        from?: string
        selected?: TSelected[]
        to?: string
        id: TSelected
        index?: number
        weekday: TSelected
      }>
    ) => {
      const { id, type, index, selected, ...rest } = payload
      if (type === 'append') {
        state.availability = state?.availability?.map((el) => {
          return id === el.weekday
            ? {
                ...el,
                timePeriods: [...el.timePeriods, rest],
              }
            : el
        })
      } else if (type === 'update') {
        state.availability = state?.availability?.map((el) =>
          el.weekday === id
            ? {
                ...el,
                timePeriods: [
                  ...el.timePeriods.map((item) =>
                    item.weekday === id ? rest : el
                  ),
                ],
              }
            : el
        )
      } else if (type === 'copy') {
        const weekDayWorkingHours = state.availability.find(
          (w) => w.weekday === rest.weekday
        )
        state.availability = state?.availability?.map((el) => {
          if (selected?.includes('all')) {
            return el.weekday === id
              ? el
              : {
                  ...el,
                  active: true,
                  timePeriods:
                    weekDayWorkingHours?.timePeriods.map((w) => ({
                      ...w,
                      weekday: el.weekday,
                    })) || [],
                }
          } else if (selected?.includes(el.weekday)) {
            return {
              ...el,
              active: true,
              timePeriods:
                weekDayWorkingHours?.timePeriods.map((w) => ({
                  ...w,
                  weekday: el.weekday,
                })) || [],
            }
          }
          return el
        })
      } else if (type === 'remove') {
        state.availability = state.availability.map((item) => {
          return {
            ...item,
            timePeriods:
              item.weekday === rest.weekday
                ? item.timePeriods.filter((el, ind) => index !== ind)
                : item.timePeriods,
          }
        })
      }
    },
    setAvailability: (
      state,
      {
        payload,
      }: PayloadAction<
        Partial<CurrentWorkHours> & { type?: 'append' | 'update'; id: string }
      >
    ) => {
      const { id, ...rest } = payload

      state.availability = state?.availability?.map((el) =>
        el.weekday === id ? { ...el, ...rest } : el
      )
    },
    clearCopySelected: (state) => {
      state.copySelectedAvailability = {
        selected: [],
      }
    },
    setProAvailability: (
      state,
      {
        payload,
      }: PayloadAction<Partial<IOnboardingFormState['proAvailability']>>
    ) => {
      if (payload) {
        state.proAvailability = { ...state.proAvailability, ...payload }
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: any) => ({
      ...state,
      ...action.payload.accountSetup,
    }))
    builder.addCase(getMainOfServicesThunk.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getMainOfServicesThunk.fulfilled, (state, { payload }) => {
      state.categories = payload.data.categories
      state.isLoading = false
    })
    builder.addCase(getMainOfServicesThunk.rejected, (state) => {
      state.isLoading = false
    })
    builder.addCase(getOnboardingInfoThunk.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getOnboardingInfoThunk.fulfilled, (state, { payload }) => {
      payload?.data && setOnboardingTransformData(state, payload?.data)
    })
    builder.addCase(getOnboardingInfoThunk.rejected, (state) => {
      state.isLoading = false
    })
  },
})

const setOnboardingTransformData = (
  state: WritableDraft<IInitialState>,
  payload: IOnboardingRequest
) => {
  const workHours = (moment.weekdaysShort().map((weekday) => {
    weekday = weekday.toLowerCase()

    const content =
      payload?.workHours &&
      payload?.workHours
        .filter((el) => el.weekday.toLowerCase() === weekday)
        .map((el) => ({
          from: `${formatTimeTo12(el.from)}`,
          to: `${formatTimeTo12(el.to)}`,
          weekday: el.weekday,
        }))

    return {
      timePeriods:
        content && content.length > 0
          ? content
          : [{ from: '', to: '', weekday }],
      weekday,
      active: !!content?.length,
    }
  }) || []) as CurrentWorkHours[]

  state.onboarding = {
    ...payload,
    birthday: payload.birthday
      ? moment(payload.birthday).utc(false).toDate()
      : null,
    proAvailability: {
      window: { value: payload?.proAvailability?.window || 0 },
      canBook: { value: payload?.proAvailability?.canBook || '' },
      maxBooking: {
        value: payload?.proAvailability?.maxBooking || '',
      },
      timezone: null,
    },
    workHours,
    proContacts: {
      email: payload?.proContacts?.email || '',
      phone: payload?.proContacts?.phone || '',
      emailCheckbox: !!payload.proContacts?.email,
      phoneCheckbox: !!payload.proContacts?.phone,
      phoneCode: payload?.proContacts?.phoneCode
        ? phoneOptions.find(
            (el) => el.value === payload?.proContacts?.phoneCode
          ) || defaultPhoneCode
        : defaultPhoneCode,
    },
    additionalInfo: {
      ...payload.additionalInfo,
      bio: payload?.additionalInfo?.bio || '',
      additionalPolicies: payload?.additionalInfo?.additionalPolicies || '',
      portfolioPhotos: payload?.additionalInfo?.portfolioPhotos || [],
      links:
        payload.additionalInfo && payload.additionalInfo.links.length > 0
          ? payload.additionalInfo.links.map((link) => ({ link }))
          : [{ link: '' }],
    },
    categories:
      payload.categories && payload.categories.length > 0
        ? payload.categories
            .filter((el) => el.id !== payload.mainCategoryId)
            .reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
        : [],

    services: payload?.services?.length
      ? payload.services
      : payload?.categories?.map((item, index) => ({
          ...item,
          order: index,
          categories: [],
          id: uuid(),
          color: '',
        })),
    businessDetails: {
      address: '',
      isInPerson: false,
      isMobile: false,
      isVirtual: false,
      name: null,
      businessName: '',
      countryCode: '',
    },
    businessDetail: {
      address: '',
      isInPerson: false,
      isMobile: false,
      isVirtual: false,
      name: null,
      businessName: '',
      countryCode: '',
    },
  }
  state.availability = workHours.map((el) => ({ ...el, id: el.weekday }))
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  state.proAvailability = {
    window: {
      value:
        payload?.proAvailability?.window === null
          ? ''
          : (payload?.proAvailability?.window as number),
    },
    canBook: { value: payload?.proAvailability?.canBook || '' },
    maxBooking: {
      value: payload?.proAvailability?.maxBooking || '',
    },
    timezone:
      (payload.proAvailability?.timezone &&
      payload.proAvailability?.timezone !== 'GMT'
        ? timezones.find((t) => t.value === payload.proAvailability?.timezone)
        : timezones.find((t) => t.value === userTimezone)) || null,
  }
  state.isLoading = false
}

export const accountSetup = accountSetupSlice.reducer
export const {
  setAccountSetup,
  replaceTime,
  replaceSupData,
  setOnboardingData,
  setAvailability,
  setCategories,
  setImage,
  clearCopySelected,
  setProAvailability,
  setCopySelectedAvailability,
} = accountSetupSlice.actions

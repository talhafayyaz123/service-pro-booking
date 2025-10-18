import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { UserSourceTypeEnum } from '@/core/helpers/calculateDepositBE'
import {
  confirmBookingRequest,
  getAddonsFromProRequest,
  getBookingDateWindow,
  getChooseServiceForBooking,
  getPeriodWindows,
  getTermsOfPaymentByPro,
  getUserSavedCards,
} from '@/features/booking/store/bookingRequests'
import { IQuestion } from '@/features/customForm/types'
import { TBookingCardStatus, TRefundStatus } from '@/types/booking'
import { IService } from '@/types/categoriesTypes'
import { IChip, IOptions, IResponseData, ITermsOfPayment } from '@/types/common'
import { ISavedCard } from '@/types/payment'

export const initBookingState = {
  date: JSON.parse(JSON.stringify(new Date())),
  comment: '',
  startTime: JSON.parse('null'),
  policies: false,
  useWallet: false,
}

export type TSteps = 1 | 2
export interface IAddOn {
  id: string
  price: number
  description: string
  duration: number
  title: string
}
interface IBookingData {
  date: Date | null
  comment: string
  policies: boolean
  paymentMethod?: IOptions
  address?: string
  startTime?: IChip
  location?: { lat: number; lng: number }
  isLocallySetted?: boolean
  useWallet: boolean
  proSource?: keyof typeof UserSourceTypeEnum
}

export interface IBookingReference {
  id: string
  isMobile: boolean
}
export interface IBookingInitialState {
  services: IResponseData<IBookingServices>
  termsOfPayment: Partial<ITermsOfPayment> & { result: boolean }
  addedServices: IService[]
  addedReferenceServices: IBookingReference[]
  bookingRegistrationStep?: 'entering-data' | 'otp'
  data: IBookingData
  step: TSteps
  isSubmitting?: boolean
  isConfirmDisabled?: boolean
  paymentStatusNew?: {
    status?: TBookingCardStatus | TRefundStatus | string
    bookingId?: string
  }
  addOns: {
    status: boolean
    data?: Record<string, IAddOn>
    selectedIds: string[]
  }
  payment: {
    paymentOption?: 'KLARNA' | 'AFTERPAY' | 'AFFIRM'
    paymentError: boolean
    isPaymentProcessing: boolean
    bookingId: null | string
    useAnotherCard: boolean
    isDetailsCompleted: boolean
    selectedCard: ISavedCard | null
    isDefault: boolean
  }
  errorMessage?: string
  confirmStatus: boolean
  window: {
    data: IBookingWindow
    status: boolean
  }
  periodWindows: {
    data: IBookingPeriodWindow[]
    status: boolean
  }
  savedCards: {
    loading: boolean
    data: ISavedCard[]
  }
}

interface IBookingServices {
  category: string
  id: string
  services: IService[]
}
export interface IBookingWindow {
  from?: string
  result: boolean
  to?: string
  windows?: string[]
}
export interface IBookingPeriodWindow {
  date: string
  windows: string[]
  timeSlots: { from: string; to: string }[]
}

const initialState: IBookingInitialState = {
  services: {
    data: [],
    total: 0,
    status: false,
  },
  isSubmitting: false,
  isConfirmDisabled: true,
  addOns: {
    status: true,
    selectedIds: [],
  },
  termsOfPayment: {
    result: false,
  },
  addedServices: [],
  addedReferenceServices: [],
  data: initBookingState,
  confirmStatus: false,
  step: 1,
  paymentStatusNew: {
    status: '',
    bookingId: '',
  },
  payment: {
    paymentError: false,
    isPaymentProcessing: false,
    bookingId: null,
    isDetailsCompleted: false,
    useAnotherCard: false,
    selectedCard: null,
    isDefault: false,
  },
  errorMessage: '',
  window: {
    data: { result: false },
    status: false,
  },
  periodWindows: {
    data: [],
    status: false,
  },
  savedCards: {
    loading: false,
    data: [],
  },
}

const bookingSlice = createSlice({
  name: 'bookingSlice',
  initialState,
  reducers: {
    selectAddon: (state, { payload }: PayloadAction<string | string[]>) => {
      const allAddedIds = state.addOns.selectedIds
      if (typeof payload === 'string') {
        state.addOns.selectedIds = state.addOns.selectedIds.includes(payload)
          ? allAddedIds.filter((id) => id !== payload)
          : [...state.addOns.selectedIds, payload]
      } else {
        state.addOns.selectedIds = payload
      }
    },
    setBookingData: (
      state,
      { payload }: PayloadAction<Partial<IBookingData>>
    ) => {
      state.data = { ...state.data, ...payload }
    },
    clearBookingData: () => {
      return initialState
    },
    setAddress: (
      state,
      { payload }: PayloadAction<IBookingInitialState['data']['address']>
    ) => {
      state.data.address = payload
    },
    setBookingErrorMessage: (state, { payload }: PayloadAction<string>) => {
      state.errorMessage = payload
    },
    setLocation: (
      state,
      { payload }: PayloadAction<IBookingInitialState['data']['location']>
    ) => {
      state.data.location = payload
    },
    updatePaymentState: (
      state,
      { payload }: PayloadAction<Partial<IBookingInitialState['payment']>>
    ) => {
      state.payment = { ...state.payment, ...payload }
    },
    updatePaymentOption: (
      state,
      { payload }: PayloadAction<Partial<IBookingInitialState['payment']>>
    ) => {
      state.payment = { ...state.payment, ...payload }
    },
    addServiceById: (state, { payload }: PayloadAction<string>) => {
      const service = state.services.data
        .map((el) => el.services)
        .flat()
        .find((el) => el.id === payload)
      service && state.addedServices.push(service)
    },
    setReferenceServices: (
      state,
      { payload }: PayloadAction<IBookingReference | IBookingReference[]>
    ) => {
      if (!Array.isArray(payload)) {
        state.addedReferenceServices = [
          ...state.addedReferenceServices,
          payload,
        ]
      } else {
        state.addedReferenceServices = payload
      }
    },
    deleteReferenceServices: (
      state,
      { payload }: PayloadAction<string | undefined>
    ) => {
      if (!payload) {
        state.addedReferenceServices = []
      } else {
        state.addedReferenceServices = state.addedReferenceServices.filter(
          (el) => el.id !== payload
        )
      }
    },
    addServicesById: (state, { payload }: PayloadAction<string[]>) => {
      state.addedServices = state.services.data
        .map((el) => el.services)
        .flat()
        .filter((el) => payload.includes(el?.id || ''))
    },
    addServices: (state, { payload }: PayloadAction<IService[]>) => {
      state.addedServices = payload
    },
    deleteService: (state, { payload }: PayloadAction<string>) => {
      state.addedServices = state.addedServices.filter(
        (el) => el.id !== payload
      )
    },
    updatePaymentStatus: (
      state,
      { payload }: PayloadAction<{ status: string; bookingId: string }>
    ) => {
      state.paymentStatusNew = { ...state.paymentStatusNew, ...payload }
    },
    setStep: (state, { payload }: PayloadAction<TSteps>) => {
      state.step = payload
    },
    setIsSubmitting: (state, { payload }: PayloadAction<boolean>) => {
      state.isSubmitting = payload
    },
    setIsConfirmDisabled: (state, { payload }: PayloadAction<boolean>) => {
      state.isConfirmDisabled = payload
    },
    setBookingRegistrationStep: (
      state,
      {
        payload,
      }: PayloadAction<
        IBookingInitialState['bookingRegistrationStep'] | undefined
      >
    ) => {
      state.bookingRegistrationStep = payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChooseServiceForBooking.pending, (state) => {
      state.services.status = true
    })
    builder.addCase(
      getChooseServiceForBooking.fulfilled,
      (state, { payload }) => {
        state.services.data = payload.data.categoriesBlock.map((e) => ({
          category: e.name,
          id: e.id,
          services: e.categories,
        }))

        state.services.status = false
      }
    )
    builder.addCase(getChooseServiceForBooking.rejected, (state) => {
      state.services.status = false
    })
    // get saved cards
    builder.addCase(getUserSavedCards.pending, (state) => {
      state.savedCards.loading = true
    })
    builder.addCase(getUserSavedCards.fulfilled, (state, { payload }) => {
      state.savedCards = {
        loading: false,
        data: payload,
      }
    })

    builder.addCase(getUserSavedCards.rejected, (state) => {
      state.savedCards.loading = false
    })
    //window
    builder.addCase(getBookingDateWindow.pending, (state) => {
      state.window.status = true
    })
    builder.addCase(getBookingDateWindow.fulfilled, (state, { payload }) => {
      state.window.data = payload.data
      state.window.status = false
    })
    builder.addCase(getBookingDateWindow.rejected, (state) => {
      state.window.data = { result: false, windows: [] }
      state.window.status = false
    })

    // period-windows getPeriodWindows
    builder.addCase(getPeriodWindows.pending, (state) => {
      state.periodWindows.status = true
    })
    builder.addCase(getPeriodWindows.fulfilled, (state, { payload }) => {
      state.periodWindows.data = payload.data.results
      state.periodWindows.status = false
    })
    builder.addCase(getPeriodWindows.rejected, (state) => {
      state.periodWindows.status = false
    })
    //confirm
    builder.addCase(confirmBookingRequest.pending, (state) => {
      state.confirmStatus = true
    })
    builder.addCase(confirmBookingRequest.fulfilled, (state) => {
      state.confirmStatus = false
    })
    builder.addCase(confirmBookingRequest.rejected, (state) => {
      state.confirmStatus = false
    })

    //deposit
    builder.addCase(getTermsOfPaymentByPro.fulfilled, (state, { payload }) => {
      state.termsOfPayment = { ...payload, result: true }
    })

    builder.addCase(getTermsOfPaymentByPro.rejected, (state) => {
      state.termsOfPayment = {
        result: false,
      }
    })

    //addons

    builder.addCase(getAddonsFromProRequest.pending, (state) => {
      state.addOns.status = true
    })
    builder.addCase(getAddonsFromProRequest.fulfilled, (state, { payload }) => {
      state.addOns.status = false
      state.addOns.data = payload.reduce(
        (acc, addon) => ({ ...acc, [addon.id]: addon }),
        {}
      )
    })
    builder.addCase(getAddonsFromProRequest.rejected, (state) => {
      state.addOns.status = false
    })
  },
})

export const booking = bookingSlice.reducer
export const {
  setBookingData,
  deleteService,
  addServicesById,
  addServices,
  setStep,
  clearBookingData,
  setBookingErrorMessage,
  setReferenceServices,
  deleteReferenceServices,
  updatePaymentState,
  updatePaymentOption,
  selectAddon,
  setIsConfirmDisabled,
  setIsSubmitting,
  setBookingRegistrationStep,
  updatePaymentStatus,
} = bookingSlice.actions

export interface ITemplateForm {
  title: string
  description: string
  id?: string
  isRequired?: boolean
  isAnswered?: boolean
  questions: IQuestion[]
}

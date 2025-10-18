import { create } from 'zustand'

import { initialStore } from '@/features/paymentLink/store/constatnts'
import {
  IPaymentCreds,
  IPaymentStore,
} from '@/features/paymentLink/store/types'

const LOCAL_STORAGE_KEY = 'paymentStore'

export const loadFromLocalStorage = (
  currentLinkId?: string
): Omit<IPaymentStore, 'setStore' | 'setPaymentCreds'> | null => {
  try {
    const storedState = localStorage.getItem(LOCAL_STORAGE_KEY)

    if (storedState) {
      const state = JSON.parse(storedState)
      if (currentLinkId && currentLinkId !== state.linkId) {
        return null
      }
      return state
    }
  } catch (error) {
    console.error('Error loading from localStorage', error)
  }
  return null
}

export const saveToLocalStorage = (state: IPaymentStore) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state))
  } catch (error) {
    console.error('Error saving to localStorage', error)
  }
}

export const destroyLocalStoreData = () =>
  localStorage.removeItem(LOCAL_STORAGE_KEY)

const _initialStore = loadFromLocalStorage() || initialStore

export const usePaymentLinkStore = create<IPaymentStore>((set, get) => ({
  ..._initialStore,
  setStore: (params) => {
    const newState = { ...get(), ...params }
    set(newState)
    saveToLocalStorage(newState)
  },
  setPaymentCreds: (params: Partial<IPaymentCreds>) => {
    const data = get().paymentCreds
    const newState = {
      paymentCreds: {
        card: { ...data.card, ...(params.card ?? {}) },
        address: { ...data.address, ...(params?.address ?? {}) },
      },
    }
    set(newState)
    saveToLocalStorage(get())
  },
}))

type StepType = 'auth' | 'otp' | 'payment'
type BookingType = 'simple' | 'walkIn'

interface IDepositRequestedBooking {
  step: StepType
  changeStep: (step: StepType) => void
  bookingType: BookingType
  changeBookingType: (type: BookingType) => void
  isInfoPhotoUpload: boolean
  setIsInfoPhotoUpload: (value: boolean) => void
}

export const useDepositRequestedBookingStore = create<IDepositRequestedBooking>(
  (set) => ({
    step: 'auth',
    changeStep(step) {
      set({
        step,
      })
    },
    bookingType: 'simple',
    changeBookingType(type) {
      set({
        bookingType: type,
      })
    },
    isInfoPhotoUpload: false,
    setIsInfoPhotoUpload(value) {
      set({
        isInfoPhotoUpload: value,
      })
    },
  })
)

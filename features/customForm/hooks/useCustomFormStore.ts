import { create } from 'zustand'

interface ICustomFormStore {
  photoCropOpen: boolean
  setPhotoCropOpen: (value: boolean) => void
  lastOpenedCustomFormId?: string
  setLastOpenedCustomFormId: (value: string) => void
}

export const useCustomFormStore = create<ICustomFormStore>((set) => {
  return {
    photoCropOpen: false,
    setPhotoCropOpen(value) {
      set({
        photoCropOpen: value,
      })
    },
    lastOpenedCustomFormId: undefined,
    setLastOpenedCustomFormId(value) {
      set({ lastOpenedCustomFormId: value })
    },
  }
})

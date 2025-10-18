import { create } from 'zustand'

import { BookingSuccessModal } from '@/features/modalsConfig/modals/BookingSuccessModal'
import { OTPTroubleModal } from '@/features/modalsConfig/modals/OTPTroubleModal'
import { PaymentFailedModal } from '@/features/modalsConfig/modals/PaymentFailedModal'
import { ModalWrapperProps } from '@/features/modalsConfig/ModalWrapper'

export interface IModalFlowStore {
  currentModal: keyof ModalsConfig | null

  modalProps?: ModalsConfig[keyof ModalsConfig] extends React.ComponentType<
    infer P
  >
    ? P
    : never
  modalSettings?: Omit<ModalWrapperProps, 'children'>
  onClose: () => void
  open: (params: Partial<IModalFlowStore>) => void
}

export const useModalFlowStore = create<IModalFlowStore>((set, get) => ({
  currentModal: null,
  modalProps: undefined,
  modalSettings: undefined,
  onClose: () =>
    set({
      currentModal: null,
      modalProps: undefined,
      modalSettings: undefined,
    }),
  open: (params) => {
    set({ ...get(), ...params })
  },
}))

export const openModal = (params: Partial<IModalFlowStore>) => {
  useModalFlowStore.getState().open(params)
}

export const closeModal = () => {
  useModalFlowStore.getState().onClose()
}

export const modalConfig = {
  paymentFailedModal: PaymentFailedModal,
  OTPTroubleModal: OTPTroubleModal,
  bookingSuccessModal: BookingSuccessModal,
}

export type ModalsConfig = typeof modalConfig

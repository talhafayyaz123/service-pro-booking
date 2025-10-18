import { useMemo } from 'react'

import {
  modalConfig,
  useModalFlowStore,
} from '@/features/modalsConfig/modalConfig'
import { ModalWrapper } from '@/features/modalsConfig/ModalWrapper'

export const ModalRender = () => {
  const { currentModal, modalProps, modalSettings, onClose } =
    useModalFlowStore((state) => state)

  const ModalComponent = useMemo(
    () => (currentModal ? modalConfig[currentModal] : () => <></>),
    [currentModal]
  )

  return currentModal ? (
    <ModalWrapper {...(modalSettings ?? {})} onClose={onClose}>
      <ModalComponent {...(modalProps ?? {})} />
    </ModalWrapper>
  ) : null
}

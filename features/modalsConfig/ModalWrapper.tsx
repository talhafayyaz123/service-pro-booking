import { Dialog, Transition } from '@headlessui/react'
import { Property } from 'csstype'
import { Fragment, ReactNode } from 'react'

import { useHideScroll } from '@/components/modals/hooks/useHideScroll'
import { closeModal } from '@/features/modalsConfig/modalConfig'

export interface ModalWrapperProps {
  outsideClose?: boolean
  onClose?: () => void
  maxWidth?: Property.MaxWidth<string | number>
  children: ReactNode
}
export const ModalWrapper = ({
  outsideClose = true,
  onClose,
  maxWidth,
  children,
}: ModalWrapperProps) => {
  useHideScroll(true)

  const handleCloseModal = onClose ?? closeModal

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[100000] bg-black"
        onClose={outsideClose ? handleCloseModal : () => null}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-50"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel
              style={{ maxWidth: maxWidth ?? 750 }}
              className={
                'bg-white w-full min-w-[320px] overflow-hidden max-h-[90vh]   flex flex-col flex-nowrap rounded-2xl'
              }
            >
              {children}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

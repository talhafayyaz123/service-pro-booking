import { Dialog, Transition } from '@headlessui/react'
import classNames from 'classnames'
import { Property } from 'csstype'
import { Fragment, ReactNode } from 'react'

import { CloseButton } from '@/components/common/buttons/CloseButton'
import { useHideScroll } from '@/components/modals/hooks/useHideScroll'
import { IMPORTANT_CLASS_NAMES } from '@/core/consts/common'

export interface ModalProps {
  outsideClose?: boolean
  closeButton?: boolean
  onClose: () => void
  title?: ReactNode
  showHeader?: boolean
  maxWidth?: Property.MaxWidth<string | number>
  children: ReactNode
  footer?: ReactNode
  isOpen: boolean
  contentClassName?: string
}
export const NewModal = ({
  outsideClose,
  isOpen = false,
  showHeader = true,
  onClose,
  closeButton = true,
  title,
  maxWidth,
  children,
  footer,
  contentClassName = '',
}: ModalProps) => {
  useHideScroll(isOpen)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`${IMPORTANT_CLASS_NAMES.UNCLOSE_CLASSNAME} relative z-[100000] bg-black`}
        onClose={outsideClose ? onClose : () => null}
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
        <div className="fixed flex items-center justify-center inset-0">
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
                'bg-white w-full min-w-[320px] overflow-hidden  pt-4 max-h-[90vh] tablet:max-h-[70vh] desktop:max-h-[60vh] flex flex-col flex-nowrap rounded-[16px] '
              }
            >
              <ModalHeader
                onClose={onClose}
                showHeader={showHeader}
                title={title}
                closeButton={closeButton}
              />
              <div className={' flex-grow overflow-auto px-6'}>
                <div className={classNames('py-3', contentClassName)}>
                  {children}
                </div>
              </div>
              {footer && (
                <div
                  className={
                    'h-fit flex-shrink-0 px-6 py-4 border-t border-lightGray shadow-xl'
                  }
                >
                  {footer}
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

const ModalHeader = ({
  closeButton,
  onClose,
  title,
  showHeader,
}: Pick<ModalProps, 'title' | 'closeButton' | 'onClose' | 'showHeader'>) => {
  return showHeader ? (
    <div
      className={`flex items-center justify-between gap-3 h-fit flex-shrink-0 border-b border-lightGray pb-3 px-6`}
    >
      <div />
      {title && title}
      {closeButton ? <CloseButton onClick={onClose} /> : <div />}
    </div>
  ) : (
    <div />
  )
}

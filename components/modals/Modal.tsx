import { Dialog, Transition } from '@headlessui/react'
import { Fragment, ReactNode, useCallback } from 'react'

import { CloseButton } from '@/components/common/buttons/CloseButton'
import { useHideScroll } from '@/components/modals/hooks/useHideScroll'
import { IMPORTANT_CLASS_NAMES, MODALS_TYPE } from '@/core/consts/common'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'

interface IModal {
  onClose: () => void
  isOpen: boolean
  children: ReactNode
  outsideClose?: boolean
  onCloseButton?: boolean
  title?: ReactNode
  noHeader?: boolean
  maxWidth?: number
  space?: string
  divider?: boolean
  titleClassName?: string
  className?: string
  wrapperClassName?: string
  fromBottom?: boolean
  hideTransition?: boolean
  closeButtonClassName?: string
  isAppLayout?: boolean
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  outsideClose = true,
  onCloseButton = true,
  title,
  space = 'py-8  px-5 small:px-10',
  noHeader = false,
  maxWidth,
  divider,
  titleClassName = '',
  className = '',
  wrapperClassName = '',
  hideTransition = false,
  fromBottom,
  closeButtonClassName,
  isAppLayout = true,
}: IModal) => {
  useHideScroll(isOpen)

  const transition = {
    enter: 'ease-out duration-300',
    enterFrom: 'opacity-0 scale-95',
    enterTo: 'opacity-100 scale-100',
    leave: 'ease-in duration-50',
    leaveFrom: 'opacity-100 scale-100',
    leaveTo: 'opacity-0 scale-95',
  }

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

        <div className="fixed inset-0 overflow-y-auto">
          <div
            id={isAppLayout ? 'app_layout' : undefined}
            className={`${
              wrapperClassName
                ? wrapperClassName
                : 'flex items-center justify-center small:p-1 text-center'
            } min-h-full `}
          >
            <Transition.Child
              as={Fragment}
              // enter="ease-out duration-300"
              // enterFrom="opacity-0 scale-95"
              // enterTo="opacity-100 scale-100"
              // leave="ease-in duration-50"
              // leaveFrom="opacity-100 scale-100"
              // leaveTo="opacity-0 scale-95"
              {...(!hideTransition && transition)}
            >
              <Dialog.Panel
                className={`bg-white relative  w-full ${
                  className ? className : 'rounded-3xl small:mx-6 my-10  mx-3'
                } ${space} min-w-[300px] ${maxWidth ? `w-full` : ''}`}
                style={{ maxWidth }}
              >
                {fromBottom ? (
                  <div className="rounded-sm bg-lightGray h-1 w-[70px] absolute left-1/2 -translate-x-1/2 top-4 small:hidden" />
                ) : null}
                {!noHeader && (
                  <>
                    <div
                      className={`flex items-center justify-between ${titleClassName}`}
                    >
                      {fromBottom ? null : <div className={'w-[34px]'} />}
                      {title && title}
                      {onCloseButton ? (
                        <CloseButton
                          className={closeButtonClassName}
                          onClick={onClose}
                        />
                      ) : (
                        <div />
                      )}
                    </div>
                    {divider && (
                      <div className="hidden h-px mx-8 bg-lightGray small:block" />
                    )}
                  </>
                )}
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export const useModalData = (modal: MODALS_TYPE) => {
  const dispatch = useAppDispatch()

  const { currentModal, ...rest } = useAppSelector(modalsSelector)
  const onCloseModal = useCallback(() => {
    dispatch(setModal({}))
  }, [dispatch])

  return {
    onCloseModal,
    isOpen: currentModal === modal,
    text: rest?.text || '',
    state: rest?.state,
  }
}

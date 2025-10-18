import { Transition } from '@headlessui/react'
import { ReactNode, useRef } from 'react'

import { IconClose } from '@/assets/icons/icons'
import { Spinner } from '@/components/Loaders'
import { hexToRGBA } from '@/core/helpers/hexToRGBA'
import { NotFound } from '@/features/errors/NotFound'
import { useClickOutside } from '@/hooks/useClickOutside'
import { TPageStatuses } from '@/types/common'

export const Drawer = ({
  isOpen,
  onClose,
  children,
  header,
  showHeaderClose = true,
  headerClassName,
  className,
  headerElemClassName,
  footer,
  footerClassName,
  status,
  clickOutside = true,
  closeOnModal = true,
}: {
  isOpen: boolean
  showHeaderClose?: boolean
  onClose: () => void
  children?: ReactNode
  header?: ReactNode
  headerClassName?: string
  className?: string
  headerElemClassName?: string
  footer?: ReactNode
  footerClassName?: string
  status: TPageStatuses
  clickOutside?: boolean
  closeOnModal?: boolean
}) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useClickOutside(ref, onClose, clickOutside, closeOnModal)
  return (
    <>
      <div
        style={
          isOpen
            ? { backgroundColor: hexToRGBA('#000', 0.8) }
            : { backgroundColor: hexToRGBA('#000', 0) }
        }
        className={`${
          isOpen
            ? 'fixed w-full h-full overflow-hidden top-0 right-0 z-[10]'
            : ''
        } transition-all duration-500 `}
      />
      <Transition show={isOpen}>
        <Transition.Child
          className={`fixed w-[560px] overflow-hidden z-[10] right-0 top-0 bg-white ${className}`}
          id={'app_layout'}
          enter="transition ease-in-out duration-300 transform"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          {status === 'loading' ? (
            <div className={'w-full h-full flex items-center justify-center'}>
              <Spinner />
            </div>
          ) : status === 'loaded' ? (
            <div
              ref={ref}
              id={'app_layout'}
              className={'grid grid-rows-[82px_1fr_auto] h-full relative'}
            >
              {header && (
                <div
                  className={`h-[82px] px-10 shadow-xl items-center flex justify-between sticky top-0 bg-white ${
                    headerClassName || ''
                  }`}
                >
                  <div className={headerElemClassName}> {header}</div>
                  {showHeaderClose && (
                    <div
                      role={'button'}
                      data-testid="drawer-close-button"
                      className={
                        'p-1.5 cursor-pointer hover:bg-lightGray hover:shadow-xl rounded-full transition'
                      }
                      onClick={onClose}
                    >
                      <IconClose className={'w-5 h-5 stroke-[#939DAA]'} />
                    </div>
                  )}
                </div>
              )}
              <div className={'overflow-y-auto flex-1 h-full '}>{children}</div>
              {footer && (
                <div
                  className={` top-[100%] h-fit w-full ${
                    footerClassName || ''
                  }`}
                >
                  {footer}
                </div>
              )}
            </div>
          ) : (
            <NotFound title={'No Items Found!'} />
          )}
        </Transition.Child>
      </Transition>
    </>
  )
}

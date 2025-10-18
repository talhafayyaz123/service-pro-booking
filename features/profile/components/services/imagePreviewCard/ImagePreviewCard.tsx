import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

import { IconClose } from '@/assets/icons/icons'
import { useHideScroll } from '@/components/modals/hooks/useHideScroll'
import { useModalData } from '@/components/modals/Modal'
import { IMPORTANT_CLASS_NAMES, MODALS_TYPE } from '@/core/consts/common'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const ImagePreviewCard = ({ image }: { image?: string | null }) => {
  const dispatch = useAppDispatch()
  const handleOpenPreview = () => {
    dispatch(
      setModal({
        currentModal: MODALS_TYPE.PROFILE_IMAGE_PREVIEW_MODAL,
        state: { image },
      })
    )
  }

  return (
    <>
      {image ? (
        <button
          onClick={handleOpenPreview}
          className="w-14 h-12 rounded-lg bg-[#C4C4C4] mr-4"
          style={{
            backgroundImage: `url(${image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      ) : null}
    </>
    // <button
    //   className={
    //     'h-[70px] w-[70px] flex justify-center rounded-[12px] overflow-hidden hover:shadow-xl cursor-pointer transition'
    //   }
    //   onClick={handleOpenPreview}
    // >
    //   <Image
    //     className={'object-center'}
    //     width={100}
    //     height={100}
    //     alt={'alt'}
    //     objectFit={'cover'}
    //     src={img || Img}
    //   />
    // </button>
  )
}

export const ImagePreviewModal = () => {
  const { isOpen, onCloseModal, state } = useModalData(
    MODALS_TYPE.PROFILE_IMAGE_PREVIEW_MODAL
  )

  const onKeyDown = (e: { code: string }) => {
    if (e.code === 'Escape') {
      onCloseModal()
    }
  }
  useHideScroll(isOpen)

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={`${IMPORTANT_CLASS_NAMES.UNCLOSE_CLASSNAME} relative z-[100000] bg-black`}
        onClose={() => null}
        onKeyDown={onKeyDown}
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
          <div className="fixed inset-0 bg-black bg-opacity-80" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <button
            className={
              'bg-white p-2 rounded-full absolute right-12 top-16 z-[1]'
            }
            onClick={onCloseModal}
          >
            <IconClose className=" h-4 w-4 stroke-[#939DAA]" />
          </button>

          <div
            id="app_layout"
            className={`flex items-center justify-center small:p-1 text-center min-h-full overflow-hidden `}
          >
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
                className={` relative  flex items-center justify-center overflow-hidden`}
              >
                <div className={'flex max-w-[90%] tablet:max-w-[80%]'}>
                  <img
                    className="object-contain"
                    src={state?.image}
                    alt="preview"
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

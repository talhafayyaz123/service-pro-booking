import { IconTrash } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { Modal, useModalData } from '@/components/modals/Modal'
import { H12, H16, H24 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { formatPrice } from '@/core/helpers/formatPrice'
import { setDurationTime } from '@/core/helpers/setDurationTime'
import {
  allAddonsSelector,
  allSelectedAddons,
} from '@/features/booking/store/bookingSelectors'
import { IAddOn, selectAddon } from '@/features/booking/store/bookingStore'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const AddonConfirmList = () => {
  const selectedAddons = useAppSelector(allSelectedAddons)

  return (
    <>
      {selectedAddons?.length > 0 && (
        <div className={'mt-3 flex flex-col gap-4'}>
          {selectedAddons.map((el) => (
            <AddonConfirmCard key={el?.id} {...el} />
          ))}
          <DeleteAddonModal />
        </div>
      )}
    </>
  )
}

export const AddonConfirmCard = ({
  title,
  price,
  duration,
  hideDelete,
  id,
}: Partial<IAddOn> & { hideDelete?: boolean }) => {
  const dispatch = useAppDispatch()

  const handleClick = () => {
    dispatch(
      setModal({
        currentModal: MODALS_TYPE.DELETE_SELECT_ADDON_MODAL,
        state: { id },
      })
    )
  }
  return (
    <div>
      <div className={'flex items-center justify-between  mb-2'}>
        <H12 color={'text-black'}>{title}</H12>
        {!hideDelete && (
          <button onClick={handleClick} className={'mr-auto w-fit px-3'}>
            <IconTrash className={'w-4 text-red-500 '} />
          </button>
        )}
        <H12 color={'text-black'}>{formatPrice({ price })}</H12>
      </div>
      <H12 className={'block'}>+{setDurationTime(duration || 0)}</H12>
    </div>
  )
}

const DeleteAddonModal = () => {
  const { isOpen, onCloseModal, state } = useModalData(
    MODALS_TYPE.DELETE_SELECT_ADDON_MODAL
  )
  const addons = useAppSelector(allAddonsSelector)
  const dispatch = useAppDispatch()
  const handleDelete = () => {
    state?.id && dispatch(selectAddon(state?.id as string))
    dispatch(setModal({}))
  }

  return (
    <Modal maxWidth={400} noHeader onClose={onCloseModal} isOpen={isOpen}>
      <H24>
        Are you sure want delete{' '}
        {addons.find((el) => el.id === (state?.id || ''))?.title || ' - '} from
        service ?
      </H24>
      <H16 className={'mt-4 block'}>
        If it has been deleted, you can add it on the request to booking page
      </H16>
      <div className={'grid grid-cols-[1fr_1fr] gap-4 mt-8'}>
        <Button buttonType={'orange'} onClick={onCloseModal}>
          Cancel
        </Button>
        <Button buttonType={'lightMain'} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </Modal>
  )
}

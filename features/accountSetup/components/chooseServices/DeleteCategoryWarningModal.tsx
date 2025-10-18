import { IconWarningAlert } from '@/assets/icons/icons'
import { Modal } from '@/components/modals/Modal'
import { H24 } from '@/components/typography'
import { IDeleteCategoryModal } from '@/types/categoriesTypes'

export const DeleteCategoryWarningModal = ({
  isOpen,
  onClose,
}: Omit<IDeleteCategoryModal, 'activeCategoryIndex' | 'control'>) => {
  return (
    <Modal
      space={'h-fit pt-7'}
      isOpen={isOpen}
      noHeader
      maxWidth={430}
      onClose={onClose}
    >
      <div className="flex flex-col items-center justify-center px-5 ">
        <div className="w-[78px] h-[78px] flex items-center justify-center rounded-full border border-lightGray">
          <IconWarningAlert className="text-orange" width={30} height={30} />
        </div>
        <div className="mt-6 pb-7">
          <H24 color="text-black" className="text-center">
            There must be at least one category
          </H24>
        </div>
      </div>
    </Modal>
  )
}

import useTranslation from 'next-translate/useTranslation'
import { useFieldArray } from 'react-hook-form'

import { IconWarningAlert } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { Modal } from '@/components/modals/Modal'
import { H18 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { IDeleteCategoryModal } from '@/types/categoriesTypes'

export const DeleteCategoryModal = ({
  isOpen,
  onClose,
  control,
  activeCategoryIndex,
}: IDeleteCategoryModal) => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { remove } = useFieldArray({
    control,
    name: 'services',
    keyName: '_id',
  })

  return (
    <Modal
      space={'h-fit pt-7'}
      isOpen={isOpen}
      noHeader
      maxWidth={430}
      onClose={onClose}
    >
      <div>
        <div className="flex flex-col items-center justify-center px-5 ">
          <div className="w-[78px] h-[78px] flex items-center justify-center rounded-full border border-lightGray">
            <IconWarningAlert className="text-orange" width={30} height={30} />
          </div>
          <div className="mt-6">
            <H18 color="text-gray">{t('text.delete_category')}</H18>
          </div>
        </div>
        <div className="py-6 flex justify-center items-center small:px-8 px-5 small:pb-8 rounded-t-[20px] small:rounded-t-none small:rounded-b-[20px] relative z-20">
          <Button
            type="submit"
            className="w-full outline-none"
            buttonType="orange"
            onClick={() => {
              if (activeCategoryIndex != null) {
                remove(activeCategoryIndex)
              }
              onClose()
            }}
          >
            {t('labels.delete')}
          </Button>
          <Button
            className="w-full ml-5"
            type="button"
            buttonType="lightMain"
            onClick={onClose}
          >
            {t('labels.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

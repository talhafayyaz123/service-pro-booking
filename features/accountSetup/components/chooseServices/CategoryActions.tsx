import Tippy from '@tippy.js/react'
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'

import {
  IconEdit,
  IconMoreVertical,
  IconTrash,
  IconXCircle,
} from '@/assets/icons/icons'
import { H16 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useTippy } from '@/hooks/useTippy'
import { ICategoryActions } from '@/types/categoriesTypes'

export const CategoryActions = ({
  categoryId,
  openRemove,
  openEditCategory,
  onAddServiceClicked,
}: ICategoryActions) => {
  const [, setIsOpen] = useState(false)
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)

  const { onHide, onShow, tippyProps } = useTippy({
    trigger: setIsOpen,
    options: { placement: 'bottom-end' },
  })

  return (
    <Tippy
      {...tippyProps}
      arrow={false}
      content={
        <div
          className="my-4 bg-white rounded-xl"
          style={{
            boxShadow: '0px 4px 27px rgba(182, 190, 206, 0.3)',
          }}
        >
          <ActionItem
            icon={<IconXCircle className="w-6 h-6" />}
            text={t('labels.add_a_service')}
            onClick={() => {
              onAddServiceClicked(categoryId)
              onHide()
            }}
          />
          <ActionItem
            icon={<IconEdit className="w-6 h-6 text-orange" />}
            text={t('labels.edit_category')}
            onClick={openEditCategory}
          />
          <ActionItem
            icon={<IconTrash className="w-6 h-6 text-orange" />}
            text={t('labels.delete_category')}
            onClick={openRemove}
            withoutBorder
          />
        </div>
      }
    >
      <div
        onClick={onShow}
        role="button"
        className="shrink-0 flex items-center justify-center w-8 h-8 transition-colors border rounded-full cursor-pointer border-lightGray hover:bg-gray/20"
      >
        <IconMoreVertical />
      </div>
    </Tippy>
  )
}

interface IActionItem {
  text: string
  icon: any
  onClick: () => void
  withoutBorder?: boolean
}

const ActionItem = ({ text, icon, onClick, withoutBorder }: IActionItem) => {
  return (
    <div
      onClick={onClick}
      role="button"
      className="px-2 cursor-pointer hover:bg-lightGray/30"
    >
      <div
        className={`py-5 flex items-center px-4 ${
          withoutBorder ? '' : 'border-b border-lightGray'
        }`}
      >
        {icon}
        <H16 className="ml-4">{text}</H16>
      </div>
    </div>
  )
}

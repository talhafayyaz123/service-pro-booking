import 'react-spring-bottom-sheet/dist/style.css'

import useTranslation from 'next-translate/useTranslation'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { Control, useFieldArray } from 'react-hook-form'
import { BottomSheet } from 'react-spring-bottom-sheet'
import uuid from 'react-uuid'

import { IconCheckbox } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { Input } from '@/components/common/Input'
import { Modal } from '@/components/modals/Modal'
import { H20, H24, Label } from '@/components/typography'
import { categoriesColors } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { ICategoryModal, ICategoryService } from '@/types/categoriesTypes'

export const CategoryModal = ({
  control,
  isOpen,
  editingCategory,
  onClose,
}: ICategoryModal) => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { isSmall } = useMediaScreen()
  const title = editingCategory
    ? t('titles.edit_category')
    : t('titles.add_new_category')

  return isSmall ? (
    <CategoryBottomSheet isOpen={isOpen} title={title}>
      <Content
        onClose={onClose}
        editingCategory={editingCategory}
        control={control}
      />
    </CategoryBottomSheet>
  ) : (
    <Modal
      maxWidth={503}
      isOpen={isOpen}
      onClose={onClose}
      space="h-fit pt-7"
      title={<H24>{title}</H24>}
      titleClassName="border-b border-lightGray pb-6 flex mx-8"
    >
      <Content
        onClose={onClose}
        editingCategory={editingCategory}
        control={control}
      />
    </Modal>
  )
}

interface ICategoryBottomSheetProps {
  children: ReactNode
  isOpen: boolean
  title: string
}

const CategoryBottomSheet = ({
  children,
  isOpen,
  title,
}: ICategoryBottomSheetProps) => {
  return (
    <BottomSheet className="no-shadow" blocking open={isOpen}>
      <H20 className="px-5">{title}</H20>
      {children}
    </BottomSheet>
  )
}

interface IContentProps {
  control: Control
  onClose: () => void
  editingCategory?: ICategoryService | null
}

const Content = ({ control, onClose, editingCategory }: IContentProps) => {
  const {
    isDisabled,
    categoryName,
    selectedColor,
    onSave,
    onRemove,
    onSelectColor,
    setCategoryName,
  } = useCategory({
    control,
    editingCategory,
    onClose,
  })
  useEffect(() => {
    if (editingCategory) {
      onSelectColor(editingCategory.color)
      setCategoryName(editingCategory.name)
    }
    //eslint-disable-next-line
  }, [])
  const newCategoryColors = useMemo(() => {
    if (
      !!editingCategory?.color &&
      /^#[0-9A-F]{6}$/i.test(editingCategory.color || '')
    ) {
      return [editingCategory?.color, ...categoriesColors]
    } else {
      return categoriesColors
    }
  }, [editingCategory?.color])
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)

  return (
    <div>
      <div className="px-5 mt-6 mb-8 small:px-8">
        <Input
          label={t('labels.name_of_category')}
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="mb-6"
        />
        <div className="flex flex-col items-start">
          <Label className="mb-4">{t('labels.appointment_color')}</Label>
          <div className="flex flex-wrap gap-4 max-w-[340px]">
            {newCategoryColors.map((color) => (
              <AppointmentColor
                key={color}
                onSelectColor={onSelectColor}
                color={color}
                isSelected={color === selectedColor}
              />
            ))}
          </div>
        </div>
      </div>
      <div
        className="small:pt-6 flex justify-center items-center small:px-8 px-5 small:pb-8 py-3 rounded-t-[20px] small:rounded-t-none small:rounded-b-[20px] small:!shadow-xl relative z-20"
        style={{
          boxShadow: '0px -4px 27px rgb(182 190 206 / 30%)',
        }}
      >
        <Button
          disabled={isDisabled}
          type="submit"
          className="w-full"
          buttonType="orange"
          onClick={onSave}
        >
          {t('labels.save')}
        </Button>
        {editingCategory ? (
          <Button
            className="w-full ml-5"
            type="button"
            buttonType="lightMain"
            onClick={onRemove}
          >
            {t('labels.delete')}
          </Button>
        ) : null}
      </div>
    </div>
  )
}

interface IUseCategory {
  control: Control
  editingCategory?: ICategoryService | null
  onClose: () => void
}

const useCategory = ({ control, onClose, editingCategory }: IUseCategory) => {
  const { append, fields, update, remove } = useFieldArray({
    control,
    name: 'services',
    keyName: '_id',
  })
  const [selectedColor, setSelectedColor] = useState('')
  const [categoryName, setCategoryName] = useState('')

  const onSelectColor = (color: string) => {
    setSelectedColor(color)
  }

  const onRemove = () => {
    if (editingCategory) {
      const index = fields.findIndex((f: any) => {
        return f.id === editingCategory.id
      })
      if (index >= 0) {
        remove(index)
      }
      onClose()
    }
  }

  const onSave = async () => {
    try {
      if (editingCategory) {
        const index = fields.findIndex((f: any) => {
          return f.id === editingCategory.id
        })

        if (index >= 0) {
          const category = {
            categories: [...(fields[index] as any).categories],
            name: categoryName,
            color: selectedColor,
            id: uuid(),
          }
          update(index, category)
        }
      } else {
        append({
          name: categoryName,
          color: selectedColor,
          categories: [],
          id: uuid(),
        })
      }
      onClose()
    } catch (err) {
      return err
    }
  }

  const isDisabled = !selectedColor || !categoryName

  return {
    isDisabled,
    onSave,
    onSelectColor,
    setCategoryName,
    categoryName,
    selectedColor,
    onRemove,
  }
}

interface IAppointmentColor {
  color: string
  isSelected?: boolean
  onSelectColor: (color: string) => void
}

const AppointmentColor = ({
  color,
  isSelected,
  onSelectColor,
}: IAppointmentColor) => {
  return (
    <div
      onClick={() => onSelectColor(color)}
      role="button"
      className="flex items-center justify-center w-8 h-8 border-2 border-white rounded-full cursor-pointer"
      style={{
        backgroundColor: color,
      }}
    >
      {isSelected ? <IconCheckbox /> : null}
    </div>
  )
}

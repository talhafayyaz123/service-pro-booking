import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useFormContext } from 'react-hook-form'

import { IconDrag, IconEdit, IconPlus } from '@/assets/icons/icons'
import { H16, H18, H24, H40 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import {
  getHoursFromMinutes,
  getOnlyMinutes,
} from '@/features/accountSetup/helpers/durationConverters'
import { useChoseServices } from '@/features/accountSetup/hooks/useChooseServices'
// import useMixpanel from '@/hooks/useMixpanel'
import { useProCurrency } from '@/hooks/useProCurrency'
import {
  ICategoryActions,
  ICategoryModal,
  IDeleteCategoryModal,
  IServiceItem,
  IServiceModal,
} from '@/types/categoriesTypes'
// import { MixpanelEvents } from '@/types/mixpanel'

const CategoryModal = dynamic<ICategoryModal>(() =>
  import(
    '@/features/accountSetup/components/chooseServices/CategoryModal'
  ).then((m) => m.CategoryModal)
)

const CategoryActions = dynamic<ICategoryActions>(() =>
  import(
    '@/features/accountSetup/components/chooseServices/CategoryActions'
  ).then((m) => m.CategoryActions)
)

const DeleteCategoryModal = dynamic<IDeleteCategoryModal>(() =>
  import(
    '@/features/accountSetup/components/chooseServices/DeleteCategoryModal'
  ).then((m) => m.DeleteCategoryModal)
)

const DeleteCategoryWarningModal = dynamic<
  Omit<IDeleteCategoryModal, 'activeCategoryIndex' | 'control'>
>(() =>
  import(
    '@/features/accountSetup/components/chooseServices/DeleteCategoryWarningModal'
  ).then((m) => m.DeleteCategoryWarningModal)
)

const ServiceModal = dynamic<IServiceModal>(
  () => import('@/components/modals/ServiceModal')
)

const ChooseServices = () => {
  const [categoryName, setCategoryName] = useState('')
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { watch, setValue, control } = useFormContext()
  // const { trackEvent } = useMixpanel()
  const {
    items,
    isEditing,
    currentModal,
    businessTypes,
    activeService,
    activeCategory,
    activeCategoryIndex,
    onAdd,
    onEdit,
    onClose,
    onDelete,
    openCategory,
    closeCategory,
    onCloseRemove,
    onServiceDragEnd,
    onCategoryDragEnd,
    onAddServiceClicked,
    openRemoveCategory,
    onEditServiceClicked,
  } = useChoseServices({ watch, setValue })

  const { currency } = useProCurrency()
  // trackEvent(MixpanelEvents.pages.onboarding.BUSINESS_SERVICES_PAGE)
  return (
    <div className="maxTablet:max-w-[425px] max-w-[620px] bg-white mx-auto  pt-8  tablet:p-[60px] tablet:mt-20 rounded-[20px] tablet:shadow-xl mb-[50px]">
      <CategoryModal
        isOpen={currentModal === MODALS_TYPE.ADD_OR_EDIT_CATEGORY}
        control={control}
        onClose={closeCategory}
        editingCategory={activeCategory}
      />

      <DeleteCategoryModal
        isOpen={currentModal === MODALS_TYPE.REMOVE_CATEGORY}
        onClose={onCloseRemove}
        control={control}
        activeCategoryIndex={activeCategoryIndex}
      />

      <DeleteCategoryWarningModal
        isOpen={currentModal === MODALS_TYPE.REMOVE_CATEGORY_WARNING}
        onClose={onCloseRemove}
      />

      <ServiceModal
        onClose={onClose}
        isOpen={currentModal === MODALS_TYPE.PRO_SERVICES}
        isEditing={isEditing}
        service={activeService}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        currency={currency}
        businessTypes={businessTypes}
        category={categoryName || ''}
      />

      <div className="px-5 small:px-0">
        <H40 className={'!font-bold mb-4'}>{t('titles.your_services')}</H40>
        <H24 responsive className="mb-10 block !font-normal !text-gray">
          {t('text.services_description')}
        </H24>
      </div>
      <DragDropContext onDragEnd={onCategoryDragEnd}>
        <Droppable droppableId="droppable-1">
          {(provided) => {
            return (
              <div
                ref={provided.innerRef}
                className="transition-all"
                {...provided.droppableProps}
              >
                {items.map(({ name, id, color, categories }, categoryIndex) => {
                  return (
                    <Draggable
                      draggableId={'draggable-' + name}
                      index={categoryIndex}
                      key={id}
                    >
                      {(provided, snapshot) => {
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                            className={`mb-8 z-50 bg-white ${
                              snapshot.isDragging ? 'p-[3px]' : ''
                            }`}
                          >
                            <ServiceTitle
                              dragHandleProps={provided.dragHandleProps}
                              title={name}
                              dotColor={color}
                              id={id}
                              openRemove={() =>
                                openRemoveCategory(categoryIndex)
                              }
                              onAddServiceClicked={onAddServiceClicked}
                              openEditCategory={() =>
                                openCategory({ name, id, color, categories })
                              }
                            />
                            <DragDropContext
                              onDragEnd={(params) =>
                                onServiceDragEnd(categoryIndex, params)
                              }
                            >
                              <div className="rounded-[20px] shadow-xl small:p-8 p-5">
                                <Droppable droppableId={`droppable-${id}`}>
                                  {(provided) => {
                                    return (
                                      <div
                                        ref={provided.innerRef}
                                        className="transition-all"
                                        {...provided.droppableProps}
                                      >
                                        {categories?.map((item, i) => {
                                          return (
                                            <Draggable
                                              draggableId={`draggable-${
                                                item.id || item.key
                                              }`}
                                              index={i}
                                              key={item.id || item.key}
                                            >
                                              {(provided, snapshot) => {
                                                return (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    style={{
                                                      ...provided.draggableProps
                                                        .style,
                                                    }}
                                                    className="z-50 bg-white"
                                                  >
                                                    <ServiceItem
                                                      dragHandleProps={
                                                        provided.dragHandleProps
                                                      }
                                                      isDragging={
                                                        snapshot.isDragging
                                                      }
                                                      {...item}
                                                      currency={currency}
                                                      onEditClicked={() =>
                                                        onEditServiceClicked(
                                                          item,
                                                          i,
                                                          id
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                )
                                              }}
                                            </Draggable>
                                          )
                                        })}
                                        {provided.placeholder}
                                        <div
                                          onClick={() => {
                                            setCategoryName(name)
                                            onAddServiceClicked(id)
                                          }}
                                          role="button"
                                          className="flex items-center cursor-pointer w-max group"
                                        >
                                          <IconPlus className="mr-3 text-orange" />
                                          <H16 color="text-orange">
                                            {t('text.add_a_service')}
                                          </H16>
                                        </div>
                                      </div>
                                    )
                                  }}
                                </Droppable>
                              </div>
                            </DragDropContext>
                          </div>
                        )
                      }}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )
          }}
        </Droppable>
      </DragDropContext>
      {/* <div className="flex justify-end">
        <div
          role="button"
          onClick={() => openCategory()}
          className="w-[60px] h-[60px] small:static fixed bottom-[94px] right-5 transition-colors hover:bg-lightGray/40 hover:shadow-none shadow-xl cursor-pointer rounded-full flex items-center justify-center bg-white"
        >
          <IconXCircle className="w-6 h-6" />
        </div>
      </div> */}
    </div>
  )
}

const ServiceItem: React.FC<IServiceItem> = ({
  price,
  name,
  isMobile,
  dragHandleProps,
  onEditClicked,
  duration,
  isDragging,
  currency,
}) => {
  const hours = getHoursFromMinutes(duration || 0).hours
  const minutes = getOnlyMinutes(duration || 0)
  return (
    <div
      className={`flex items-start bg-white w-full justify-between ${
        isDragging ? 'p-5 border rounded-xl' : 'pb-5 border-b'
      } border-lightGray mb-5`}
      style={{
        boxShadow: isDragging
          ? '0px -4px 27px rgba(182, 190, 206, 0.3)'
          : 'none',
      }}
    >
      <div className="flex items-start gap-x-3">
        <span {...dragHandleProps}>
          <IconDrag className="cursor-pointer" />
        </span>
        <div>
          <H18 className="mb-2">{name}</H18>
          <div className="flex items-center gap-x-2">
            <H18>{`${hours > 0 ? `${hours} h` : ''} ${
              minutes > 0 ? `${minutes} min` : ''
            }`}</H18>
            <div className="bg-black w-0.5 h-0.5 rounded-full" />
            <H18>
              {currency?.sign}
              {price}
            </H18>
            {isMobile ? <H16>Mobile</H16> : null}
          </div>
        </div>
      </div>
      <div
        role="button"
        onClick={onEditClicked}
        className="flex items-center justify-center w-8 h-8 transition-colors border rounded-full cursor-pointer hover:bg-gray/20 border-lightGray"
      >
        <IconEdit className="w-4 h-4 text-black" />
      </div>
    </div>
  )
}

interface IServiceTitle {
  title: string
  dotColor: string
  dragHandleProps: any
  id: string
  onAddServiceClicked: (id: string) => void
  openEditCategory: () => void
  openRemove: () => void
}

const ServiceTitle: React.FC<IServiceTitle> = ({
  title,
  dotColor,
  dragHandleProps,
  id,
  onAddServiceClicked,
  openEditCategory,
  openRemove,
}) => {
  return (
    <div className="flex items-center justify-between px-5 mb-5 small:px-0">
      <div className="flex items-center h-1 gap-x-4 pr-1">
        <span {...dragHandleProps}>
          <IconDrag className="cursor-pointer" />
        </span>
        <div
          style={{
            backgroundColor: dotColor,
          }}
          className={`w-3 h-3 rounded-full shrink-0`}
        />
        <H24 className="!text-20 !leading-6 lg:!text-24 lg:!leading-8">
          {title}
        </H24>
      </div>
      <CategoryActions
        onAddServiceClicked={onAddServiceClicked}
        openEditCategory={openEditCategory}
        openRemove={openRemove}
        categoryId={id}
      />
    </div>
  )
}

export default ChooseServices

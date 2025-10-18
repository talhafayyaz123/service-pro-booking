import { useCallback, useEffect, useState } from 'react'
import { DropResult } from 'react-beautiful-dnd'
import uuid from 'react-uuid'

import { getAdditionalCategories, getMainCategory } from '@/api/onboarding'
import { getProServices } from '@/api/pro/getProServices'
import { MODALS_TYPE } from '@/core/consts/common'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'
import {
  ICategory,
  ICategoryService,
  IService,
  IServiceItem,
} from '@/types/categoriesTypes'

interface Props {
  setValue: any
  watch: any
}

export const useChoseServices = ({ setValue, watch }: Props) => {
  const dispatch = useAppDispatch()
  const { currentModal } = useAppSelector(modalsSelector)
  const [isEditing, setIsEditing] = useState(false)
  const [activeService, setActiveService] = useState<null | any>(null)
  const [activeCategoryId, setActiveCategoryId] = useState<null | string>(null)
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<null | number>(
    null
  )
  const [activeServiceIdx, setActiveServiceIdx] = useState<null | number>(null)
  const [activeCategory, setActiveCategory] = useState<ICategoryService | null>(
    null
  )
  const [businessTypes, setBusinessTypes] = useState<ICategory[]>([])

  const items: ICategoryService[] = watch('services') || []

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getProServices()
        const categories = res.categoriesBlock.map((category) => {
          return {
            ...category,
            categories: category.categories.sort(
              (service1, service2) => service1.order - service2.order
            ),
          }
        })
        if (categories.length) {
          setValue('services', categories)
          setValue('hasServices', true)
        }

        const main = await getMainCategory()
        const additional = await getAdditionalCategories()
        const services = [main, ...additional.categories]
        if (services.length && !services[0]?.id) {
          services.shift()
        }
        setBusinessTypes(services)
        if (!categories.length) {
          const _services = services.map((item, index) => ({
            ...item,
            order: index,
            categories: [],
            id: uuid(),
            // color: '',
          }))
          setValue('services', _services)
        }
      } catch (err) {
        return err
      }
    }
    getData()
  }, [setValue])

  const onAdd = (service: IService) => {
    const categoryIndex = items.findIndex((c) => c.id == activeCategoryId)
    const order = items[categoryIndex].categories.length - 1
    if (categoryIndex >= 0) {
      const newItems = [...items]
      newItems[categoryIndex].categories.push({
        ...service,
        order,
      } as IServiceItem)
      setValue('services', newItems)
    }
  }

  const onEdit = (service: IService) => {
    const categoryIndex = items.findIndex((c) => c.id == activeCategoryId)
    if (categoryIndex >= 0 && activeServiceIdx !== null) {
      const newItems = [...items]
      newItems[categoryIndex].categories[activeServiceIdx] =
        service as IServiceItem
      setValue('services', newItems)
    }
  }

  const onDelete = () => {
    const categoryIndex = items.findIndex((c) => c.id == activeCategoryId)
    if (categoryIndex >= 0 && activeServiceIdx !== null) {
      const newItems = [...items]
      newItems[categoryIndex].categories = items[
        categoryIndex
      ].categories.filter((_, i) => i !== activeServiceIdx)

      setValue('services', newItems)
    }
  }

  const onClose = useCallback(() => {
    dispatch(setModal({}))
    if (isEditing) {
      setIsEditing(false)
      setActiveService(null)
    }
  }, [dispatch, isEditing])

  const onAddServiceClicked = (id: string) => {
    setActiveCategoryId(id)
    dispatch(setModal({ currentModal: MODALS_TYPE.PRO_SERVICES }))
  }

  const onEditServiceClicked = (service: any, index: number, id: string) => {
    setActiveService(service)
    setActiveServiceIdx(index)
    setActiveCategoryId(id)
    setIsEditing(true)
    dispatch(setModal({ currentModal: MODALS_TYPE.PRO_SERVICES }))
  }

  const openCategory = (category?: ICategoryService) => {
    dispatch(setModal({ currentModal: MODALS_TYPE.ADD_OR_EDIT_CATEGORY }))
    if (category) {
      setActiveCategory(category)
    }
  }

  const closeCategory = () => {
    dispatch(setModal({}))
    if (activeCategory) {
      setActiveCategory(null)
    }
  }

  const openRemoveCategory = (index: number) => {
    // if service is only one don't let delete it
    if (items.length === 1) {
      dispatch(setModal({ currentModal: MODALS_TYPE.REMOVE_CATEGORY_WARNING }))
    } else {
      dispatch(setModal({ currentModal: MODALS_TYPE.REMOVE_CATEGORY }))
    }

    setActiveCategoryIndex(index)
  }

  const onCloseRemove = () => {
    dispatch(setModal({}))
    setActiveCategoryIndex(null)
  }

  const onServiceDragEnd = (categoryIndex: number, param: DropResult) => {
    const srcI = param.source.index
    const desI = param.destination?.index || 0
    items[categoryIndex].categories[srcI] = {
      ...items[categoryIndex].categories[srcI],
      order: desI,
    }
    items[categoryIndex].categories[desI] = {
      ...items[categoryIndex].categories[desI],
      order: srcI,
    }
    if (desI !== undefined) {
      const newItems = [...items]

      newItems[categoryIndex].categories.splice(
        desI,
        0,
        newItems[categoryIndex].categories.splice(srcI, 1)[0]
      )
      setValue('services', newItems)
    }
  }

  const onCategoryDragEnd = (param: DropResult) => {
    const srcI = param.source.index
    const desI = param.destination?.index || 0
    items[srcI] = { ...items[srcI], order: desI }
    items[desI] = { ...items[desI], order: srcI }
    if (desI !== undefined) {
      const newItems = [...items]
      newItems.splice(desI, 0, newItems.splice(srcI, 1)[0])
      setValue('services', newItems)
    }
  }

  return {
    closeCategory,
    openCategory,
    onEditServiceClicked,
    onAdd,
    onAddServiceClicked,
    onClose,
    onEdit,
    onDelete,
    onServiceDragEnd,
    onCategoryDragEnd,
    openRemoveCategory,
    onCloseRemove,
    activeCategoryIndex,
    items,
    currentModal,
    activeService,
    isEditing,
    activeCategory,
    activeCategoryId,
    businessTypes,
  }
}

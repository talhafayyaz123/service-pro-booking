import { ReactNode } from 'react'
import { Control } from 'react-hook-form'

import { ICurrency } from './common'
import { TBusinessTypes } from './onboarding'

export interface ICategory {
  color: string
  createdAt: string
  iconUrl: string | ReactNode
  id: string
  name: string
  proCount: number
  updatedAt: string
  isMain: boolean
}

export interface ICategoriesResponse {
  categories: ICategory[]
}

export interface IHistoryItem {
  text: string
}

export interface IService {
  id?: string
  name: string
  duration: number
  isExtraTime?: boolean
  image?: string | null
  isMobile?: boolean
  isInPerson?: boolean
  isVirtual?: boolean
  extraTime: number
  description: string
  categoryId?: string
  color?: string
  order: number
  price: number
  taxPrice?: number
  totalPrice?: number
}

export interface IBusinessType {
  iconUrl: string
  name: string
  color: string
}

export interface ICategoryService {
  name: string
  color: string
  id: string
  order?: number
  categories: IServiceItem[]
}

export interface IServiceItem extends IService {
  dragHandleProps?: any
  onEditClicked?: () => void
  key?: string
  isDragging?: boolean
  currency: ICurrency | null
}

export interface ICategoryActions {
  onAddServiceClicked: (id: string) => void
  openEditCategory: () => void
  openRemove: () => void
  categoryId: string
}

export interface ICategoryModal {
  isOpen: boolean
  control: Control
  onClose: () => void
  editingCategory?: ICategoryService | null
}

export interface IServiceModal {
  isEditing: boolean
  service: any
  onClose: () => void
  isOpen: boolean
  onAdd: (service: IService) => void
  onEdit: (service: IService) => void
  onDelete: () => void
  currency: ICurrency | null
  category?: string
  businessTypes: TBusinessTypes[]
}

export interface IDeleteCategoryModal {
  isOpen: boolean
  onClose: () => void
  control: Control
  activeCategoryIndex: number | null
}

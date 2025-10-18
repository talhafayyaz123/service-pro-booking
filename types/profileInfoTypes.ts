import { UserSourceTypeEnum } from '@/core/helpers/calculateDepositBE'
import { ICategory } from '@/types/categoriesTypes'

export interface IProfileInfo {
  accountId?: string
  address: string
  categories: ICategory[]
  currency?: string
  distance: number
  iconUrl: string
  isFollowing: boolean
  isInPerson?: boolean
  isMobile?: boolean
  isInVenue?: boolean
  isInHome?: boolean
  isVirtual?: boolean
  id: string
  name: string
  latitude: number | null
  longitude: number | null
  rating: number
  photos: string[]
  country?: string
  slug: string
  payInBnpl?: boolean
  timezone?: string
  categoryWithIcon?: boolean
  source?: UserSourceTypeEnum
}

export interface IProInfo {
  slug: string
  iconUrl: string
  name: string
  address: string
}

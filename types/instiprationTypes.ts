import { IResponseData } from '@/types/common'

export interface IInspirationCard {
  id: string
  contentUrl: string
  description: string
  tags: string[]
  pro: {
    id: string
    name: string
    iconUrl: string
  }
  likesCount: number
  commentsCount: number
  isLiked: boolean
  isBlocked: boolean
  isFavorite: boolean
  createdAt: string
  mobileImageSize?: {
    width: number
    height: number
  }
  imageSize?: {
    mobile: {
      width: number
      height: number
    }
    laptop: {
      width: number
      height: number
    }
    desktop: {
      width: number
      height: number
    }
  }
}

export interface IComment {
  id?: string
  text?: string
  createAt?: string
  user?: {
    name?: string
    role?: string
    iconUrl?: string
  }
}

export interface IInspirationForYou extends IResponseData<IInspirationCard> {
  filter: {
    limit?: number
    categoryId: string
    isFavorite?: boolean
  }
}

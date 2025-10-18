export interface IBlogPosts {
  createdAt: string
  iconUrl: string
  id: string
  title: string
  updatedAt: string
  url: string
  businessTypes: {
    color: string
    iconUrl: string
    id: string
    title: string
  }[]
}

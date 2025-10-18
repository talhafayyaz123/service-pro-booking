import { IWebsiteDataProps } from '@/types/customWebsite'

export const getColors = (data: IWebsiteDataProps) => ({
  textColor: data.bodyTextColor.trim() || '',
  backgroundColor: data.mainBackgroundColor.trim() || '',
  buttonColor: data.buttonColor.trim() || '',
  headerTextColor: data.headerTextColor.trim() || '',
  blockBackgroundColor: data.blockBackgroundColor.trim() || '#fff',
})

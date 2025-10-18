export interface IBasicInfoForm {
  bio?: string
  businessName?: string
  asName: boolean
  file: {
    iconUrl?: string
    localeImage?: string
    file?: File | null
  }
}

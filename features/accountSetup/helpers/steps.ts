export const steps = {
  welcome: 'welcome',
  basicInfo: 'basicInfo',
  businessTypes: 'businessTypes',
  businessDetail: 'businessDetail',
  services: 'services',
  portfolio: 'portfolio',
  trial: 'trial',
} as const

export type ISteps = keyof typeof steps

export const inputs = {
  [steps.basicInfo]: {
    usename: 'basicInfo.usename',
    iconUrl: 'basicInfo.iconUrl',
    businessName: 'basicInfo.businessName',
    bio: 'basicInfo.bio',
  },
  [steps.businessTypes]: {
    categories: 'businessTypes.categories',
  },
  [steps.businessDetail]: {
    isMobile: 'businessDetail.isMobile',
    isInPerson: 'businessDetail.isInPerson',
    isVirtual: 'businessDetail.isVirtual',
    isInHome: 'businessDetail.isInHome',
    isInVenue: 'businessDetail.isInVenue',
    coverArea: 'businessDetail.coverArea',
    address: 'businessDetail.address',
    countryCode: 'businessDetail.countryCode',
    timezone: 'businessDetail.timezone',
    travelFee: 'businessDetail.travelFee',
    longitude: 'businessDetail.longitude',
    latitude: 'businessDetail.latitude',
    isSelected: 'businessDetail.isSelected',
    isMiles: 'businessDetail.isMiles',
  },
  [steps.services]: {},
  [steps.portfolio]: {
    photos: 'portfolio.portfolioPhotos',
  },
} as const

export const stepOrder = [
  steps.welcome,
  steps.basicInfo,
  steps.businessTypes,
  steps.businessDetail,
  steps.services,
  steps.portfolio,
  steps.trial,
]

export const stepNumbers = {
  [steps.welcome]: 0,
  [steps.basicInfo]: 1,
  [steps.businessTypes]: 2,
  [steps.businessDetail]: 3,
  [steps.services]: 4,
  [steps.portfolio]: 5,
  [steps.trial]: 6,
}

export type TStepKeys = keyof typeof steps
export type TSteps = typeof steps[keyof typeof steps]

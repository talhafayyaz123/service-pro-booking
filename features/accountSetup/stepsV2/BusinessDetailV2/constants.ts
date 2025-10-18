import { TTypeOfServices } from '@/features/accountSetup/stepsV2/BusinessDetailV2/types'

export const serviceTypes: TTypeOfServices[] = [
  'isInHome',
  'isInVenue',
  'isMobile',
  'isVirtual',
]

export const typeOfServicesLabel: Record<TTypeOfServices, string> = {
  isInHome: 'Home based',
  isInVenue: 'Venue based',
  isMobile: 'Mobile',
  isVirtual: 'Virtual',
}

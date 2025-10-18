import { convertDistance } from './convertDistance'

export const formatDistance = (distance: number, country?: string) => {
  if (!distance) {
    return ''
  }
  const isMiles = checkCountryForDistance(country)

  return isMiles ? `${metersToMiles(distance)} mi.` : convertDistance(distance)
}

export const checkCountryForDistance = (country?: string) => {
  switch (country) {
    case 'United States':
    case 'US':
    case 'USA':
      return true
    default:
      return true
  }
}

export const kmToMiles = (km: number) => Number((km * 0.621371192).toFixed(2))
const metersToMiles = (meters: number) => (meters * 0.000621371192).toFixed(2)

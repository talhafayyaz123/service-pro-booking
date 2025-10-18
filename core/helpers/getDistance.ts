import { ILocation } from '@/types/typo'

export const getDistance = (
  firstLocation?: ILocation,
  secondLocation?: ILocation
) => {
  if (!firstLocation || !secondLocation) {
    return 0
  }
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  const lon1 = (Number(firstLocation.lng) * Math.PI) / 180
  const lon2 = (Number(secondLocation.lng) * Math.PI) / 180
  const lat1 = (Number(firstLocation.lat) * Math.PI) / 180
  const lat2 = (Number(firstLocation.lat) * Math.PI) / 180

  // Haversine formula
  const dlon = lon2 - lon1
  const dlat = lat2 - lat1
  const a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2)

  const c = 2 * Math.asin(Math.sqrt(a))

  // Radius of earth in kilometers. Use 3956
  // for miles
  const r = 6371

  // calculate the result
  return c * r
}

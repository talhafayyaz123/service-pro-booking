import { fixInteger } from '@/core/helpers/fixInteger'

export const convertDistance = (distance: number) => {
  if (!distance) {
    return ''
  }
  return distance < 1000
    ? `${fixInteger(distance)} m.`
    : `${(distance / 1000).toFixed(1)} km.`
}

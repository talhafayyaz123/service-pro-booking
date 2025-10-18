import { GoogleMapProps } from '@react-google-maps/api'

export interface ICurrentLoc {
  lat: number
  lng: number
}
export interface IBaseMap {
  latitude?: number | null
  longitude?: number | null
  distance?: number | null
  address?: string
  loadedMapOptions?: GoogleMapProps
  className?: string
  mapContainerClassName?: string
}

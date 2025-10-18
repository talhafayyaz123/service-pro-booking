import { useEffect, useState } from 'react'

import { ILatLng } from '@/types/common'

export const useCurrentPosition = () => {
  const [currentPosition, setCurrentPosition] = useState<ILatLng | null>(null)

  useEffect(() => {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((p) => {
        const lat = p.coords.latitude
        const lng = p.coords.longitude
        setCurrentPosition({ lat, lng })
      })
    }
  }, [])

  return { currentPosition }
}

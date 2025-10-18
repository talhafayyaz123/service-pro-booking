import React from 'react'

import { IconPlus } from '@/assets/icons/icons'
import MapZoomButton from '@/features/search/MapZoomButton'

interface Props {
  map: google.maps.Map | null
}

const MapZoomControls: React.FC<Props> = ({ map }) => {
  const onZoom = (action: 'increment' | 'decrement') => {
    if (map) {
      const zoom = map?.getZoom()
      if (zoom !== undefined) {
        map.setZoom(zoom + (action === 'increment' ? 1 : -1))
      }
    }
  }
  return (
    <>
      <MapZoomButton onClick={() => onZoom('increment')}>
        <IconPlus />
      </MapZoomButton>
      <MapZoomButton onClick={() => onZoom('decrement')}>
        <div className="h-0.5 w-[18px] bg-gray" />
      </MapZoomButton>
    </>
  )
}

export default MapZoomControls

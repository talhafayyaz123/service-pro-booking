import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'

import { Checkbox } from '@/components/common/Checkbox'
import { MapGeoCode } from '@/components/Map/MapGeoCode'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

export const CurrentLocation = ({
  checked,
  onChange,
  onSelect,
}: {
  checked: boolean
  onChange: () => void
  onSelect: (place_id: string, place: string) => any
}) => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const [loading, setLoading] = useState(false)
  return (
    <Checkbox
      checked={checked}
      disabled={loading}
      onChange={async () => {
        await onChange()
        if (window.navigator.geolocation && !checked) {
          setLoading(true)
          window.navigator.geolocation.getCurrentPosition(
            async (p) => {
              const lat = p.coords.latitude
              const lng = p.coords.longitude
              const res = await MapGeoCode.fromLatLng(String(lat), String(lng))

              const place_id = res.results[0]?.place_id
              const place = res.results[0].formatted_address
              onSelect?.(place_id, place)
              setLoading(false)
            },
            () => setLoading(false)
          )
        }
      }}
      rightLabel={
        <span className={'flex gap-2 items-center'}>
          {t('labels.use_current_location') + '?'}
          {loading && <div className="loader_spinner_mini_orange" />}
        </span>
      }
    />
  )
}

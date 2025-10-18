import { Distance } from '@/components/cardElements/Distance'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { H14, H28 } from '@/components/typography'
import { onShowOnMapClick } from '@/features/profile/helpers/onShowMapClick'

export const ProfileInfo = ({
  status,
  name,
  address,
  latitude,
  longitude,
  distance,
  country,
}: {
  status?: boolean
  name?: string
  address?: string
  latitude?: number | null
  longitude?: number | null
  distance?: number
  country?: string
}) => (
  <div className="flex flex-col items-center space-y-4">
    {!status ? (
      <H28>{name || ''}</H28>
    ) : (
      <BaseSkeleton className={'!h-[28px] mb-[8px]'} />
    )}
    {!status ? (
      <H14 className={'mt-1 text-center'}>{address || ''}</H14>
    ) : (
      <BaseSkeleton className={'mt-1 w-[300px]'} />
    )}
    <Distance
      className="mt-2"
      onClick={latitude && longitude ? onShowOnMapClick : undefined}
      status={status}
      distance={distance}
      country={country}
      distanceStyle="!text-black"
    />
  </div>
)

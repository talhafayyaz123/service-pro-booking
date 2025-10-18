import { useRouter } from 'next/router'
import { memo } from 'react'
import { useSelector } from 'react-redux'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { AdditionalPolicies } from '@/features/profile/components/cardBlock/AdditionalPolicies'
import InstagramFeed from '@/features/profile/components/InstagramFeed'
import LocationMap from '@/features/profile/components/Location/LocationMap'
import { Bio } from '@/features/profile/components/mobile/steps/aboutStep/Bio'
import { ContactAndHours } from '@/features/profile/components/mobile/steps/aboutStep/ContactAndHours'
import { profileSelector } from '@/features/profile/store/profileSelectors'

import { SimilarPros } from '../../../SimilarPros/SimilarPros'

const AboutStep = memo(() => {
  const {
    data: { latitude, longitude, address },
  } = useSelector(profileSelector)
  const router = useRouter()
  const proId = router.query.proId as string
  return (
    <div className="flex flex-col gap-3 mt-6">
      <Bio />
      <AdditionalPolicies />
      <ContactAndHours proId={proId} />
      <div id="location_map">
        <LocationMap
          address={address}
          latitude={latitude}
          longitude={longitude}
        />
      </div>

      <InstagramFeed />
      <CardWrapper className={'px-0 pb-0 pt-6 hidden'}>
        <SimilarPros />
      </CardWrapper>
    </div>
  )
})

export default AboutStep

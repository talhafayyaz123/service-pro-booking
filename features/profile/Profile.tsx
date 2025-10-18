import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { AdditionalPolicies } from '@/features/profile/components/cardBlock/AdditionalPolicies'
import { BioAndContacts } from '@/features/profile/components/cardBlock/BioAndContacts'
import NewProfileCard from '@/features/profile/components/cardBlock/newProfileCard/NewProfileCard'
import { ProfileBusinessHours } from '@/features/profile/components/cardBlock/ProfileBusinessHours'
import { ProfileInspirationSlider } from '@/features/profile/components/inspirationBlock/ProfileInspirationSlider'
import { ProfileContentStepperMobile } from '@/features/profile/components/mobile/ProfileContentStepperMobile'
import { ProfileInfoMobileLight } from '@/features/profile/components/mobile/ProfileInfoMobile'
import { ProfileReviews } from '@/features/profile/components/reviews/ProfileReviews'
import { ImagePreviewModal } from '@/features/profile/components/services/imagePreviewCard/ImagePreviewCard'
import { ProfileServices } from '@/features/profile/components/services/ProfileServices'
import { SimilarPros } from '@/features/profile/components/SimilarPros/SimilarPros'
import { ProfileTermsOfPayment } from '@/features/profile/components/termsOfPayment/ProfileTermsOfPayment'
import { ProfileMainSlider } from '@/features/profile/components/topBlock/ProfileMainSlider'
import ProfileMasonryGrid from '@/features/profile/components/topBlock/ProfileMasonryGrid'
import { useIsScrollerTop } from '@/features/profile/hooks/useScrollerTop'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import BaseLayout from '@/layouts/BaseLayout'
import { MainLayout } from '@/layouts/MainLayout'

import InstagramFeed from './components/InstagramFeed'
import LocationMap from './components/Location/LocationMap'

interface Props {
  proId: string
  distance: number
}

export const Profile = ({ proId, distance }: Props) => {
  const {
    data: { name },
  } = useSelector(profileSelector)
  const { t } = useTranslation(TRANSLATE_KEYS.profile)
  const {
    query: { proId: slug },
  } = useRouter()

  const {
    data: { latitude, longitude, address },
  } = useSelector(profileSelector)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ref = document.getElementById('scroll_section')
      ref?.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [slug])

  const isTopOffset = useIsScrollerTop(550)

  const { isSmall } = useMediaScreen()

  const proIdBook = typeof slug === 'string' ? slug : proId

  return (
    <BaseLayout seoTitle={name} seoDescription={t('seo_description')}>
      <MainLayout
        footerClassName={'maxSmall:hidden  sticky bottom-0'}
        hideOnMobile
      >
        <div
          className={`${
            isTopOffset
              ? 'opacity-100 h-fit top-0'
              : 'opacity-0 !h-0 top-[-100px]'
          } transition duration-300 overflow-hidden sticky self-start top-0 z-[20] bg-white shadow-xl rounded-b-[20px] small:hidden`}
        >
          <ProfileInfoMobileLight />
        </div>

        <ProfileMainSlider />
        <ProfileContentStepperMobile proId={proIdBook} />

        {/* New Redesign */}
        <div className="container grid grid-cols-12 gap-10 mt-10 maxSmall:hidden">
          <div className="desktop:col-span-4 tablet:col-span-12 desktop:order-1 tablet:order-2 col-span-12 order-2">
            <NewProfileCard />
          </div>

          <div className="desktop:col-span-8 tablet:col-span-12 desktop:order-2 tablet:order-1 h-full order-1 screen577:hidden">
            <ProfileMasonryGrid />
          </div>
        </div>

        <div className="grid grid-cols-1 laptop:grid-cols-[auto_1fr] gap-10 container mt-10 pb-12 border-b border-lightGray maxSmall:hidden">
          <ProfileBusinessHours />
          <div className="flex flex-col gap-10">
            <BioAndContacts proId={proIdBook} />
            <AdditionalPolicies />
          </div>
        </div>

        <div className="container mt-[60px] mb-[100px] maxSmall:hidden">
          <ProfileServices proId={proId} />
        </div>
        {!isSmall ? (
          <div className="maxSmall:hidden">
            <ProfileInspirationSlider proId={proId} />
            <ProfileReviews />
          </div>
        ) : null}
        <div
          className="small:mt-[60px] small:mb-[120px] small:block hidden"
          id="location_map"
        >
          <LocationMap
            address={address}
            latitude={latitude}
            longitude={longitude}
            distance={distance}
          />
        </div>
        <div className="hidden small:block small:my-0">
          <InstagramFeed />
        </div>
        <div className="mb-10 maxSmall:hidden">
          <ProfileTermsOfPayment />
        </div>
        <div className="maxSmall:hidden overflow-x-hidden">
          <SimilarPros />
        </div>
      </MainLayout>
      <ImagePreviewModal />
    </BaseLayout>
  )
}

import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { useCallback, useMemo } from 'react'

import { ITab } from '@/components/common/steppers/Stepper'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import AboutStep from '@/features/profile/components/mobile/steps/aboutStep/AboutStep'
import { profileRatingSelector } from '@/features/profile/store/profileSelectors'
import { setStep } from '@/features/profile/store/profileSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { inspirationsByIdSelector } from '@/store/commonStor/inspirations/inspirationsSelectors'
const ServicesStep = dynamic(
  () => import('@/features/profile/components/mobile/steps/ServicesStep')
)

const FaqTab = dynamic(
  () => import('@/features/profile/components/mobile/steps/faq/FaqTab')
)
const InspirationsStep = dynamic(
  () => import('@/features/profile/components/mobile/steps/InspirationsStep')
)
const ReviewStep = dynamic(
  () =>
    import('@/features/profile/components/mobile/steps/reviewsStep/ReviewStep')
)

export const useProfileSteps = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  const { data } = useAppSelector(inspirationsByIdSelector)

  const rating = useAppSelector(profileRatingSelector)
  const dispatch = useAppDispatch()
  const onSetStep = useCallback(
    (id: string) => {
      dispatch(setStep(id))
    },
    [dispatch]
  )
  const currentTab = useAppSelector((state) => state.profile.step)
  const reviewsTab = useMemo(
    () =>
      rating.data.reviewCount === 0
        ? null
        : {
            label: t('tabs.reviews'),
            content: <ReviewStep />,
            id: 'reviews',
            sideEffect: onSetStep,
          },
    [onSetStep, rating.data.reviewCount, t]
  )

  const inspirationsTab = useMemo(
    () =>
      data?.length === 0
        ? null
        : {
            label: t('tabs.inspiration'),
            content: <InspirationsStep />,
            id: 'inspiration',
            sideEffect: onSetStep,
          },
    [data?.length, onSetStep, t]
  )

  const tabs: (ITab | null)[] = useMemo(() => {
    return [
      {
        label: t('tabs.services'),
        content: <ServicesStep />,
        id: 'services',
        sideEffect: onSetStep,
      },
      reviewsTab,
      inspirationsTab,
      {
        label: t('tabs.about'),
        content: <AboutStep />,
        id: 'about',
        sideEffect: onSetStep,
      },
      {
        label: t('tabs.faq'),
        content: <FaqTab />,
        id: 'faq',
        sideEffect: onSetStep,
      },
    ]
  }, [inspirationsTab, onSetStep, reviewsTab, t])
  return { tabs, currentTab }
}

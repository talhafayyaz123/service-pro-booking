import { useEffect, useMemo } from 'react'

import { SideStepper } from '@/components/common/steppers/SideStepper'
import { H40 } from '@/components/typography'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import { LeftStepperSkeleton } from '@/features/profile/components/profileSkeleton/ServicesSkeletons'
import { ProfileServiceInfo } from '@/features/profile/components/services/ProfileServiceInfo'
import { getProfileProServicesThunk } from '@/features/profile/store/profileRequests'
import {
  profileSelector,
  profileServicesSelector,
} from '@/features/profile/store/profileSelectors'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

interface Props {
  proId: string
}

export const ProfileServices = ({ proId }: Props) => {
  const dispatch = useAppDispatch()
  const { status, data } = useAppSelector(profileServicesSelector)
  const profile = useAppSelector(profileSelector)
  const currencySign = getCurrencySignByName(profile.data?.currency || '')

  useEffect(() => {
    if (proId) {
      dispatch(getProfileProServicesThunk(proId))
    }
  }, [dispatch, proId])

  const tabs = useMemo(() => {
    return (data || [])
      .map(
        ({ name, id, ...rest }) => ({
          label: `${name} (${rest.categories.length})`,
          content: rest.categories.length
            ? rest.categories.map((el, index) => (
                <div
                  key={index + id}
                  className={`pb-6 border-b border-lightGray ${
                    index !== 0 ? ' mt-6' : ''
                  }`}
                >
                  <ProfileServiceInfo
                    isShowExtraTime={false}
                    currencySign={currencySign}
                    lines={5}
                    proId={proId}
                    useProIdfromRouter
                    {...el}
                  />
                </div>
              ))
            : null,
          id,
        }),
        []
      )
      .filter((item) => !!item.content && item.content?.length > 0)
  }, [data, currencySign, proId])

  return (
    <>
      {status ? (
        <LeftStepperSkeleton />
      ) : tabs?.length !== 0 ? (
        <SideStepper
          title={<H40 className="!font-bold mb-6">Services</H40>}
          scrollAfterClick
          stickyTop="top-[60px]"
          tabs={tabs}
        />
      ) : null}
    </>
  )
}

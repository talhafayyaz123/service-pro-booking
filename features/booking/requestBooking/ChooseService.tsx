import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Button } from '@/components/common/buttons/Button'
import { BaseLink } from '@/components/common/links/BaseLink'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { H28 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import { AddOns } from '@/features/booking/addOns/AddOns'
import {
  DeleteServiceButton,
  ServiceInfo,
  ServiceInfoSkeleton,
} from '@/features/booking/components/ServiceInfo'
import {
  addedServicesSelector,
  bookingServicesSelector,
} from '@/features/booking/store/bookingSelectors'
import {
  deleteReferenceServices,
  deleteService,
} from '@/features/booking/store/bookingStore'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

import { deleteServiceFromQuery } from '../bookingHelpers'

export const ChooseService = () => {
  const dispatch = useAppDispatch()
  const addedServices = useAppSelector(addedServicesSelector)
  const { status } = useAppSelector(bookingServicesSelector)
  const { data } = useAppSelector(profileSelector)

  const router = useRouter()
  const onOpenAddServiceModal = useCallback(() => {
    dispatch(setModal({ currentModal: undefined }))
    setTimeout(
      () => dispatch(setModal({ currentModal: MODALS_TYPE.CHOOSE_SERVICE })),
      0
    )
  }, [dispatch])

  const handleDelete = useCallback(
    (id: string) => {
      if (id) {
        dispatch(deleteService(id))
        deleteServiceFromQuery(router, id)
      }
    },
    [dispatch, router]
  )

  return (
    <CardWrapper className="px-5 pt-6 pb-8 h-fit tablet:p-10 maxTablet:shadow-none maxTablet:rounded-b-none laptop:sticky top-2">
      <div className="flex items-center justify-between">
        <H28 className="maxTablet:hidden">Choose a service</H28>
        <span className="tablet:hidden">Choose a service</span>

        <Button className="maxTablet:hidden" onClick={onOpenAddServiceModal}>
          Add service
        </Button>
      </div>
      {status ? (
        <ServiceInfoSkeleton
          button={<BaseSkeleton className="!w-6 !h-6 rounded-full" />}
          className="mt-5"
        />
      ) : (
        <CardWrapper
          className={`tablet:${
            addedServices.length === 0 ? 'hidden' : ''
          } mt-3 tablet:mt-5 grid gap-6 `}
        >
          {addedServices.length !== 0 && (
            <div className="flex flex-col gap-5 maxTablet:border-b maxTablet:border-lightGray maxTablet:pb-5">
              {addedServices.map((el) => (
                <ServiceInfo
                  className="p-0 rounded-none shadow-none"
                  key={el.id}
                  button={
                    <DeleteServiceButton
                      onClick={() => {
                        handleDelete(el.id || '')
                        dispatch(deleteReferenceServices(el.id))
                      }}
                    />
                  }
                  {...el}
                  extraTime={0}
                  currencySign={getCurrencySignByName(data.currency || '')}
                />
              ))}
            </div>
          )}
          <div className="flex justify-center -mx-5 tablet:hidden">
            <BaseLink
              line={false}
              linkType="orange"
              type="button"
              onClick={onOpenAddServiceModal}
            >
              + Add service
            </BaseLink>
          </div>
        </CardWrapper>
      )}
      <AddOns />
    </CardWrapper>
  )
}

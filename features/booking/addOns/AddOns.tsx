import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Button } from '@/components/common/buttons/Button'
import { useModalData } from '@/components/modals/Modal'
import { H20 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import {
  AddonCard,
  AddonCardSkeleton,
} from '@/features/booking/addOns/AddonCard'
import { AddOnsModal } from '@/features/booking/addOns/AddOnsModal'
import { getAddonsFromProRequest } from '@/features/booking/store/bookingRequests'
import {
  addedAddonsIdsSelector,
  addonsLoadingStatus,
  previewAddOnsSelector,
} from '@/features/booking/store/bookingSelectors'
import { selectAddon } from '@/features/booking/store/bookingStore'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const AddOns = () => {
  const previewAddons = useAppSelector(previewAddOnsSelector)
  const allAddedAddons = useAppSelector(addedAddonsIdsSelector)
  const router = useRouter()

  const isLoading = useAppSelector(addonsLoadingStatus)

  const { isOpen } = useModalData(MODALS_TYPE.ADDONS_MODAL)
  const dispatch = useAppDispatch()
  const handleOpenModal = () =>
    dispatch(setModal({ currentModal: MODALS_TYPE.ADDONS_MODAL }))

  useEffect(() => {
    dispatch(
      getAddonsFromProRequest({
        proId: String(router.query?.proId || ''),
        servicesIds: router.query.selectedServices
          ? String(router.query.selectedServices).split(',')
          : [],
      })
    )
  }, [dispatch, router.query?.proId, router.query.selectedServices])

  if (!(previewAddons?.length > 0)) {
    return <></>
  }

  return (
    <div>
      <div className={'flex items-center justify-between mt-6'}>
        <H20>Add-ons</H20>
        {previewAddons.length > 2 && (
          <Button onClick={handleOpenModal}>See more</Button>
        )}
      </div>
      <div className={'grid desktop:grid-cols-2 gap-4 mt-4'}>
        {isLoading && (
          <>
            <AddonCardSkeleton />
            <AddonCardSkeleton />
          </>
        )}
        {!isLoading &&
          previewAddons.length > 0 &&
          previewAddons
            .slice(0, 2)
            .map((el) => (
              <AddonCard
                onClick={(id) => dispatch(selectAddon(id))}
                isActive={allAddedAddons.includes(el?.id)}
                key={el?.id}
                {...el}
              />
            ))}
        {!isLoading && previewAddons.length === 0 && (
          <div className={'col-span-2'}>
            The selected service does not have add-ons
          </div>
        )}
      </div>
      {isOpen && <AddOnsModal />}
    </div>
  )
}

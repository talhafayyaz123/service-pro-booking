import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo } from 'react'

import { addServicesToQuery } from '@/features/booking/bookingHelpers'
import {
  addedServicesSelector,
  referenceServicesSelector,
} from '@/features/booking/store/bookingSelectors'
import {
  addServicesById,
  deleteReferenceServices,
  IBookingReference,
  setReferenceServices,
} from '@/features/booking/store/bookingStore'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const useAddServices = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const reference = useAppSelector(referenceServicesSelector)
  const referenceIds = useMemo(
    () => reference.map((ref) => ref.id),
    [reference]
  )
  const isRefHasMobile = reference.some((ref) => ref.isMobile)
  const addedServices = useAppSelector(addedServicesSelector)

  const handleReferenceAdd = useCallback(
    (service: IBookingReference | IBookingReference[]) =>
      dispatch(setReferenceServices(service)),
    [dispatch]
  )
  const handleDeleteReference = useCallback(
    (service?: string) => dispatch(deleteReferenceServices(service)),
    [dispatch]
  )
  const onClose = useCallback(() => {
    dispatch(setModal({ currentModal: undefined }))
  }, [dispatch])

  const onSave = useCallback(async () => {
    const ids = reference.map((ref) => ref.id)
    dispatch(addServicesById(ids))
    addServicesToQuery(router, ids)
    onClose()
  }, [reference, dispatch, onClose, router])

  const disabled = useMemo(
    () =>
      JSON.stringify([...reference].map((ref) => ref.id).sort()) ===
      JSON.stringify(addedServices.map((service) => service.id).sort()),
    [addedServices, reference]
  )
  useEffect(() => {
    dispatch(
      handleReferenceAdd(
        addedServices.map((service) => ({
          id: (service.id as string) || '',
          isMobile: service.isMobile || false,
        }))
      )
    )
  }, [addedServices, dispatch, handleReferenceAdd])

  return {
    disabled,
    reference,
    referenceIds,
    isRefHasMobile,
    onSave,
    onClose,
    handleReferenceAdd,
    handleDeleteReference,
  }
}

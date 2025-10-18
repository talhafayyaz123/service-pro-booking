import { useCallback } from 'react'

import { ITemplateForm } from '@/features/booking/store/bookingStore'
import { setForm } from '@/features/customForm/store/slice'
import { IConvertableForm } from '@/features/customForm/types'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const useHelpersCustomForm = (customForms: ITemplateForm[]) => {
  const dispatch = useAppDispatch()
  const { state } = useAppSelector((state) => state.modals)
  const currentFormsData = useAppSelector((state) => state.customForm.forms)
  // this custom for id is coming from places where MODALS_TYPE.FORM_TEMPLATE_MODAL is set to modal
  const currentForm = customForms.find((el) => el.id === state?.id)

  const onClose = useCallback(() => {
    dispatch(setModal({}))
    const current = currentFormsData.filter(
      (el) => el.id === currentForm?.id
    )?.[0]
    if (current?.data === null && current?.isRequiredForm)
      dispatch(setForm({ id: currentForm?.id || '', clearClose: true }))
  }, [currentForm?.id, currentFormsData, dispatch])

  const handleSubmit = useCallback(
    async (data: IConvertableForm) => {
      await dispatch(setForm({ data, id: data.customFormId }))
      await dispatch(setModal({}))
    },
    [dispatch]
  )
  return { handleSubmit, onClose, currentForm }
}

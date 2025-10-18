import { IconArrow } from '@/assets/icons/icons'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { H16, H24 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { CustomFormStatus } from '@/features/customForm/components/CustomFormStatus'
import { ViewBookingsCustomFormModal } from '@/features/customForm/modals/ViewBookingsCustomFormModal'
import { viewBookingsCustomFormsSelector } from '@/features/customForm/store/selectors'
import { setForm } from '@/features/customForm/store/slice'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'
import { IProInfo } from '@/types/profileInfoTypes'

export const ViewBookingCustomForm = () => {
  const { pro, formAnswers } = useAppSelector(viewBookingsCustomFormsSelector)

  const { currentModal, state } = useAppSelector((state) => state.modals)

  const proInfo: IProInfo = {
    slug: pro?.slug || pro?.id,
    iconUrl: pro.iconUrl || '',
    name: (pro?.firstName || '') + ' ' + (pro?.lastName || ''),
    address: pro?.address || '',
  }

  const dispatch = useAppDispatch()

  const handleClick = ({
    id,
    isAnswered,
  }: {
    id: string
    isAnswered: boolean
  }) => {
    dispatch(
      setModal({
        currentModal: MODALS_TYPE.VIEW_BOOKINGS_FORM_TEMPLATE_MODAL,
        state: { id, isAnswered },
      })
    )
    dispatch(setForm({ id, isTouched: true }))
  }

  return (
    <div>
      {(formAnswers || [])?.length > 0 && (
        <CardWrapper className={'px-5 py-0 mt-2.5'}>
          <H24 className={'mt-5 block'}>Forms</H24>
          {formAnswers?.map((el) => (
            <div
              key={el.id}
              role={'button'}
              onClick={() =>
                handleClick({ id: el.id, isAnswered: !!el.isAnswered })
              }
              className={`last-of-type:border-0 border-b border-lightGray py-5`}
            >
              <div className={`grid grid-cols-[1fr_auto] gap-8 mb-2`}>
                <H16 className={'truncate'}>
                  {el.title}
                  {el.isRequired ? (
                    <span className={'text-red-500'}>*</span>
                  ) : (
                    "  (It's optional)"
                  )}
                </H16>
                <IconArrow className={'stroke-black rotate-180 w-5'} />
              </div>
              <CustomFormStatus
                id={el.id}
                isRequiredForm={el.isRequired}
                isAnswered={!!el.isAnswered}
              />
            </div>
          ))}
        </CardWrapper>
      )}
      {currentModal === MODALS_TYPE.VIEW_BOOKINGS_FORM_TEMPLATE_MODAL && (
        <ViewBookingsCustomFormModal
          showSendButton={!state?.isAnswered}
          proInfo={proInfo}
        />
      )}
    </div>
  )
}

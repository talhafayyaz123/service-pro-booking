import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'

import { IconArrow } from '@/assets/icons/icons'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { H16, H20 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { cn } from '@/core/helpers/cn'
import { Card } from '@/features/accountSetup/steps/CardWrapper'
import { ITemplateForm } from '@/features/booking/store/bookingStore'
import { CustomFormStatus } from '@/features/customForm/components/CustomFormStatus'
import { useCustomFormStore } from '@/features/customForm/hooks/useCustomFormStore'
import { TemplateFormModal } from '@/features/customForm/modals/TemplateFormModal'
import {
  setForm,
  useGetCustomFormQuery,
} from '@/features/customForm/store/slice'
import { useDepositRequestedBookingStore } from '@/features/paymentLink/store/store'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'
import { IProInfo } from '@/types/profileInfoTypes'

export const BookingInfoCustomForm = () => {
  const router = useRouter()
  const proId = String(router.query.proId)

  const profile = useAppSelector((state) => state.profile.iProInfo.data)
  const selectedServices = router.query.selectedServices as string | undefined
  const _selectedServicesArr = (selectedServices || '').split(',')
  const { data, isFetching } = useGetCustomFormQuery({
    proId,
    serviceIds: _selectedServicesArr,
  })
  return (
    <>
      {(data || []).length > 0 && (
        <div className={'mt-8 mb-5 tablet:mb-0'}>
          <H16>Fill in the form</H16>
          <TemplateFormsView
            proInfo={profile}
            forms={data}
            isFetching={isFetching}
          />
        </div>
      )}
    </>
  )
}

export const TemplateFormsView = ({
  isFetching,
  forms,
  proInfo,
  title,
  className,
  isUsedInWalkInBooking,
}: {
  isFetching: boolean
  forms?: ITemplateForm[]
  proInfo: IProInfo
  title?: ReactNode
  className?: string
  isUsedInWalkInBooking?: boolean
}) => {
  const changeBookingType = useDepositRequestedBookingStore(
    (state) => state.changeBookingType
  )
  const currentModal = useAppSelector((state) => state.modals.currentModal)

  useEffect(() => {
    if (isUsedInWalkInBooking) {
      changeBookingType('walkIn')
    }
  }, [isUsedInWalkInBooking, changeBookingType])

  const renderedForms = isUsedInWalkInBooking ? (
    <div className="flex flex-col gap-3">
      {forms?.map((el) => (
        <Card key={el.id}>
          <TemplateElement
            isUsedInWalkInBooking={isUsedInWalkInBooking}
            isRequiredForm={!!el.isRequired}
            title={el.title}
            id={el.id || ''}
            isAnswered={el.isAnswered}
            className="p-0"
          />
        </Card>
      ))}
    </div>
  ) : (
    <CardWrapper className={cn('px-5 py-0 mt-2.5', className)}>
      {title}
      {forms?.map((el) => (
        <TemplateElement
          isRequiredForm={!!el.isRequired}
          title={el.title}
          id={el.id || ''}
          key={el.id}
          isAnswered={el.isAnswered}
        />
      ))}
    </CardWrapper>
  )

  return (
    <>
      {isFetching ? (
        <CardWrapper
          className={cn('p-5 mt-2.5 flex flex-col gap-1 mb-2', className)}
        >
          <BaseSkeleton className={'!w-48 !h-[22px]'} />
          <BaseSkeleton className={'!w-20 !h-[22px]'} />
        </CardWrapper>
      ) : (
        <>{forms && forms.length > 0 && renderedForms}</>
      )}
      {currentModal === MODALS_TYPE.FORM_TEMPLATE_MODAL && (
        <TemplateFormModal
          isUsedInWalkInBooking={isUsedInWalkInBooking}
          proInfo={proInfo}
          customForms={forms || []}
        />
      )}
    </>
  )
}
const TemplateElement = ({
  title,
  id,
  isRequiredForm,
  isAnswered,
  className,
  isUsedInWalkInBooking,
}: {
  title: string
  id: string
  isRequiredForm: boolean
  isAnswered?: boolean
  className?: string
  isUsedInWalkInBooking?: boolean
}) => {
  const dispatch = useAppDispatch()
  const setLastOpenedCustomFormId = useCustomFormStore(
    (state) => state.setLastOpenedCustomFormId
  )

  const handleClick = () => {
    dispatch(
      setModal({
        currentModal: MODALS_TYPE.FORM_TEMPLATE_MODAL,
        state: { id },
      })
    )
    setLastOpenedCustomFormId(id)
    dispatch(setForm({ id, isTouched: true }))
  }

  const Title = isUsedInWalkInBooking ? H20 : H16

  return (
    <div
      role={'button'}
      onClick={handleClick}
      className={cn(
        'last-of-type:border-0 border-b border-lightGray py-5',
        className
      )}
    >
      <div className={`grid grid-cols-[1fr_auto] gap-8 mb-2`}>
        <Title
          className={cn('truncate', isUsedInWalkInBooking && '!leading-6')}
        >
          {title}
          {isRequiredForm ? (
            <span className={'text-red-500'}>*</span>
          ) : isUsedInWalkInBooking ? (
            ''
          ) : (
            "  (It's optional)"
          )}
        </Title>
        <IconArrow
          className={cn(
            'stroke-black rotate-180 w-5',
            isUsedInWalkInBooking && 'translate-y-4'
          )}
        />
      </div>
      <CustomFormStatus
        isAnswered={isAnswered}
        isRequiredForm={isRequiredForm}
        id={id}
      />
    </div>
  )
}

import React, { useCallback, useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { IconArrowLeft } from '@/assets/icons/icons'
import { UserIcon } from '@/components/cardElements/UserIcon'
import { Button } from '@/components/common/buttons/Button'
import { Modal } from '@/components/modals/Modal'
import { H12, H16, H18, H24 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { getSingleBookingRequest } from '@/features/bookings/store/bookingsRequests'
import { CustomForm } from '@/features/customForm/CustomForm'
import {
  convertToDefault,
  setAnswers,
} from '@/features/customForm/helpers/helpers'
import { currentFormSelector } from '@/features/customForm/store/selectors'
import { useLazySendSingleFormQuery } from '@/features/customForm/store/slice'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'
import { IProInfo } from '@/types/profileInfoTypes'

export const ViewBookingsCustomFormModal = ({
  proInfo,
  showSendButton,
}: {
  proInfo: IProInfo
  showSendButton?: boolean
}) => {
  const { onClose, onSubmit, isFetching, currentForm } = useHelpers()
  const methods = useForm({
    defaultValues: convertToDefault(currentForm),
    shouldFocusError: true,
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    ref.current && ref.current?.focus()
  }, [])

  return (
    <Modal
      space={'pt-4 tablet:pt-6'}
      titleClassName={'px-4 tablet:px-5'}
      maxWidth={600}
      outsideClose={false}
      title={<H24 className={'maxTablet:!text-20'}>Custom form</H24>}
      onClose={onClose}
      isOpen={true}
      isAppLayout={false}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((v) => onSubmit(v as any))}>
          <div className={'text-start flex flex-col'}>
            <a
              href={proInfo.slug ? ROUTES.profile(proInfo.slug) : '#'}
              className="flex items-center border-b border-lightGray justify-between py-3 tablet:py-5 mt-3 tabet:mt-5 cursor-pointer text-start px-8"
            >
              <div className="flex items-center gap-4">
                <UserIcon size={'40'} iconUrl={proInfo.iconUrl} />
                <div>
                  <H18>{proInfo.name}</H18>
                  <H12 className="block" color="text-gray">
                    {proInfo.address}
                  </H12>
                </div>
              </div>
              <IconArrowLeft className="rotate-180 stroke-black" />
            </a>
            <div
              className={
                'px-8 min-h-fit overflow-auto !max-h-[50vh] laptop:!max-h-[55vh] desktop:max-!h-[60vh] largeDesktop:max-h-[63vh] hr:max-h-[67vh] pr-6 pt-3 pb-4 tablet:py-5'
              }
            >
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
              <div tabIndex={0} ref={ref} />
              <H24>{currentForm?.title}</H24>
              <H16 color={'text-gray'} className={'mt-3'}>
                {currentForm?.description}
              </H16>
              <CustomForm />
            </div>

            {showSendButton && (
              <div className={'border-lightGray border-t '}>
                <div className={'p-5'}>
                  <Button
                    disabled={isFetching}
                    className={'w-full'}
                    type={'submit'}
                    buttonType={'orange'}
                  >
                    Send
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}

const useHelpers = () => {
  const currentForm = useAppSelector(currentFormSelector)

  const [request, data] = useLazySendSingleFormQuery()

  const bookingId = useAppSelector(
    (state) => state.bookings.bottomSheet.id || ''
  )

  const dispatch = useAppDispatch()

  const onClose = useCallback(() => {
    dispatch(setModal({}))
  }, [dispatch])

  const onSubmit = useCallback(
    async (data: any) => {
      await request({
        bookingId,
        formAnswers: [
          {
            formAnswerId: data?.formAnswerId,
            answers: data?.answers.map(setAnswers),
          },
        ],
      }).then(async (value) => {
        if (!value.isError) {
          await dispatch(getSingleBookingRequest(bookingId || ''))
          await dispatch(setModal({}))
        }
      })
    },
    [bookingId, dispatch, request]
  )
  return {
    onClose,
    onSubmit,
    isFetching: data.isFetching,
    currentForm,
  }
}

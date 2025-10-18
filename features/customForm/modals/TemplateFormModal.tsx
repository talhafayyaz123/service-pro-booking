import { useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { shallowEqual } from 'react-redux'

import { IconArrowLeft, IconChevroLeft } from '@/assets/icons/icons'
import { UserIcon } from '@/components/cardElements/UserIcon'
import { Button } from '@/components/common/buttons/Button'
import { Modal } from '@/components/modals/Modal'
import { H12, H16, H18, H24 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { cn } from '@/core/helpers/cn'
import { ITemplateForm } from '@/features/booking/store/bookingStore'
import { CustomForm } from '@/features/customForm/CustomForm'
import { getSavedData } from '@/features/customForm/helpers/persistFormMethods'
import { useHelpersCustomForm } from '@/features/customForm/hooks/useHelpersCustomForm'
import { usePersistForm } from '@/features/customForm/hooks/usePersistForm'
import { defaultValuesSelector } from '@/features/customForm/store/selectors'
import { IConvertableForm } from '@/features/customForm/types'
import { useAppSelector } from '@/hooks/hooks'
import { useMatchMedia } from '@/hooks/useMediaScreen'
import { IProInfo } from '@/types/profileInfoTypes'

export const TemplateFormModal = ({
  customForms,
  proInfo,
  isUsedInWalkInBooking,
}: {
  customForms: ITemplateForm[]
  proInfo: IProInfo
  isUsedInWalkInBooking?: boolean
}) => {
  const { handleSubmit, onClose, currentForm } =
    useHelpersCustomForm(customForms)

  const defaultValues = useAppSelector(
    (state) => defaultValuesSelector(state, customForms),
    shallowEqual
  ) as IConvertableForm

  const refinedDefaultValues = getSavedData({
    defaultValues,
    customFormId: currentForm?.id,
  })

  const methods = useForm({
    defaultValues: refinedDefaultValues,
    shouldFocusError: true,
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const watchAll = methods.watch()
  usePersistForm({
    localStorageKey: `${currentForm?.id}`,
    value: { ...watchAll },
  })

  const unAnsweredReuiredQuestions = watchAll?.answers.filter(
    ({ answer, isRequired }) => {
      // check for un answered
      let condition = false

      if (typeof answer === 'boolean' && !answer) {
        condition = !answer
      }

      if (typeof answer === 'string') {
        condition = !answer
      }

      if (Array.isArray(answer)) {
        condition = !answer.some((item) => item.isChecked === 'true')
      }

      return isRequired && condition
    }
  )

  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    ref.current && ref.current?.focus()
  }, [])

  const renderModalProps = () => {
    if (isUsedInWalkInBooking) {
      return {
        isOpen: true,
        onClose,
        space: '',
        onCloseButton: false,
        className: 'h-full w-full',
        wrapperClassName: 'p-0',
        hideTransition: true,
      }
    }

    return {
      space: 'pt-4 tablet:pt-6',
      titleClassName: 'px-4 tablet:px-5',
      maxWidth: 600,
      outsideClose: false,
      title: <H24 className={'maxTablet:!text-20'}>Custom form</H24>,
      onClose: onClose,
      isOpen: true,
      isAppLayout: false,
    }
  }

  // Detect screen
  const [isDesktop] = useMatchMedia(['(min-width: 1060px)'])

  return (
    <Modal {...renderModalProps()}>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit((v) => {
            handleSubmit(v as IConvertableForm)
          })}
          className={cn(isUsedInWalkInBooking && 'bg-white pb-25')}
        >
          <div className={'text-start flex flex-col'}>
            {isUsedInWalkInBooking && (
              <>
                {isDesktop && (
                  <div
                    className={
                      'w-full absolute top-0 maxTablet:hidden left-0 bg-violet z-[0] h-[414px]'
                    }
                  />
                )}
                <div
                  className={cn(
                    'flex items-center justify-center py-4 pt-10 relative mx-4',
                    isDesktop && 'px-20 mx-0 py-8 bg-white shadow-xl'
                  )}
                >
                  {isDesktop ? (
                    <Button
                      className="px-[14px] !h-[42px] !absolute left-20"
                      buttonType="withIcon"
                      onClick={onClose}
                    >
                      Back
                    </Button>
                  ) : (
                    <div role="button" onClick={onClose}>
                      <IconChevroLeft className="absolute left-0 top-10" />
                    </div>
                  )}
                  <H16
                    className={cn(
                      '!font-bold',
                      isDesktop && 'text-24 leading-8'
                    )}
                  >
                    Custom form
                  </H16>
                </div>
              </>
            )}

            {/* This div is only used in walk in booking and desktop */}
            <div
              className={cn(
                isUsedInWalkInBooking &&
                  isDesktop &&
                  'relative z-10 bg-white mt-20 rounded-20 shadow-xl max-w-[600px] mx-auto p-15 w-full'
              )}
            >
              {/* inner wrapper */}
              {/* This div is only used in walk in booking and desktop */}
              <div
                className={cn(
                  isUsedInWalkInBooking &&
                    isDesktop &&
                    'bg-white shadow-xl rounded-20 pt-3 pb-1 px-8'
                )}
              >
                {(!isUsedInWalkInBooking ||
                  (isUsedInWalkInBooking && isDesktop)) && (
                  <a
                    href={
                      proInfo.slug
                        ? `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.profile(
                            proInfo.slug
                          )}`
                        : '#'
                    }
                    className={cn(
                      'flex items-center border-b border-lightGray justify-between py-3 tablet:py-5 mt-3 tabet:mt-5 cursor-pointer text-start px-8',
                      isUsedInWalkInBooking && isDesktop && 'px-0'
                    )}
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
                )}
                <div
                  className={cn(
                    'px-8 min-h-fit overflow-auto !max-h-[50vh] laptop:!max-h-[55vh] desktop:max-!h-[60vh] largeDesktop:max-h-[63vh] hr:max-h-[67vh] pr-6 pt-3 pb-4 tablet:py-5',
                    isUsedInWalkInBooking && 'px-0 py-0 pb-20'
                  )}
                >
                  {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
                  <div tabIndex={0} ref={ref} />

                  <div
                    className={cn(
                      isUsedInWalkInBooking && 'px-5 mb-6 pt-6',
                      isUsedInWalkInBooking && isDesktop && 'px-0'
                    )}
                  >
                    <H24>{currentForm?.title}</H24>
                    <H16 color={'text-gray'} className={'mt-3'}>
                      {currentForm?.description}
                    </H16>
                  </div>

                  <CustomForm
                    className={cn(
                      isUsedInWalkInBooking &&
                        'shadow-xl rounded-20 px-5 pt-1 pb-6 z-10',
                      isUsedInWalkInBooking && isDesktop && 'shadow-none px-0'
                    )}
                  />
                </div>
              </div>
            </div>

            <div
              className={cn(
                'border-lightGray border-t',
                isUsedInWalkInBooking &&
                  'fixed bottom-0 left-0 right-0 bg-white rounded-t-20 border-none shadow-xl z-20',
                isUsedInWalkInBooking && isDesktop && '!rounded-none'
              )}
            >
              <div
                className={cn(
                  'p-5',
                  isUsedInWalkInBooking && isDesktop && 'flex justify-end px-20'
                )}
              >
                <Button
                  className={cn(
                    'w-full',
                    isUsedInWalkInBooking && isDesktop && 'w-[141px]'
                  )}
                  type={'submit'}
                  buttonType={'orange'}
                  disabled={unAnsweredReuiredQuestions.length > 0}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}

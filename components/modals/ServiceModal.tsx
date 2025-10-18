import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form'
import { BottomSheet } from 'react-spring-bottom-sheet'
import uuid from 'react-uuid'

import { getbusinessTypes } from '@/api/onboarding-pro/get-business-types'
import { getSuggestedServices } from '@/api/onboarding-pro/getSuggestedServices'
import { Button } from '@/components/common/buttons/Button'
import { Dropdown } from '@/components/common/dropdown/Dropdown'
import { FormInput } from '@/components/common/FormInput'
import { FormTextArea } from '@/components/common/FormTextArea'
import { Toggle } from '@/components/common/Toggle'
import { ImageInput } from '@/components/ImageInput/ImageInput'
import { Modal } from '@/components/modals/Modal'
import { H14, H16, H20, H24 } from '@/components/typography'
import {
  extraTimeDurations,
  hourDurations,
  minuteDurations,
} from '@/core/consts/durations'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import {
  getHoursFromMinutes,
  getOnlyMinutes,
} from '@/features/accountSetup/helpers/durationConverters'
import { useChoseServices } from '@/features/accountSetup/hooks/useChooseServices'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { IService, IServiceModal } from '@/types/categoriesTypes'
import { IOptions } from '@/types/common'
import { TBusinessTypes } from '@/types/onboarding'

interface IFormService {
  name: string
  isMobile: boolean
  price: string
  duration: number | null
  isExtraTime: boolean
  extraTime: IOptions | null
  description: string
  order: number
  image: string
  categoryId: IOptions | null
}

const defaultValues: IFormService = {
  description: '',
  duration: 90,
  extraTime: null,
  isExtraTime: false,
  isMobile: false,
  categoryId: null,
  name: '',
  order: 0,
  price: '',
  image: '',
}

const ServiceModal: React.FC<IServiceModal> = ({
  isEditing,
  service,
  onClose,
  isOpen,
  onAdd,
  onEdit,
  onDelete,
  currency,
  category,
  businessTypes,
}) => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const [suggestedService, setSuggestedService] = useState<string>('')
  const router = useRouter()
  const methods = useForm<IFormService>({
    defaultValues,
  })
  const { data: bussinessTypes } = useQuery({
    queryKey: ['business-types'],
    queryFn: getbusinessTypes,
  })

  const mobile = router.query?.mobile

  const { reset, setValue, watch } = methods

  const {
    image,
    extraTime,
    categoryId,
    hoursValue,
    isDisabled,
    isExtraTime,
    isMobile,
    minutesValue,
    businessTypesMap,
    onSubmit,
    resetState,
    onHoursChange,
    onMinutesChange,
  } = useServiceModal({
    service,
    methods,
    isEditing,
    businessTypes,
    onAdd,
    onEdit,
    onClose,
  })

  const { data: suggested } = useQuery({
    queryKey: ['onboarding', 'pro', categoryId?.value],
    queryFn: () => getSuggestedServices((categoryId?.value as string) ?? ''),
  })

  const { items } = useChoseServices({ watch, setValue })

  const title = isEditing ? 'Edit service' : 'Add new service'

  const _onClose = () => {
    onClose()
    reset(defaultValues)
    resetState()
  }

  const footer = (
    <>
      <Button
        disabled={isDisabled}
        type="submit"
        onClick={onSubmit}
        className="w-full"
        buttonType="orange"
      >
        {t('labels.save')}
      </Button>
      {isEditing ? (
        <Button
          className="w-full ml-5"
          type="button"
          buttonType="lightMain"
          onClick={() => {
            onDelete()
            reset(defaultValues)
            onClose()
          }}
        >
          {t('labels.delete')}
        </Button>
      ) : null}
    </>
  )

  const businessTypesOptions = useMemo(() => {
    return (bussinessTypes?.categories ?? []).map((type) => ({
      value: type.id,
      label: type.name,
    }))
  }, [bussinessTypes])

  useEffect(() => {
    const categoryId = businessTypesMap.find(
      ({ label }) => label === category
    ) || { value: '', label: '' }

    setValue('categoryId', categoryId)
    //eslint-disable-next-line
  }, [category])

  return (
    <Wrapper footer={footer} isOpen={isOpen} onClose={_onClose} title={title}>
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="h-full">
          <div className="small:px-8 px-5 small:pt-5 pt-0 pb-8 max-h-[60dvh] h-full overflow-y-auto">
            <H16 color="text-gray" className="mb-6 small:mb-0 maxSmall:hidden">
              {t('text.add_more_details')}
            </H16>
            <H20 className="my-5 maxSmall:hidden">
              {t('titles.service_details')}
            </H20>
            <div className="">
              <Dropdown
                label={t('labels.business_type')}
                options={businessTypesOptions}
                required
                onChange={(option) => {
                  setValue('categoryId', option)
                }}
                placeholder={t('labels.select_business_type')}
                value={categoryId || { value: '', label: '' }}
              />
            </div>
            <div className="my-5 flex flex-col items-start gap-2.5">
              <H16>{t('titles.suggested_services')}</H16>
              <div className="w-full flex justify-start items-start flex-wrap gap-2">
                {suggested?.data?.map((service) => {
                  const existing = items.find((item) => item.id === service.id)
                  if (existing) return <></>
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        if (suggestedService === service.id) {
                          setSuggestedService('')

                          setValue('name', '')
                          setValue('description', '')
                          setValue('price', '')

                          return
                        }
                        setSuggestedService(service.id)

                        setValue('name', service.name)
                        setValue('description', service.description)
                        setValue('price', service.price + '')

                        setValue('duration', service.duration)
                      }}
                      className={clsx(
                        'rounded-[22px] px-3 py-2 hover:bg-violet-dark hover:text-white',
                        suggestedService === service.id
                          ? 'bg-violet-dark text-white'
                          : 'bg-violet text-violet-dark'
                      )}
                    >
                      {service.name}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="mt-5">
              <FormInput
                label={t('labels.name_of_service')}
                className="mt-5"
                required
                name="name"
              />
              {/* <FormCheckbox
                name="isMobile"
                className="mt-4"
                rightLabel={t('labels.is_it_mobile_service')}
              /> */}
              <FormTextArea
                label={t('labels.optional_description')}
                className="mt-5"
                name="description"
                minRows={5}
                inputClassName={'p-4 pb-[35px] overflow-auto text-wrap'}
                count
                maxLength={500}
              />
              <div className="mt-5">
                <ImageInput
                  text={t('labels.choose_file')}
                  label={t('labels.add_image')}
                  setImage={(image) => setValue('image', image)}
                  image={image}
                />
              </div>
              <H20 className="mt-5">{t('titles.price_duration')}</H20>
              <div className="relative mt-5">
                <H16
                  className="absolute bottom-3.5 left-4 z-40"
                  color="text-gray"
                >
                  {currency?.sign}
                </H16>
                <FormInput
                  name="price"
                  type="number"
                  required
                  label={t('labels.price')}
                  inputClassName="pl-9"
                />
              </div>
              <div className="flex items-end mt-6 space-x-6">
                <Dropdown
                  label={t('labels.duration')}
                  options={hourDurations}
                  required
                  onChange={onHoursChange}
                  placeholder={t('labels.hour')}
                  value={hoursValue}
                />
                <Dropdown
                  options={minuteDurations}
                  required
                  placeholder={t('labels.minute')}
                  onChange={onMinutesChange}
                  value={minutesValue}
                />
              </div>
              <div className="w-full flex justify-between items-center mt-4">
                <div className="flex flex-col gap-1">
                  <H16 className="font-normal">{t('labels.extra_time')}</H16>
                  <H14 color="text-gray">{t('labels.enable_extra_time')}</H14>
                </div>
                <Toggle
                  checked={isExtraTime}
                  setChecked={(value) => setValue('isExtraTime', value)}
                />
              </div>
              {isExtraTime ? (
                <div className="mt-6">
                  <Dropdown
                    label={t('labels.extra_time')}
                    options={extraTimeDurations}
                    required
                    onChange={(opt) => {
                      setValue('extraTime', opt)
                    }}
                    value={extraTime || { label: '', value: '' }}
                  />
                </div>
              ) : null}

              {mobile ? (
                <div className="flex flex-col gap-5 mt-8">
                  <H20>{t('titles.advanced_settings')}</H20>
                  <div className="w-full flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <H16 className="font-normal">
                        {t('labels.mobile_service')}
                      </H16>
                      <H14 color="text-gray">
                        {t('text.enable_mobile_service')}
                      </H14>
                    </div>
                    <Toggle
                      checked={isMobile}
                      setChecked={(value) => setValue('isMobile', value)}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div
            className="small:pt-6 small:flex hidden justify-center items-center small:px-8 px-5 small:pb-8 py-3 rounded-t-[20px] small:rounded-t-none small:rounded-b-[20px] small:!shadow-xl relative z-20"
            style={{
              boxShadow: '0px -4px 27px rgb(182 190 206 / 30%)',
            }}
          >
            {footer}
          </div>
        </form>
      </FormProvider>
    </Wrapper>
  )
}

interface IWrapper {
  isOpen: boolean
  footer: ReactNode
  title: string
  children: ReactNode
  onClose: () => void
}

const Wrapper = ({ children, footer, isOpen, title, onClose }: IWrapper) => {
  const { isSmall } = useMediaScreen()
  return isSmall ? (
    <BottomSheet
      // snapPoints={({ maxHeight }) => [maxHeight - 100]}
      open={isOpen}
      scrollLocking={false}
      className="no-shadow z-[99999999] max-h-[70dvh]"
      blocking
      onDismiss={onClose}
      footer={<div className="flex">{footer}</div>}
      header={<H24 className="font-bold !block text-left">{title}</H24>}
    >
      {children}
    </BottomSheet>
  ) : (
    <Modal
      onClose={onClose}
      maxWidth={503}
      outsideClose={false}
      space="pt-8"
      divider
      titleClassName="px-8 pb-6"
      fromBottom
      className="rounded-3xl mx-6 my-10 rounded-t-[20px]"
      wrapperClassName="flex items-center items-end justify-center p-1"
      title={<H24 className="font-bold mx-auto">{title}</H24>}
      isOpen={isOpen}
    >
      {children}
    </Modal>
  )
}

interface IUserServiceModal {
  methods: UseFormReturn<IFormService, any>
  onAdd: (service: IService) => void
  onEdit: (service: IService) => void
  onClose: () => void
  isEditing: boolean
  service: any
  businessTypes: TBusinessTypes[]
}

const useServiceModal = ({
  methods,
  isEditing,
  onAdd,
  onEdit,
  service,
  onClose,
}: IUserServiceModal) => {
  const { setValue, watch, handleSubmit, reset } = methods

  //eslint-disable-next-line
  //@ts-ignore
  const duration = watch('duration')
  const isExtraTime = watch('isExtraTime')
  const isMobile = watch('isMobile')

  const defaultTouchedFields = {
    minutes: false,
    hours: false,
  }
  const [touchedFields, setTouchedFields] = useState(defaultTouchedFields)

  const resetState = () => {
    setTouchedFields(defaultTouchedFields)
  }

  const { data: bussinessTypes } = useQuery({
    queryKey: ['business-types'],
    queryFn: getbusinessTypes,
  })

  const businessTypesMap = useMemo(() => {
    return (
      bussinessTypes?.categories?.map((type) => ({
        value: type.id,
        label: type.name,
      })) ?? []
    )
  }, [bussinessTypes?.categories])

  const hoursParsed = getHoursFromMinutes(duration || 0)
  const hoursValue =
    touchedFields.hours || (duration && duration >= 60)
      ? {
          label: `${hoursParsed.hours} ${
            hoursParsed.hours > 1 ? 'hours' : 'hour'
          }`,
          value: hoursParsed.minutes,
        }
      : { label: '0 hour', value: 0 }

  const minutes = getOnlyMinutes(duration || 0)
  const minutesValue =
    touchedFields.minutes || duration
      ? { value: minutes, label: `${minutes} min` }
      : { label: '0 min', value: 0 }

  const extraTime = watch('extraTime')
  const categoryId = watch('categoryId')

  const price = watch('price')
  const name = watch('name')
  //eslint-disable-next-line
  //@ts-ignore
  const image = watch('image')

  const isDisabled =
    !duration ||
    (isExtraTime ? !extraTime?.value : false) ||
    !price ||
    !name ||
    !categoryId?.value ||
    +price <= 0

  useEffect(() => {
    if (isEditing && service) {
      const extraTime = extraTimeDurations.find(
        (d) => d.value === service.extraTime
      )
      const categoryId = businessTypesMap.find(
        ({ value }) => value === service.categoryId
      )

      reset({
        ...service,
        extraTime,
        categoryId,
      })
    }
  }, [isEditing, reset, service, businessTypesMap])

  const onSubmit = handleSubmit((data) => {
    const values = {
      description: data.description,
      duration: (data.duration as number) || 0,
      extraTime: (data.extraTime?.value as number) || 0,
      name: data.name,
      isExtraTime: data.isExtraTime,
      price: +data.price,
      order: data.order,
      isMobile: data.isMobile,
      categoryId: data.categoryId?.value as string,
      image: data.image,
    }
    //eslint-disable-next-line
    //@ts-ignore
    values.key = uuid()

    if (!isEditing) {
      onAdd(values)
    } else {
      onEdit(values)
    }
    onClose()
    resetState()
    reset(defaultValues)
  })

  const onMinutesChange = (opt: IOptions) => {
    const minutes = getHoursFromMinutes(duration || 0).minutes
    const value = (opt.value as number) + minutes
    const difference = Math.abs(value - (duration || 0))
    const finalValue =
      difference === 0 && duration ? duration - (opt.value as number) : value
    setValue('duration', finalValue)
    if (!touchedFields.minutes) {
      setTouchedFields((prevState) => ({ ...prevState, minutes: true }))
    }
  }

  const onHoursChange = (opt: IOptions) => {
    const minutes = getOnlyMinutes(duration || 0)
    const value = (opt.value as number) + minutes
    const difference = Math.abs(value - (duration || 0))
    const finalValue =
      difference === 0 && duration ? duration - (opt.value as number) : value
    setValue('duration', finalValue)
    if (!touchedFields.hours) {
      setTouchedFields((prevState) => ({ ...prevState, hours: true }))
    }
  }

  return {
    image,
    extraTime,
    categoryId,
    isDisabled,
    hoursValue,
    isExtraTime,
    isMobile,
    minutesValue,
    businessTypesMap,
    onSubmit,
    resetState,
    onHoursChange,
    onMinutesChange,
  }
}

export default ServiceModal

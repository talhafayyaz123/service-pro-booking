import useTranslation from 'next-translate/useTranslation'
import React, { FC, useCallback } from 'react'

import { IconCloseSmall, IconCopy, IconPlus } from '@/assets/icons/icons'
import { Checkbox } from '@/components/common/Checkbox'
import { Dropdown } from '@/components/common/dropdown/Dropdown'
import { TimezoneDropdown } from '@/components/common/dropdown/timeZoneDropdown/TimezoneDropdown'
import { H14, H16, H20, H40, OrangeBlock } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { CopyBusinessHoursModal } from '@/features/accountSetup/CopyBusinessHoursModal'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { availabilitySelector } from '@/store/accountSetup/accountSetupSelectors'
import {
  replaceSupData,
  setAvailability,
  setProAvailability,
} from '@/store/accountSetup/accountSetupSlice'
import { setModal } from '@/store/modals/modalsSlice'
import { IOptions } from '@/types/common'
import {
  CurrentWorkHours,
  IBusinessDayState,
  TSelected,
} from '@/types/onboarding'

export const Availability: FC<{
  tooltipRef: React.MutableRefObject<HTMLDivElement | null>
}> = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const dispatch = useAppDispatch()
  const { windowOptions, maxAmountOptions, canBookOptions } =
    useAvailableConfig()
  const { availability, proAvailability } = useAppSelector(availabilitySelector)

  const onChange = (v: IOptions, key: 'window' | 'canBook' | 'maxBooking') => {
    dispatch(setProAvailability({ [key]: { value: +v.value } }))
  }

  const onTimezoneSelect = (option: IOptions) => {
    dispatch(setProAvailability({ timezone: option }))
  }

  return (
    <>
      <div className="mt-8 tablet:mt-20 mb-6 tablet:mb-[60px] bg-white mx-auto tablet:p-[60px] max-w-[620px] rounded-[20px] tablet:shadow-xl">
        <H40 className="!font-bold maxTablet:pl-5">
          {t('titles.availability')}
        </H40>
        <div className="flex flex-col mt-8 z-[1] w-full px-5 py-6 tablet:p-8 shadow-xl gap-6 rounded-[20px]">
          <H20>{t('titles.online_booking')}</H20>
          <Dropdown
            customContent={
              <OrangeBlock className={'m-3'}>
                <div>
                  <H16>How far in advance can clients book you?</H16>
                  <H14>
                    Eg: By picking 7 days, clients can see your availability for
                    one week
                  </H14>
                </div>
              </OrangeBlock>
            }
            label={t('labels.window')}
            className="z-[100]"
            onChange={(v) => onChange(v, 'window')}
            options={windowOptions}
            value={proAvailability?.window as IOptions}
            name="proAvailability.window"
          />
          <Dropdown
            customContent={
              <OrangeBlock className={'m-3'}>
                <H16>
                  How much notice do you need before a scheduled appointment?
                </H16>
              </OrangeBlock>
            }
            label={t('labels.booking')}
            onChange={(v) => onChange(v, 'canBook')}
            options={canBookOptions}
            value={proAvailability?.canBook as IOptions}
            name="proAvailability.canBook"
          />
          <Dropdown
            customContent={
              <OrangeBlock className={'m-3'}>
                <H16>How many bookings can you take a day?</H16>
              </OrangeBlock>
            }
            label={t('labels.max_booking')}
            onChange={(v) => onChange(v, 'maxBooking')}
            value={proAvailability?.maxBooking as IOptions}
            options={maxAmountOptions}
            name="proAvailability.maxBooking"
          />
          <TimezoneDropdown
            onChange={onTimezoneSelect}
            label="Timezone"
            value={proAvailability?.timezone || undefined}
            placeholder="Select timezone"
          />
        </div>
        <div className="flex flex-col mt-3 tablet:mt-2 z-[1] w-full px-5 py-6 tablet:p-8 shadow-xl tablet:gap-6 rounded-[20px]">
          <H20 className="mb-1 tablet:mb-0">{t('titles.business_hours')}</H20>
          <div className="grid grid-cols-1 bg-lightGray gap-y-px">
            {availability.map((field) => {
              return (
                <div
                  className="grid grid-cols-[24px_51px_1fr] gap-x-4 items-start bg-white py-4"
                  key={field.weekday}
                >
                  <Checkbox
                    checked={field?.active}
                    onChange={() =>
                      dispatch(
                        setAvailability({
                          id: field.weekday,
                          active: !field.active,
                        })
                      )
                    }
                  />
                  <H16 className="mr-auto">
                    {field.weekday.charAt(0).toUpperCase() +
                      field.weekday.slice(1)}
                  </H16>
                  <BusinessDayBlock data={field} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <CopyBusinessHoursModal />
    </>
  )
}

const BusinessDayBlock = ({ data }: { data: CurrentWorkHours }) => {
  const dispatch = useAppDispatch()

  const handleRemove = useCallback(
    (index: number) => {
      dispatch(
        replaceSupData({
          id: data.weekday,
          type: 'remove',
          weekday: data.weekday,
          index,
        })
      )
    },
    [data.weekday, dispatch]
  )

  const handleOpenModal = useCallback(
    ({
      state,
      index,
      id,
    }: {
      state?: IBusinessDayState
      index?: number
      id?: string
    }) => {
      dispatch(
        setModal({
          state: { ...state, index, id },
          currentModal: MODALS_TYPE.BUSINESS_HOURS,
          text: data.weekday.toString(),
          action: (params: { from: string; to: string; weekday: TSelected }) =>
            dispatch(
              replaceSupData({
                id: data.weekday,
                type: data.timePeriods.some((el) => !!el.to)
                  ? 'append'
                  : 'update',
                ...params,
              })
            ),
        })
      )
    },
    [data, dispatch]
  )

  const onCopy = useCallback(
    ({ from, to, weekday }: { from: string; to: string; weekday: string }) => {
      dispatch(
        setModal({
          currentModal: MODALS_TYPE.COPY_BUSINESS_HOURS,
          state: {
            from,
            to,
            weekday,
          },
          text: weekday,
        })
      )
    },
    [dispatch]
  )

  return (
    <>
      <div className="ml-3 grid grid-cols-1 gap-y-[11px] tablet:gap-y-3.5">
        {data.timePeriods?.map(({ weekday, from, to }, index, arr) => (
          <div
            className="flex items-center justify-between w-full"
            key={`${weekday}-${from}-${to}`}
          >
            <BusinessDayInfo
              handleOpenModal={handleOpenModal}
              id={weekday}
              index={index}
              active={data.active}
              from={from || ''}
              to={to || ''}
            />
            <div className="flex items-center gap-1">
              {index === 0 ? (
                <div className="flex items-center">
                  <div
                    role="button"
                    onClick={() => {
                      data.active && handleOpenModal({})
                    }}
                    className={`transition rounded-full flex-shrink-0 flex items-start justify-center cursor-pointer ${
                      data.active
                        ? 'hover:bg-lightGray'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <IconPlus className="scale-90" />
                  </div>
                  {arr.length > 1 && (
                    <div
                      role="button"
                      onClick={() => handleRemove(index)}
                      className="flex items-start justify-center flex-shrink-0 px-2 mr-px cursor-pointer"
                    >
                      <IconCloseSmall />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  role="button"
                  onClick={() => handleRemove(index)}
                  className="flex items-start justify-center flex-shrink-0 px-2 mr-px cursor-pointer"
                >
                  <IconCloseSmall className={''} />
                </div>
              )}
              {data.active && !!from && !!to && index === 0 ? (
                <div
                  className="transition rounded-full hover:bg-lightGray"
                  role="button"
                  onClick={() => onCopy({ from, to, weekday })}
                >
                  <IconCopy />
                </div>
              ) : (
                <div className="w-4 h-4 ml-2" />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export const BusinessDayInfo = ({
  active,
  from,
  id,
  to,
  index,
  handleOpenModal,
}: {
  active: boolean
  from: string
  to: string
  id?: string
  index?: number
  handleOpenModal?: ({
    state,
    index,
    id,
  }: {
    state?: IBusinessDayState
    index?: number
    id?: string
  }) => void
}) => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  if (active && !from && !to) {
    return <H16 color="text-gray">{t('text.select_time')}</H16>
  } else if (!active) {
    return <H16 color="text-gray">{t('text.day_off')}</H16>
  } else if (active && from && to) {
    return (
      <div
        role="button"
        className={handleOpenModal ? 'cursor-pointer group' : undefined}
        onClick={() => {
          handleOpenModal &&
            handleOpenModal({
              state: {
                from: {
                  time: from.split(' ')[0],
                  meridiem: from.split(' ')[1],
                },
                to: { time: to.split(' ')[0], meridiem: to.split(' ')[1] },
              },
              index,
              id,
            })
        }}
      >
        <H16
          className={
            handleOpenModal
              ? 'group-hover:text-orange group-hover:transition-all'
              : undefined
          }
        >
          {from} - {to}
        </H16>
      </div>
    )
  } else {
    return <span />
  }
}

export const useAvailableConfig = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)

  const maxAmountOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((el) => ({
    label: String(el) + ' amount of bookings per day',
    value: el,
  }))

  const canBookOptions = [
    {
      label: 'Up to 30 minutes before start time',
      value: 30,
    },
    {
      label: 'Up to 2 hours before start time',
      value: 60 * 2,
    },
    {
      label: 'Up to 3 hours before start time',
      value: 60 * 3,
    },
    {
      label: 'Up to 4 hours before start time',
      value: 60 * 4,
    },
    {
      label: 'Up to 5 hours before start time',
      value: 60 * 5,
    },
    {
      label: 'Up to 6 hours before start time',
      value: 60 * 6,
    },
    {
      label: 'Up to 7 hours before start time',
      value: 60 * 7,
    },
    {
      label: 'Up to 8 hours before start time',
      value: 60 * 8,
    },
    {
      label: 'Up to 12 hours before start time',
      value: 60 * 12,
    },
    {
      label: 'Up to 24 hours before start time',
      value: 60 * 24,
    },
    {
      label: 'Up to 48 hours before start time',
      value: 60 * 48,
    },
    {
      label: 'Up to 3 days before start time',
      value: 60 * 72,
    },
    {
      label: 'Up to 7 days before start time',
      value: 60 * 24 * 7,
    },
    {
      label: 'Up to 14 days before start time',
      value: 60 * 24 * 14,
    },
    {
      label: 'Up to 30 days before start time',
      value: 60 * 24 * 30,
    },
    {
      label: 'No restrictions',
      value: 0,
    },
  ]

  const windowOptions = [
    {
      label: t('labels.days_in_advance', { count: 7 }),
      value: 7,
    },
    {
      label: t('labels.days_in_advance', { count: 14 }),
      value: 14,
    },
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => ({
      label: t('labels.month_in_advance', { count }),
      value: count * 30,
    })),
  ]

  return {
    windowOptions,
    maxAmountOptions: [...maxAmountOptions, { label: 'Unlimited', value: 0 }],
    canBookOptions,
  }
}

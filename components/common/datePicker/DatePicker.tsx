import Tippy, { TippyProps } from '@tippy.js/react'
import {
  addMonths,
  addYears,
  format,
  getDay,
  getDaysInMonth,
  subMonths,
  subYears,
} from 'date-fns'
import moment from 'moment'
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Instance, sticky } from 'tippy.js'

import { IconArrow } from '@/assets/icons/icons'
import { ChipBase, IChipProps } from '@/components/Chip/ChipBase'
import { Button } from '@/components/common/buttons/Button'
import {
  currentYear,
  DAYS,
  ddo,
  odd,
} from '@/components/common/datePicker/datePickerConsts'
import { IInputProps, Input } from '@/components/common/Input'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { H16 } from '@/components/typography'
import { cn } from '@/core/helpers/cn'
import { isPastDate } from '@/core/helpers/isPastDate'
import { IChip } from '@/types/common'

type DatepickerType = 'date' | 'month' | 'year'

export interface IDatePickerProps
  extends Partial<Omit<IInputProps, 'value' | 'onChange'>> {
  value: Date | null
  onChange: (value: Date) => void
  children?: ReactNode
  getIsOpen?: (open: boolean) => void
  onApply?: (value: Date, chipValue?: string) => void
  tippyProps?: Partial<TippyProps>
  contentWrapper?: string
  chips?: IChip[]
  chipValue?: IChip | null
  chipSize?: IChipProps['size']
  disabledPast?: boolean
  footerNode?: ReactNode
  onChipChange?: (ch: IChip) => void
  applyText?: ReactNode
  applyWrapperClassName?: string
  onApplyDisable?: boolean
  initialDate?: Date | null
  onChangeHeaderDate?: (v: Date) => void
  datesLoading?: boolean
  windowsPeriod?: { day: number; isHaveWindows: boolean }[]
  mode?: 'default'
  bnplCalcStartDay?: string | null
  pickerType?: 'bottomSheet' | 'modal'
  reset?: (value: null, chipValue?: string) => void
}
export const DatePicker = ({
  value = null,
  getIsOpen,
  onChange,
  children,
  tippyProps,
  ...rest
}: IDatePickerProps) => {
  const {
    toggleDatepicker,
    content,
    tippyProps: tippyCurrentProps,
    showDatepicker,
  } = useDatePickConfig({
    value,
    onChange,
    children,
    getIsOpen,
    tippyProps,
    ...rest,
  })

  useEffect(() => {
    getIsOpen && getIsOpen(showDatepicker)
  }, [getIsOpen, showDatepicker])

  return (
    <div className="w-full">
      <Tippy {...{ ...tippyCurrentProps, ...tippyProps }} content={content}>
        <div>
          {children ? (
            <div
              role="none"
              className="cursor-pointer"
              onClick={toggleDatepicker}
            >
              {children}
            </div>
          ) : (
            <Input
              {...rest}
              readOnly
              inputClassName={`cursor-pointer ${rest.inputClassName}`}
              className={` ${showDatepicker ? 'border-black' : ''} ${
                rest.className
              }`}
              onClick={toggleDatepicker}
              value={
                value ? moment(new Date(value)).format('DD/MM/YY') : undefined
              }
            />
          )}
        </div>
      </Tippy>
    </div>
  )
}

export const ChipBlock = ({
  chips,
  chipValue,
  setChipValue,
  chipSize = '14',
  chipWrapperClassName,
  blockChips,
  className,
}: Pick<IDatePickerProps, 'chips'> & {
  chipValue?: IChip
  setChipValue?: (c: IChip) => void
  chipSize?: IChipProps['size']
  chipWrapperClassName?: string
  blockChips?: IChip[]
  className?: string
}) => {
  return (
    <div className={className}>
      {chips && (
        <div
          className={`flex flex-wrap gap-[5px] mx-2 mt-5 pt-5 border-t border-lightGray ${chipWrapperClassName}`}
        >
          {blockChips && blockChips?.length > 0
            ? blockChips?.map(({ value, label }) => (
                <ChipBase
                  key={value}
                  size={chipSize}
                  textClassName={'!text-black'}
                  className={'py-1 bg-violet cursor-no-drop'}
                  name={label}
                />
              ))
            : null}
          {chips.map(({ label, value }) => (
            <ChipBase
              key={value}
              onClick={() => {
                if (setChipValue) {
                  setChipValue({ value, label })
                }
              }}
              size={chipSize}
              active={chipValue?.value ? chipValue?.value === value : false}
              className={'py-1'}
              name={label}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const useDatePickConfig = ({
  value,
  chips,
  chipSize,
  contentWrapper,
  onChange,
  onApply,
  disabledPast,
  onChipChange,
  chipValue,
  footerNode,
  applyText,
  onApplyDisable,
  applyWrapperClassName,
  initialDate,
  onChangeHeaderDate,
  datesLoading,
  windowsPeriod,
  reset,
  mode,
  bnplCalcStartDay,
  type: type2,
  pickerType,
}: IDatePickerProps) => {
  const [type, setType] = useState<DatepickerType>('date')
  const tippyInstance = useRef<Instance | null>(null)
  const [date, setDate] = useState(currentYear)
  const [showDatepicker, setShowDatepicker] = useState(false)
  const [dayCount, setDayCount] = useState<string[]>([])
  const [blankDays, setBlankDays] = useState<Array<number>>([])
  const isBottomSheet = type2 === 'bottomSheet' || pickerType === 'bottomSheet'

  const [datepickerHeaderDate, setDatepickerHeaderDate] = useState(new Date())

  useEffect(() => {
    onChangeHeaderDate && onChangeHeaderDate(datepickerHeaderDate)
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datepickerHeaderDate])

  useEffect(() => {
    if (initialDate) {
      setDatepickerHeaderDate(initialDate)
      setDateValue(new Date(initialDate).getDate())
      // onChange(initialDate)
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const decrement = useCallback(() => {
    switch (type) {
      case 'date':
        setDatepickerHeaderDate((prev) => subMonths(prev, 1))
        break
      case 'month':
        setDatepickerHeaderDate((prev) => subYears(prev, 1))
        break
      case 'year':
        setDate((prev) => prev - 15)
        break
    }
  }, [type])

  const increment = useCallback(() => {
    switch (type) {
      case 'date':
        setDatepickerHeaderDate((prev) => addMonths(prev, 1))
        break
      case 'month':
        setDatepickerHeaderDate((prev) => addYears(prev, 1))
        break
      case 'year':
        setDate((prev) => prev + 15)

        break
    }
  }, [type])

  const tippyProps: Partial<TippyProps> = {
    animation: 'scale',
    interactive: true,
    trigger: 'manual',
    delay: [0, 0],
    duration: [0, 100],
    appendTo: 'parent',
    maxWidth: 375,
    popperOptions: { positionFixed: true },
    sticky: true,
    plugins: [sticky],
    placement: 'bottom',
    distance: 44,
    onHidden: () => {
      setShowDatepicker(false)
    },
    onShow: () => {
      setShowDatepicker(true)
    },
    onCreate: (instance) => {
      tippyInstance.current = instance
    },
  }

  const onShow = () => {
    setShowDatepicker(true)
    tippyInstance.current?.show()
  }

  const onHide = () => {
    setShowDatepicker(false)

    tippyInstance.current?.hide()
  }

  const isToday = useCallback(
    (date: number) => {
      if (
        moment(value).get('month') ===
          moment(datepickerHeaderDate).get('month') &&
        moment(value).get('year') === moment(datepickerHeaderDate).get('year')
      ) {
        return value && new Date(value).getDate() === date
      } else {
        return false
      }
    },
    [datepickerHeaderDate, value]
  )

  const today = useCallback(
    (date: number) => {
      if (
        moment().format('dd/MM/yy') ===
        moment(datepickerHeaderDate).format('dd/MM/yy')
      ) {
        return new Date().getDate() === date
      } else {
        return null
      }
    },
    [datepickerHeaderDate]
  )

  const years = useMemo(
    () =>
      [...new Array(15)].map((_, index) => {
        if (index < 7) {
          return date - ddo[index]
        } else if (index === 7) {
          return date
        } else if (index > 7) {
          return date + (odd.indexOf(index) + 1)
        }
        return 0
      }),
    [date]
  )

  const isSelectedMonth = useCallback(
    (month: number) => moment(datepickerHeaderDate).get('month') === month,
    [datepickerHeaderDate]
  )
  const isYear = datepickerHeaderDate.getFullYear()

  const setMonthValue = useCallback(
    (month: number) => () => {
      const m = moment(datepickerHeaderDate)
        .set('month', month)
        .toLocaleString()
      setDatepickerHeaderDate(new Date(m))
      setType('date')
    },
    [datepickerHeaderDate]
  )

  const setDateValue = useCallback(
    (date: number) => {
      const newValue = new Date(
        datepickerHeaderDate.getFullYear(),
        datepickerHeaderDate.getMonth(),
        date
      )

      onChange && onChange(newValue)
      !onApply && onHide()
    },
    [datepickerHeaderDate, onApply, onChange]
  )
  const setYearValue = useCallback(
    (year: number) => {
      const y = moment(datepickerHeaderDate).set('year', year).toLocaleString()
      setDatepickerHeaderDate(new Date(y))
      setType('date')
    },
    [datepickerHeaderDate]
  )

  const getDayCount = useCallback(
    (date: Date) => {
      const daysInMonth = getDaysInMonth(date)
      const dayOfWeek = getDay(new Date(date.getFullYear(), date.getMonth(), 1))
      const blankdaysArray = []
      for (let i = 1; i <= dayOfWeek; i++) {
        blankdaysArray.push(i)
      }

      const daysArray = []
      for (let i = 1; i <= daysInMonth; i++) {
        daysArray.push(i)
      }

      setBlankDays(blankdaysArray)
      setDayCount(
        daysArray.map((day) =>
          moment(datepickerHeaderDate).set('date', day).toLocaleString()
        )
      )
    },
    [datepickerHeaderDate, setBlankDays, setDayCount]
  )

  const toggleDatepicker = () => {
    if (!showDatepicker) {
      setShowDatepicker(true)
      onShow()
    } else {
      setShowDatepicker(false)
      onHide()
    }
  }

  useEffect(() => {
    getDayCount(datepickerHeaderDate)
  }, [datepickerHeaderDate, getDayCount])

  const DatePickerComponent = useMemo(() => {
    return (
      <div
        className={`bg-white pb-5 rounded-[24px] shadow-xl  small:min-w-[375px] p-[5px] w-full tablet:mt-20 ${contentWrapper}`}
      >
        <div className="grid grid-cols-7">
          <div className={'flex items-center justify-center'}>
            <div
              role={'button'}
              onClick={decrement}
              className={
                'transition cursor-pointer hover:bg-lightGray p-[5px] flex items-center justify-center  rounded-full'
              }
            >
              <IconArrow className={'opacity-50 w-6 h-6 stroke-black'} />
            </div>
          </div>
          <div />
          <div className={`m-2 flex items-center justify-center col-span-3`}>
            <H16
              role={'button'}
              onClick={() =>
                type === 'month' ? setType('date') : setType('month')
              }
              className="cursor-pointer hover:bg-lightGray rounded-lg px-2 py-1.5  transition"
            >
              {format(datepickerHeaderDate, 'MMMM')}
            </H16>
            <H16 color={'text-gray'}> | </H16>
            <H16
              onClick={() =>
                type === 'year' ? setType('date') : setType('year')
              }
              className="cursor-pointer hover:bg-lightGray rounded-lg px-4 py-1.5  transition"
            >
              {format(datepickerHeaderDate, 'yyyy')}
            </H16>
          </div>
          <div />

          <div className="flex items-center justify-center">
            <div className="transition cursor-pointer hover:bg-lightGray p-[5px]  rounded-full ">
              <IconArrow
                onClick={increment}
                className="w-6 h-6 rotate-180 opacity-50 stroke-black"
              />
            </div>
          </div>
        </div>
        {type === 'date' && (
          <>
            <div className="grid grid-cols-7">
              {DAYS.map((day, i) => (
                <div className={'my-5'} key={i}>
                  <H16 className="text-gray-800 font-medium block !text-center">
                    {day}
                  </H16>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1.5">
              {blankDays.map((_, i) => (
                <div key={i} />
              ))}
              {dayCount.map((day, index) => {
                const currentDayNumber = new Date(day).getDate()

                const isPastDay = isPastDate(day)

                const moreThan28Days =
                  bnplCalcStartDay &&
                  moment(day).diff(bnplCalcStartDay ?? moment(), 'days') > 26

                const disabled =
                  moreThan28Days ||
                  (today(currentDayNumber)
                    ? false
                    : windowsPeriod
                    ? !windowsPeriod?.[index]?.isHaveWindows
                    : today(currentDayNumber) || isPastDay)

                return (
                  <>
                    <div
                      key={index}
                      className="flex items-center justify-center w-full"
                    >
                      {datesLoading ? (
                        <BaseSkeleton className={'!w-9 !h-9'} />
                      ) : (
                        <div
                          role="button"
                          className="flex items-center justify-center text-center h-9 w-9"
                          onClick={() => {
                            if (mode === 'default') {
                              return setDateValue(currentDayNumber)
                            } else if (windowsPeriod?.[index]?.isHaveWindows) {
                              !disabled && setDateValue(currentDayNumber)
                            }
                          }}
                        >
                          <H16
                            className={cn(
                              'flex items-center justify-center transition rounded-[12px] w-full h-full cursor-pointer',
                              windowsPeriod &&
                                !windowsPeriod?.[index]?.isHaveWindows &&
                                !today(currentDayNumber) &&
                                '!text-gray hover:bg-white cursor-no-drop',
                              isToday(currentDayNumber)
                                ? '!text-white bg-orange'
                                : 'hover:bg-lightGray',
                              today(currentDayNumber) &&
                                !isToday(currentDayNumber)
                                ? '!text-orange'
                                : 'text-black',
                              !today(currentDayNumber) &&
                                (isPastDay || moreThan28Days) &&
                                '!text-gray hover:bg-white cursor-no-drop'
                            )}
                          >
                            {currentDayNumber}
                          </H16>
                        </div>
                      )}
                    </div>
                  </>
                )
              })}
            </div>
          </>
        )}
        {type === 'month' && (
          <div className="grid grid-cols-4 gap-y-3 gap-x-1.5">
            {[...new Array(12)].map((_, i) => {
              return (
                <div className={'flex items-center justify-center'} key={i}>
                  <H16
                    onClick={setMonthValue(i)}
                    className={`cursor-pointer py-2.5 mx-2 w-full font-semibold text-center rounded-lg ${
                      isSelectedMonth(i)
                        ? 'bg-orange text-white'
                        : 'text-black hover:bg-lightGray'
                    } ${
                      moment().get('month') === i && !isSelectedMonth(i)
                        ? '!text-orange'
                        : ''
                    }`}
                  >
                    {moment().month(i).format('MMM')}
                  </H16>
                </div>
              )
            })}
          </div>
        )}
        {type === 'year' && (
          <div
            className={`grid grid-cols-4 mt-3 text-center ${
              isBottomSheet ? 'mb-[70px]' : ''
            }`}
          >
            {years.map((year, index) => {
              const isDisabledPast = year < currentYear
              const isActive = isYear === year

              return (
                <div className={'my-0.5 mx-3'} key={index}>
                  <H16
                    onClick={() =>
                      (disabledPast ? !isDisabledPast : true) &&
                      setYearValue(year || currentYear)
                    }
                    className={`cursor-pointer py-3 font-semibold text-center transition rounded-lg ${
                      currentYear === year && !isActive
                        ? '!text-orange'
                        : 'text-black'
                    } ${
                      isActive ? 'bg-orange !text-white' : 'hover:bg-lightGray'
                    } ${
                      disabledPast && isDisabledPast
                        ? 'text-gray hover:bg-white cursor-no-drop'
                        : ''
                    }`}
                  >
                    {year}
                  </H16>
                </div>
              )
            })}
          </div>
        )}
        <ChipBlock
          chipValue={chipValue as IChip}
          setChipValue={onChipChange}
          chips={chips}
          chipSize={chipSize}
        />

        {footerNode}

        {onApply && (
          <div
            className={`border-t border-lightGray ${applyWrapperClassName} ${
              isBottomSheet
                ? 'fixed bottom-0 w-full left-0 z-10 pb-safe bg-white !mb-0 rounded-t-[20px]'
                : 'mx-3 mb-5 pt-5'
            }`}
            style={{
              boxShadow: isBottomSheet
                ? 'rgba(182, 190, 206, 0.3) 0px -4px 27px'
                : '',
            }}
          >
            {isBottomSheet ? (
              <div className="px-5 py-3">
                <Button
                  buttonType="3d"
                  disabled={onApplyDisable}
                  className="w-full"
                  onClick={() => {
                    value
                      ? onApply(value, chipValue?.value as string)
                      : reset
                      ? reset(null, chipValue?.value as string)
                      : null
                    onHide()
                  }}
                >
                  {applyText ?? 'Apply dates'}
                </Button>
              </div>
            ) : (
              <Button
                buttonType="3d"
                disabled={onApplyDisable}
                className="w-full"
                onClick={() => {
                  value
                    ? onApply(value, chipValue?.value as string)
                    : reset
                    ? reset(null, chipValue?.value as string)
                    : null
                  onHide()
                }}
              >
                {applyText ?? 'Apply dates'}
              </Button>
            )}
          </div>
        )}
      </div>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    applyText,
    applyWrapperClassName,
    blankDays,
    chipSize,
    chipValue,
    chips,
    contentWrapper,
    datepickerHeaderDate,
    datesLoading,
    dayCount,
    decrement,
    disabledPast,
    footerNode,
    increment,
    isSelectedMonth,
    isToday,
    isYear,
    mode,
    onApply,
    onApplyDisable,
    onChipChange,
    setDateValue,
    setMonthValue,
    setYearValue,
    today,
    type,
    value,
    windowsPeriod,
    years,
    reset,
  ])

  return {
    toggleDatepicker,
    tippyProps,
    showDatepicker,
    content: DatePickerComponent,
  }
}

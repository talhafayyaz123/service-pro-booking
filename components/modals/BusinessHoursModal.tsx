import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/common/buttons/Button'
import { ComboDropdown } from '@/components/common/comboDropdown/ComboDropdown'
import { Modal } from '@/components/modals/Modal'
import { ErrorMessage, H24 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { convertTime12to24, helperForDate } from '@/core/helpers/helperForDate'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { availabilitySelector } from '@/store/accountSetup/accountSetupSelectors'
import { replaceTime } from '@/store/accountSetup/accountSetupSlice'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'
import { IBusinessDayState, TSelected } from '@/types/onboarding'

const initialState: IBusinessDayState = {
  from: {
    time: '',
    meridiem: 'am',
  },
  to: { time: '', meridiem: 'am' },
}

const BusinessHoursModal = () => {
  const { isSmall } = useMediaScreen()
  const dispatch = useAppDispatch()
  const { currentModal, text, action, state } = useAppSelector(modalsSelector)
  const [value, setValue] =
    useState<Omit<IBusinessDayState, 'index'>>(initialState)
  const errorsDefaultState = { from: '', to: '', general: '' }
  const [error, setError] = useState(errorsDefaultState)

  const weekDay = helperForDate(text || '')

  const clearErrors = () => {
    setError(errorsDefaultState)
  }

  const { availability } = useAppSelector(availabilitySelector)

  useEffect(() => {
    if (state?.to) {
      setValue(() => ({ to: state.to, from: state.from } as IBusinessDayState))
    }
  }, [state])

  const onClose = useCallback(() => {
    dispatch(setModal({}))
    setValue(initialState)
    clearErrors()

    //eslint-disable-next-line
  }, [dispatch])

  const handleSetTime = (key: keyof typeof value, time: string) => {
    setValue((prev) => ({ ...prev, [key]: { ...prev[key], time } }))
    clearErrors()
  }

  const handleSetMeridiem = (
    key: keyof typeof value,
    meridiem: 'am' | 'pm'
  ) => {
    setValue((prev) => ({ ...prev, [key]: { ...prev[key], meridiem } }))
    clearErrors()
  }

  const onSetError = (
    key: keyof typeof errorsDefaultState,
    error = 'Incorrect date'
  ) => {
    setError((prev) => ({ ...prev, [key]: error }))
  }

  const handleSave = useCallback(() => {
    const [hourFrom, minutesFrom] = value.from.time
      .split(' ')[0]
      .split(':')
      .map((_) => Number(_))
    const [hourTo, minutesTo] = value.to.time
      .split(' ')[0]
      .split(':')
      .map((_) => Number(_))

    const fromMeridiem = value.from.meridiem
    const toMeridiem = value.to.meridiem
    const to = convertTime12to24({
      hours: hourTo,
      modifier: toMeridiem,
    })
    const from = convertTime12to24({
      hours: hourFrom,
      modifier: fromMeridiem,
    })

    // if greater than 12
    if (hourFrom > 12) {
      return onSetError('from')
    } else if (hourTo > 12) {
      return onSetError('to')
    }

    // if is NaN
    else if (isNaN(minutesFrom)) {
      return onSetError('from')
    } else if (isNaN(minutesTo)) {
      return onSetError('to')
    }

    // end time max 23:45
    else if ((to.ignored >= 23 && minutesTo > 45) || to.hours === 24) {
      return onSetError('to', 'End time cannot be later than 11:45pm')
    }

    // checking that, end time cannot be sooner than start time
    if (
      from.ignored > to.ignored ||
      (from.ignored === to.ignored &&
        (minutesFrom > minutesTo || minutesFrom === minutesTo))
    ) {
      return onSetError('to', 'End time cannot be sooner than start time')
    }

    // intersections
    const weekdayWorkingHours = availability.find((w) => w.weekday === text)
    if (weekdayWorkingHours && weekdayWorkingHours.timePeriods?.length) {
      let err = ''
      weekdayWorkingHours.timePeriods.forEach((t) => {
        if (
          t.from &&
          t.to &&
          t.to !== `${state?.to?.time} ${state?.to?.meridiem}`
        ) {
          const [workHoursFrom, workHoursMinutesFrom] = t.from
            .split(' ')[0]
            .split(':')
            .map((_) => Number(_))
          const workHourFromMeridiem = t.from.split(' ')[1]

          const [workHoursTo, workHoursMinutesTo] = t.to
            .split(' ')[0]
            .split(':')
            .map((_) => Number(_))
          const workHourToMeridiem = t.to.split(' ')[1]

          const start1 =
            convertTime12to24({
              hours: workHoursFrom,
              modifier: workHourFromMeridiem,
            }).ignored *
              60 +
            workHoursMinutesFrom
          const end1 =
            convertTime12to24({
              hours: workHoursTo,
              modifier: workHourToMeridiem,
            }).ignored *
              60 +
            workHoursMinutesTo

          const start2 = from.ignored * 60 + minutesFrom
          const end2 = to.ignored * 60 + minutesTo

          if (
            (start1 >= start2 && start1 <= end2) ||
            (start2 >= start1 && start2 <= end1)
          ) {
            err = `The time you entered overlaps with other working hours of ${weekDay}. Please enter other time period.`
          }
        }
      })
      if (err) {
        return onSetError('general', err)
      }
    }

    const data = {
      from: value.from.time + ' ' + value.from.meridiem,
      to: value.to.time + ' ' + value.to.meridiem,
      weekday: text as TSelected,
    }

    if (state?.to) {
      dispatch(
        replaceTime({
          ...state,
          ...data,
        })
      )
    } else {
      action && action(data)
    }
    onClose()

    //eslint-disable-next-line
  }, [
    text,
    state,
    availability,
    value?.to?.time,
    value?.from?.time,
    value?.from?.meridiem,
    value?.to?.meridiem,
    action,
    onClose,
    dispatch,
  ])

  const disabled = useMemo(() => {
    return (
      (state
        ? JSON.stringify({ to: state.to, from: state.from }) ===
          JSON.stringify(value)
        : false) ||
      Object.values(value).some((e) => !e.time) ||
      !!error.to ||
      !!error.from ||
      !!error.general
    )
  }, [error.from, error.to, state, error.general, value])

  const timeMask = [/[0-9]/, /[0-9]/, ':', /[0-5]/, /[0-9]/]

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    time: 'to' | 'from'
  ) => {
    const changedValue = e.target.value
    const firstLetter = value[time].time?.length ? value[time].time[0] : null
    const newFirstLetter = changedValue?.length ? changedValue[0] : null

    if (
      newFirstLetter !== null &&
      firstLetter !== newFirstLetter &&
      !['0', '1'].includes(newFirstLetter) &&
      !['0', '1'].includes(firstLetter || '')
    ) {
      const _v = `0${newFirstLetter}${changedValue.slice(2)}`
      e.target.selectionStart = 3
      handleSetTime(time, _v)
    } else {
      handleSetTime(time, changedValue)
    }
  }

  return (
    <Modal
      onClose={onClose}
      onCloseButton={!isSmall}
      fromBottom
      maxWidth={isSmall ? 575 : 400}
      titleClassName="small:px-8 px-6  !items-start"
      className="small:rounded-3xl small:mx-6 small:my-10 rounded-t-[20px] max-h-screen"
      wrapperClassName="flex small:items-center  items-end justify-center small:p-1"
      title={
        <H24 className="w-full mr-auto text-left">
          Business hours. {weekDay}
        </H24>
      }
      space="small:pt-8 pt-[52px]"
      isOpen={currentModal === MODALS_TYPE.BUSINESS_HOURS}
    >
      <div className="flex gap-x-2.5 mt-6 mb-20 small:mb-0 px-8">
        <ComboDropdown
          reverse
          label="Start time"
          center
          error={error.from || undefined}
          left={{
            options: options,
            inputClassName: 'maxTablet:pl-4.5 maxTablet:pr-0.5 border-0',

            value: options.find((e) => e.value === value.from.meridiem),
            onChange: (v) => handleSetMeridiem('from', v.value as 'am' | 'pm'),
            size: '50',
          }}
          right={{
            inputClassName: 'pl-4.5 pr-0.5 border-0',
            size: '50',
            onChange: (e) => handleChange(e, 'from'),
            value: value.from.time,
            mask: timeMask,
          }}
        />
        <ComboDropdown
          reverse
          center
          label="End time"
          error={error.to || undefined}
          left={{
            options: options,
            inputClassName: 'maxTablet:pl-4.5 maxTablet:pr-0.5 border-0',
            value: options.find((e) => e.value === value.to.meridiem),
            onChange: (v) => handleSetMeridiem('to', v.value as 'am' | 'pm'),
            size: '50',
          }}
          right={{
            size: '50',
            inputClassName: 'pl-4.5 pr-0.5 border-0',
            mask: timeMask,
            value: value.to.time,
            onChange: (e) => handleChange(e, 'to'),
          }}
        />
      </div>
      {error.general ? (
        <ErrorMessage className="px-8 mt-3 !block">
          {error.general}
        </ErrorMessage>
      ) : null}
      <div className="small:pt-0 flex justify-center items-center small:px-8 px-5 small:pb-8 py-3 rounded-t-[20px] small:rounded-t-none small:rounded-b-[20px] small:shadow-none relative z-20 shadow-xl">
        <Button
          disabled={disabled}
          onClick={handleSave}
          className="w-full mt-6"
          buttonType="orange"
          size="100"
        >
          Save
        </Button>
      </div>
    </Modal>
  )
}
export default BusinessHoursModal

const options = [
  { value: 'am', label: 'am' },
  { value: 'pm', label: 'pm' },
]

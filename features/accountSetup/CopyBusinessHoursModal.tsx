import { memo, useCallback, useEffect, useMemo } from 'react'

import { Button } from '@/components/common/buttons/Button'
import { CheckboxWithLabel } from '@/components/common/Checkbox'
import { Modal } from '@/components/modals/Modal'
import { H18, H24 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { helperForDate } from '@/core/helpers/helperForDate'
import { BusinessDayInfo } from '@/features/accountSetup/steps/Availability'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { availabilitySelector } from '@/store/accountSetup/accountSetupSelectors'
import {
  clearCopySelected,
  replaceSupData,
  setCopySelectedAvailability,
} from '@/store/accountSetup/accountSetupSlice'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'
import { CurrentWorkHours, TSelected } from '@/types/onboarding'

export const CopyBusinessHoursModal = () => {
  const dispatch = useAppDispatch()
  const { selected } = useAppSelector(
    (state) => state.accountSetup.copySelectedAvailability
  )

  const { availability } = useAppSelector(availabilitySelector)
  const setSelect = (v: TSelected) => {
    dispatch(setCopySelectedAvailability(v))
  }
  const { currentModal, text, state } = useAppSelector(modalsSelector)

  const weekDay = useMemo(() => helperForDate(text || ''), [text])

  const onClose = useCallback(() => {
    dispatch(setModal({}))
    dispatch(clearCopySelected())
  }, [dispatch])

  const handleAdd = () => {
    dispatch(
      replaceSupData({
        id: state?.weekday,
        selected,
        type: 'copy',
        from: state?.from,
        to: state?.to,
        weekday: state?.weekday,
      })
    )
    onClose()
  }

  useEffect(() => {
    return onClose
  }, [onClose])

  return (
    <Modal
      isOpen={currentModal === MODALS_TYPE.COPY_BUSINESS_HOURS}
      space={'px-0 pt-8'}
      maxWidth={503}
      titleClassName="border-b border-lightGray pb-6 px-8"
      title={
        <H24 className={''}>
          Copy business hours. {helperForDate(text || '')}
        </H24>
      }
      onClose={onClose}
    >
      <H18 color="text-gray" className="px-8 mt-6 text-left">
        Select days that you would like to apply {weekDay}'s business hours
      </H18>
      <div className="pb-4 mx-8 mt-6 border-b border-lightGray">
        <div
          className={`border ${
            selected.includes('all') ? 'border-orange' : 'border-lightGray'
          } py-4 px-5 rounded-[12px] `}
        >
          <CheckboxWithLabel
            checked={selected.includes('all')}
            value="all"
            onChange={() => setSelect('all')}
            wrapperClassName="w-full justify-between items-start"
            label="All days"
          />
        </div>
      </div>

      <div className="overflow-y-auto max-h-[374px] grid grid-cols-1 gap-4 py-4 px-8">
        {availability
          .filter((el) => {
            return el.weekday !== state?.weekday?.toLowerCase()
          })
          .map((data) => {
            return (
              <SelectCard
                {...data}
                onClick={setSelect}
                selected={selected}
                key={data.weekday}
              />
            )
          })}
      </div>
      <div className="w-full px-8 pt-6 pb-8 shadow-xl">
        <Button
          disabled={selected.length === 0}
          className="w-full"
          buttonType="orange"
          onClick={handleAdd}
        >
          Copy
        </Button>
      </div>
    </Modal>
  )
}

const SelectCard = memo(
  ({
    className,
    active,
    timePeriods,
    weekday,
    onClick,
    selected,
  }: CurrentWorkHours & {
    selected: string[]
    className?: string
    onClick: (v: TSelected) => void
  }) => {
    const isCheck = useMemo(
      () => selected.includes(weekday) || selected.includes('all'),
      [selected, weekday]
    )
    return (
      <div
        className={`border ${
          isCheck ? 'border-orange' : 'border-lightGray'
        } py-4 px-5 rounded-[12px] ${className}`}
      >
        <CheckboxWithLabel
          checked={isCheck}
          value={weekday}
          onChange={() => onClick(weekday)}
          wrapperClassName="w-full justify-between items-start"
          label={
            <div className="flex flex-col items-start justify-start">
              <H18>{helperForDate(weekday)}</H18>

              {timePeriods.map(({ from, to }, index) => (
                <BusinessDayInfo
                  key={index}
                  index={index}
                  active={active}
                  from={from || ''}
                  to={to || ''}
                />
              ))}
            </div>
          }
        />
      </div>
    )
  }
)

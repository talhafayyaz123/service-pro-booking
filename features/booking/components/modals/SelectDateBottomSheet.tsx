import { useCallback, useMemo } from 'react'
import { BottomSheet } from 'react-spring-bottom-sheet'

import { H18 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { BookingDatePicker } from '@/features/booking/components/modals/SelectDateModal'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'

export const SelectDateBottomSheet = () => {
  const dispatch = useAppDispatch()
  const { currentModal } = useAppSelector(modalsSelector)
  const { isSmall, isTablet } = useMediaScreen()

  const open = useMemo(
    () =>
      !isSmall && !isTablet
        ? false
        : currentModal === MODALS_TYPE.BOOKING_SELECT_DATE,
    [currentModal, isSmall, isTablet]
  )

  const onClose = useCallback(() => {
    dispatch(setModal({}))
  }, [dispatch])

  return (
    <BottomSheet
      open={open}
      skipInitialTransition
      blocking
      className="absolute z-10"
      onDismiss={onClose}
      snapPoints={({ maxHeight }) => maxHeight - 5}
      defaultSnap={({ maxHeight }) => maxHeight - 5}
    >
      <div className="mx-auto max-w-[503px]">
        <H18 className="!font-bold text-left px-1 mb-5 ml-4 mt-4">
          Date and Time
        </H18>
        <div className="w-full">
          <BookingDatePicker type="bottomSheet" />
        </div>
      </div>
      <style>
        {`[data-rsbs-header] {
            box-shadow: none !important;
      }`}
      </style>
    </BottomSheet>
  )
}

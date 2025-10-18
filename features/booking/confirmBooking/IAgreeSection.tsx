import useTranslation from 'next-translate/useTranslation'
import { Dispatch, SetStateAction, useCallback } from 'react'

import { Checkbox } from '@/components/common/Checkbox'
import { H16 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import {
  bookingDataSelector,
  depositSelector,
} from '@/features/booking/store/bookingSelectors'
import { setBookingData } from '@/features/booking/store/bookingStore'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

export const IAgreeSection = ({
  setHighlight,
  onOpenDrawer,
}: {
  setHighlight: Dispatch<SetStateAction<boolean>>
  onOpenDrawer: (e: React.MouseEvent<HTMLSpanElement>) => void
}) => {
  const { t } = useTranslation(TRANSLATE_KEYS.booking)

  const dispatch = useAppDispatch()
  const { data } = useAppSelector(bookingDataSelector)
  const deposit = useAppSelector(depositSelector)

  const handleHighlight = useCallback(
    (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
      e.preventDefault()
      e.stopPropagation()
      const scrollBlock = document.getElementById('scroll_section_bookings')
      scrollBlock?.scrollTo({ top: 600, behavior: 'auto' })
      setHighlight(true)
      setTimeout(() => setHighlight(false), 3000)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const onChangePolicies = useCallback(
    (policies: boolean) => {
      dispatch(setBookingData({ policies }))
    },
    [dispatch]
  )
  return (
    <div
      id="booking_agreement"
      className="mt-5 border border-transparent rounded"
    >
      <Checkbox
        omitRole={true}
        className="!items-start w-full"
        checked={!!data.policies}
        onChange={() => onChangePolicies(!data.policies)}
        rightLabel={
          <H16 color="text-gray" className="text-wrap">
            I agree with
            <span
              role="button"
              className="transition text-orange hover:text-orange1"
              onClick={onOpenDrawer}
            >
              {' '}
              {t('titles.terms_and_conditions')}
            </span>{' '}
            {deposit.amount ? (
              <>
                and{' '}
                <span
                  role={'button'}
                  className={'text-orange hover:text-orange1 transition'}
                  onClick={(e) => handleHighlight(e)}
                >
                  {t('titles.cancellation_policies')}
                </span>
              </>
            ) : null}
          </H16>
        }
      />
    </div>
  )
}

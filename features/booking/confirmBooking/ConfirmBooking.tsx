import useTranslation from 'next-translate/useTranslation'

import { H18, H48 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { PaymentMethod } from '@/features/booking/confirmBooking/PaymentMethod'
import { ResultConfigure } from '@/features/booking/confirmBooking/ResultConfigure'

export const ConfirmBooking = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.booking)

  return (
    <>
      <div className="w-full h-[414px]  absolute top-0 left-0 bg-violet z-[0]" />
      <div
        id="scroll_section_bookings"
        className="!z-10 overflow-y-auto w-full"
      >
        <div className="tablet:container mt-6 mb-2 tablet:mt-20 max-w-[1080px]">
          <H48 className="!font-bold maxTablet:text-28 maxTablet:leading-[34px] maxTablet:mx-6">
            {t('titles.confirm_booking')}
          </H48>
          <H18
            color="text-gray"
            className="mt-4 maxTablet:text-16 maxTablet:leading-[24px] maxTablet:mx-6"
          >
            {t('labels.review_and_pay')}
          </H18>

          <div className="flex flex-col-reverse justify-center mt-6 mb-0 small:mb-14 laptop:grid laptop:grid-cols-2 tablet:gap-10 tablet:mt-10">
            <PaymentMethod />
            <ResultConfigure />
          </div>
        </div>
      </div>
    </>
  )
}

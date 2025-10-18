import useTranslation from 'next-translate/useTranslation'
import { memo, useMemo, useState } from 'react'

import { Input } from '@/components/common/Input'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useBusinessDetailStep } from '@/features/accountSetup/stepsV2/BusinessDetailV2/BusinessDetailV2'

export const TravelFeeSection = memo(() => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)

  const { travelFee, typeOfServices } = useBusinessDetailStep((state) => state)
  const setState = useBusinessDetailStep.getState().setState
  const [isTouched, setIsTouched] = useState(false)

  const errorMessage = useMemo(() => {
    if (!isTouched) {
      return ''
    }
    if (!travelFee) {
      return ''
    } else if (travelFee >= 100000) {
      return 'Travel fee is too high'
    } else if (Number.isNaN(parseFloat(String(travelFee)))) {
      return 'Incorrect travel fee'
    }
  }, [isTouched, travelFee])

  if (!typeOfServices.includes('isMobile')) {
    return <></>
  }

  return (
    <Input
      label={t('labels.travel_fee')}
      className="mt-4 tablet:mt-6"
      value={travelFee}
      onChange={(e) => {
        setIsTouched(true)
        setState({ travelFee: e.target.value })
      }}
      leftLabel={'$'}
      error={errorMessage}
      type="number"
      inputClassName="pl-9"
      placeholder="Amount"
    />
  )
})

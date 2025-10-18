import { memo } from 'react'

import { QuestionsTab } from '@/features/profile/components/mobile/steps/faq/QuestionsTab'
import { ProfileTermsOfPaymentMobile } from '@/features/profile/components/termsOfPayment/ProfileTermsOfPayment'

const FaqTab = memo(() => {
  return (
    <div className={'mt-3'}>
      <ProfileTermsOfPaymentMobile />
      <QuestionsTab />
    </div>
  )
})

export default FaqTab

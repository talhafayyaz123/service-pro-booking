import { H48 } from '@/components/typography'
import { TermsDrawerContent } from '@/features/booking/confirmBooking/PaymentMethod'

const TermsPage = () => {
  return (
    <div className="my-8 px-4" id="app_layout">
      <H48 className="!font-bold mb-4">Terms of service</H48>
      <TermsDrawerContent />
    </div>
  )
}

export default TermsPage

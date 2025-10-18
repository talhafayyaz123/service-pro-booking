import { IconWarningAlert } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { Modal } from '@/components/modals/Modal'
import { H18 } from '@/components/typography'

export interface IBookingAcceptTermsModal {
  onClose: () => void
}

export const BookingAcceptTermsModal = ({
  onClose,
}: IBookingAcceptTermsModal) => {
  return (
    <Modal maxWidth={400} isOpen onClose={onClose} noHeader>
      <div className="flex flex-col items-center justify-center">
        <IconWarningAlert className="w-20 h-20 text-orange" />
        <H18 className="mt-4">
          Please confirm{' '}
          <span className="text-orange">Terms and Conditions</span> and{' '}
          <span className="text-orange">Cancellation policies</span>
        </H18>
        <Button onClick={onClose} buttonType="3d" className="w-[200px] mt-4">
          Ok
        </Button>
      </div>
    </Modal>
  )
}

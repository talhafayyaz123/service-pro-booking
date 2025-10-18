import { Button } from '@/components/common/buttons/Button'
import { ModalHeader } from '@/features/modalsConfig/modalComponents/ModalHeader'
import { closeModal } from '@/features/modalsConfig/modalConfig'
import { PLFailledStep } from '@/features/paymentLink/components/Steps/failedStep/components/PLFailledStep'

interface IProps {
  price?: number | string
  currency?: string
  error?: string
  handleTryAgain?: () => void
}

export const PaymentFailedModal = (props: Partial<IProps>) => {
  return (
    <section className={'p-8'}>
      <ModalHeader onClose={closeModal} />
      <PLFailledStep {...props} />
      <Button className="w-full mt-6" buttonType="orange" onClick={closeModal}>
        Close
      </Button>
    </section>
  )
}

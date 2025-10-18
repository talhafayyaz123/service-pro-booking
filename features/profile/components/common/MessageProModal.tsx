import { GreyAppleStoreLink } from '@/components/common/ApplePayLink'
import { GreyGooglePlayLink } from '@/components/common/GooglePlayLink'
import { Modal, useModalData } from '@/components/modals/Modal'
import { Barcode } from '@/components/qrCode/QRCode'
import { H16, H28 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'

const QuestionModal = () => {
  const { isOpen, onCloseModal } = useModalData(MODALS_TYPE.MESSAGE_PRO_MODAL)
  return (
    <Modal
      space={'p-8 tablet:p-8'}
      className={'w-[400px] max-w-[400px] rounded-[24px]'}
      isOpen={isOpen}
      onClose={onCloseModal}
      onCloseButton={false}
    >
      <div className={'flex flex-col items-center gap-6'}>
        <div className={'flex flex-col items-center space-y-3'}>
          <H28 className={'text-center leading-[36px] tracking-[-0.4px]'}>
            Want to message this professional?
          </H28>
          <H16 className={'text-center leading-[24px]'}>
            Download the Readyhubb app to connect, chat, and manage your
            bookings on the go!
          </H16>
        </div>

        <Barcode />

        <div className="flex items-center gap-x-2">
          <div className="flex-grow w-32 border-t border-[#ECEDEE]"></div>
          <span className="mx-4 text-[#00000030]">OR</span>
          <div className="flex-grow w-32 border-t border-[#ECEDEE]"></div>
        </div>

        <div className={'flex gap-2 items-center'}>
          <GreyAppleStoreLink />
          <GreyGooglePlayLink />
        </div>
      </div>
    </Modal>
  )
}

export default QuestionModal

import { IconOrangeTick } from '@/assets/icons/icons'

import { H16, H20 } from '../typography'
import { Modal } from './Modal'

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
}

export const SuccessModal = ({
  isOpen,
  onClose,
  title,
  description,
}: Props) => {
  return (
    <Modal
      maxWidth={295}
      titleClassName="pb-6 border-b border-lightGray"
      space="px-7 py-[60px]"
      noHeader
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col items-center">
        <div className="h-[74px] w-[74px] rounded-full flex items-center justify-center border border-lightGray">
          <IconOrangeTick />
        </div>
        <H20 className="mt-8">{title}</H20>
        {description ? <H16 className="mt-3">{description}</H16> : null}
      </div>
    </Modal>
  )
}

import { CloseButton } from '@/components/common/buttons/CloseButton'

export const ModalHeader = ({ onClose }: { onClose: () => void }) => {
  return (
    <header className="flex justify-end">
      <CloseButton onClick={onClose} />
    </header>
  )
}

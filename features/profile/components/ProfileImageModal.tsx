import Image from 'next/image'
import { useSelector } from 'react-redux'

import { IconClose } from '@/assets/icons/icons'
import { Modal, useModalData } from '@/components/modals/Modal'
import { H24 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { profileSelector } from '@/features/profile/store/profileSelectors'

const ProfileImageModal = () => {
  const { isOpen, onCloseModal } = useModalData(
    MODALS_TYPE.VIEW_PROFILE_IMAGE_MODAL
  )

  const { data } = useSelector(profileSelector)
  const { name, iconUrl } = data

  return (
    <Modal
      maxWidth={400}
      space="p-10 pb-8"
      noHeader
      isOpen={isOpen}
      onClose={onCloseModal}
    >
      <div className="space-y-4 w-fit bg-white rounded-2xl flex flex-col items-center justify-center -mt-4">
        <div className="py-2 flex items-center justify-between w-full border-b border-lightGray text-center">
          <div />
          <H24>{name}</H24>
          <IconClose
            className="cursor-pointer w-5 h-5 text-[#939DAA]"
            onClick={onCloseModal}
          />
        </div>
        <div className="w-full h-full flex items-center justify-center">
          {iconUrl && (
            <Image
              src={iconUrl}
              alt={name}
              width={501}
              height={484}
              className="rounded-15"
            />
          )}
        </div>
      </div>
    </Modal>
  )
}

export default ProfileImageModal

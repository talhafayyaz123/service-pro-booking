import React from 'react'

import { IconWarningColored } from '@/assets/icons/icons'

import { Button } from '../common/buttons/Button'
import { H16, H28 } from '../typography'
import { Modal } from './Modal'
interface RestrictedWordsModalProps {
  isOpen: boolean
  title?: string | null
  detectedWords: string[]
  onClose: () => void
}
const RestrictedWordsModal = ({
  isOpen,
  detectedWords,
  onClose,
  title,
}: RestrictedWordsModalProps) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        maxWidth={440}
        outsideClose={false}
      >
        <div className="flex flex-col">
          <div className="flex justify-center text-left">
            <IconWarningColored />
          </div>
          <H28>Your Profile Contains Restricted Words</H28>
          <br />
          <H16 className="text-[#3B4C69] text-left font-sofiapro inline">
            It looks like your profile includes restricted words. Please remove
            the following:
            <H16
              className={`text-left !font-bold overflow-auto h-28 ${
                detectedWords?.length > 20 ? 'block' : 'inline'
              }`}
              color="text-orange"
            >
              {detectedWords?.map((word) => `"${word}"`).join(', ')}
            </H16>
          </H16>
        </div>
        <br />
        <Button
          className="min-w-[250px]"
          buttonType="orange"
          size="200"
          onClick={onClose}
        >
          Got it
        </Button>
      </Modal>
    </>
  )
}
export default RestrictedWordsModal

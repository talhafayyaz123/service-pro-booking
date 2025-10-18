import 'react-spring-bottom-sheet/dist/style.css'

import { BottomSheet } from 'react-spring-bottom-sheet'

import { TooltipContent } from '@/components/common/ShareProfile'
import { useModalData } from '@/components/modals/Modal'
import { IMPORTANT_CLASS_NAMES, MODALS_TYPE } from '@/core/consts/common'

const ShareSocialBottomeSheet = () => {
  const { isOpen, onCloseModal } = useModalData(
    MODALS_TYPE.SHARE_SOCIAL_BOTTOMSHEET
  )
  return (
    <BottomSheet
      open={isOpen}
      skipInitialTransition
      blocking
      className={`flex !z-[1000] ${IMPORTANT_CLASS_NAMES.UNCLOSE_CLASSNAME}`}
      onDismiss={onCloseModal}
      defaultSnap={({ maxHeight }) => maxHeight - 5}
    >
      <TooltipContent onClose={onCloseModal} />
      <style>
        {`[data-rsbs-header] {
            box-shadow: none !important;
      };
     
      `}
      </style>
      <style>
        {` [data-rsbs-overlay] {
            z-index:200 !important ;}
            `}
      </style>
      <style>
        {` [data-rsbs-backdrop] {
            z-index:100 !important ;}
            `}
      </style>
    </BottomSheet>
  )
}

export default ShareSocialBottomeSheet

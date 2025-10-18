import 'react-spring-bottom-sheet/dist/style.css'

import useTranslation from 'next-translate/useTranslation'
import { BottomSheet } from 'react-spring-bottom-sheet'

import { Button } from '@/components/common/buttons/Button'
import { Modal } from '@/components/modals/Modal'
import { H18, H24, H28 } from '@/components/typography'
import { COMPANY_EMAIL } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useMediaScreen } from '@/hooks/useMediaScreen'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const ForgotPasswordSuccessModal = ({ isOpen, onClose }: Props) => {
  const { isSmall } = useMediaScreen()
  return (
    <>
      {isSmall ? (
        <BottomSheet
          open={isOpen}
          blocking
          onDismiss={onClose}
          className="no-shadow"
        >
          <div className="p-5 pt-0">
            <ForgotPasswordSuccessContent onClose={onClose} />
          </div>
        </BottomSheet>
      ) : (
        <Modal
          maxWidth={503}
          space="p-10"
          noHeader
          isOpen={isOpen}
          onClose={onClose}
        >
          <ForgotPasswordSuccessContent onClose={onClose} />
        </Modal>
      )}
    </>
  )
}

export const ForgotPasswordSuccessContent = ({
  onClose,
}: {
  onClose: () => void
}) => {
  const { t } = useTranslation(TRANSLATE_KEYS.forgot_password)

  return (
    <div className="flex flex-col items-start">
      <H28 className="!font-bold mb-3 small:block hidden">
        {t('check_email')}
      </H28>
      <H24 className="!font-bold mb-3 small:hidden">{t('check_email')}</H24>
      <H18 color="text-gray" className="mb-6 text-left">
        {t('success_text', { email: COMPANY_EMAIL })}
      </H18>
      <Button
        buttonType="orange"
        onClick={onClose}
        className="w-full outline-none"
      >
        {t('ok')}
      </Button>
    </div>
  )
}

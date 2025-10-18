import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import { IconWarningAlert } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { Modal } from '@/components/modals/Modal'
import { H18 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

const EmailExistsModal = () => {
  const router = useRouter()
  const error = router.query.auth_error
  const { t } = useTranslation(TRANSLATE_KEYS.common)

  const onClose = () => {
    const query = { ...router.query }

    delete query['auth_error']

    router.replace(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      {
        shallow: true,
      }
    )
  }

  return error ? (
    <Modal maxWidth={400} isOpen onClose={onClose} noHeader>
      <div className="flex flex-col items-center justify-center">
        <IconWarningAlert className="w-20 h-20 text-orange" />
        <H18 className="mt-4">
          {t(error as string) || 'This email already in use'}
        </H18>
        <Button onClick={onClose} buttonType="3d" className="w-[200px] mt-4">
          Ok
        </Button>
      </div>
    </Modal>
  ) : null
}
export default EmailExistsModal

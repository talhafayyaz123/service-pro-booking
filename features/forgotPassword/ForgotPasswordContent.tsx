import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { FormEvent, useState } from 'react'

import { sendResetPassword } from '@/api/auth/sendResetPassword'
import { Button } from '@/components/common/buttons/Button'
import { Input } from '@/components/common/Input'
import { useModalData } from '@/components/modals/Modal'
import { ErrorMessage, Label } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { isValidEmail } from '@/core/helpers/formValidations'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

import { ForgotPasswordSuccessModal } from './ForgotPasswordSuccessModal'
import { ForgotPasswordWrapper } from './ForgotPasswordWrapper'

export const ForgotPasswordContent = () => {
  const { isOpen, onClose, onSubmit, email, error, onChange, t, btnDisabled } =
    useForgotPassword()

  return (
    <>
      <ForgotPasswordWrapper
        onSubmit={onSubmit}
        description={t('enter_email_text')}
        title={t('forgot_password')}
      >
        <div className="my-8 w-full">
          <Label className="mb-2.5">{t('enter_email')}</Label>
          <Input
            onChange={(e) => onChange(e.target.value)}
            type="email"
            required
            value={email}
          />
          {error ? (
            <ErrorMessage className="mt-2 ml-2 block">{error}</ErrorMessage>
          ) : null}
        </div>
        <Button
          buttonType="orange"
          disabled={btnDisabled}
          type="submit"
          className="w-full"
        >
          {t('send')}
        </Button>
      </ForgotPasswordWrapper>
      <ForgotPasswordSuccessModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

const useForgotPassword = () => {
  const router = useRouter()
  const { t } = useTranslation(TRANSLATE_KEYS.forgot_password)
  const dispatch = useAppDispatch()
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [btnDisabled, setBtnDisabled] = useState(true)
  const { onCloseModal, isOpen } = useModalData(
    MODALS_TYPE.FORGOT_PASSWORD_SUCCESS
  )

  const onClose = () => {
    onCloseModal()
    router.push('/')
  }

  const onChange = (value: string) => {
    if (error) {
      setError('')
    }

    if (isValidEmail(value)) {
      setBtnDisabled(false)
    } else if (!btnDisabled) {
      setBtnDisabled(true)
    }
    setEmail(value)
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setBtnDisabled(true)
      await sendResetPassword(email)
      dispatch(setModal({ currentModal: MODALS_TYPE.FORGOT_PASSWORD_SUCCESS }))
    } catch (err: any) {
      const errors = err as AxiosError<{ email: string }>
      const emailErr = errors.response?.data.email
      if (emailErr) {
        setError(t(emailErr))
      } else {
        setError(t('unknown_error'))
      }
    } finally {
      setBtnDisabled(false)
    }
  }

  return { onSubmit, onClose, isOpen, error, email, onChange, t, btnDisabled }
}

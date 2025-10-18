import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { FormEvent, useState } from 'react'

import { resetPassword } from '@/api/auth/resetPassword'
import { Button } from '@/components/common/buttons/Button'
import { Input } from '@/components/common/Input'
import { useModalData } from '@/components/modals/Modal'
import { SuccessModal } from '@/components/modals/SuccessModal'
import { ErrorMessage, Label } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { passwordValidation } from '@/core/helpers/formValidations'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

import { ForgotPasswordWrapper } from './ForgotPasswordWrapper'

export const ChangePasswordContent = () => {
  const {
    error,
    isOpen,
    password,
    btnDisabled,
    t,
    onClose,
    onChange,
    onSubmit,
  } = useChangePassword()

  return (
    <>
      <ForgotPasswordWrapper
        onSubmit={onSubmit}
        title={t('enter_new_password')}
      >
        <div className="w-full my-8">
          <Label className="mb-2.5">{t('create_password')}</Label>
          <Input
            onChange={(e) => onChange(e.target.value)}
            type="password"
            required
            value={password}
          />
          {error ? (
            <ErrorMessage className="block mt-2 ml-2">{error}</ErrorMessage>
          ) : null}
        </div>
        <Button
          buttonType="orange"
          disabled={btnDisabled}
          type="submit"
          className="w-full"
        >
          {t('save')}
        </Button>
      </ForgotPasswordWrapper>
      <SuccessModal
        onClose={onClose}
        isOpen={isOpen}
        title={t('change_password_success_title')}
        description={t('change_password_success_text')}
      />
    </>
  )
}

const useChangePassword = () => {
  const router = useRouter()
  const { t } = useTranslation(TRANSLATE_KEYS.forgot_password)
  const dispatch = useAppDispatch()
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [btnDisabled, setBtnDisabled] = useState(true)
  const { onCloseModal, isOpen } = useModalData(
    MODALS_TYPE.CHANGE_PASSWORD_SUCCESS
  )
  const hash = router.query.token as string

  const onClose = async () => {
    onCloseModal()
    await router.push('/')
    dispatch(setModal({ currentModal: MODALS_TYPE.SIGN_IN }))
  }

  const onChange = (value: string) => {
    if (error) {
      setError('')
    }

    if (value.length > 5) {
      setBtnDisabled(false)
    } else if (!btnDisabled) {
      setBtnDisabled(true)
    }

    setPassword(value)
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!passwordValidation(password)) {
        setError(t('invalid_password'))
        return
      }
      setBtnDisabled(true)
      await resetPassword({ password, hash })
      dispatch(setModal({ currentModal: MODALS_TYPE.CHANGE_PASSWORD_SUCCESS }))
      setTimeout(() => {
        router.replace('/')
      }, 3000)
    } catch (err: any) {
      const errors = err as AxiosError<{ email: string }>
      const emailErr = errors.response?.data.email
      if (emailErr) {
        setError(t('link_expired'))
      } else {
        setError(t('unknown_error'))
      }
    } finally {
      setBtnDisabled(false)
    }
  }

  return {
    onSubmit,
    onClose,
    isOpen,
    error,
    password,
    onChange,
    t,
    btnDisabled,
  }
}

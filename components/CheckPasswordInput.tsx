import useTranslation from 'next-translate/useTranslation'

import { Input } from '@/components/common/Input'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setCheckPassword } from '@/store/me/meSlice'

export const CheckPasswordInput = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  const dispatch = useAppDispatch()
  const { value, result } = useAppSelector((state) => state.me.checkPassword)
  const errorText = () => {
    if (result === 'error') {
      return t('text.some_error')
    } else if (result === 'wrongPassword') {
      return t('text.wrong_password')
    } else if (result === 'init') {
      return ''
    }
  }
  return (
    <Input
      value={value}
      error={errorText()}
      type={'password'}
      onChange={(e) =>
        dispatch(setCheckPassword({ value: e.target.value, result: 'init' }))
      }
      className={'mt-8'}
      label={t('labels.enter_password')}
    />
  )
}

// export const CheckEmailInput = () => {
//   const { t } = useTranslation(TRANSLATE_KEYS.common)
//   const { value, result } = useAppSelector((state) => state.me.checkEmail)
//
//   const dispatch = useAppDispatch()
//   const errorText = () => {
//     if (result === 'error') {
//       return t('text.some_error')
//     } else if (result === 'exist') {
//       return t('text.wrong_password')
//     } else if (result === 'init') {
//       return ''
//     }
//   }
//
//   const onChange = (v: string) => {
//     const a = onValidEmail(v)
//
//     dispatch(setCheckEmail({ value: v, result: 'init' }))
//   }
//
//   return (
//     <Input
//       value={value}
//       error={errorText()}
//       onChange={(e) => onChange(e.target.value)}
//       className={'mt-6'}
//       label={'Enter new email'}
//     />
//   )
// }

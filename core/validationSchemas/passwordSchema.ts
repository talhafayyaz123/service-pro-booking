import { string } from 'yup'

import { passwordValidation } from '@/core/helpers/formValidations'

export const passwordSchema = (name: string) => {
  return string()
    .min(
      8,
      'Password must contain an uppercase letter, a symbol, a number and must be at least 8 letters long'
    )
    .test(
      name,
      'Password must contain an uppercase letter, a symbol, a number and must be at least 8 letters long',
      (v) => passwordValidation(v as string)
    )
}

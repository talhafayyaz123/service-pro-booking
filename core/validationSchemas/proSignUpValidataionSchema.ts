import { isValidPhoneNumber } from 'libphonenumber-js'
import { Session } from 'next-auth'
import { Translate } from 'next-translate'
import { boolean, mixed, object, string } from 'yup'

import { checkSingleDomainEmail } from '@/core/helpers/check-domain-email'
import { isValidEmail } from '@/core/helpers/formValidations'

import { passwordSchema } from './passwordSchema'

interface FnArgs {
  user?: Session['user']
  tError: Translate
}

export const proSignUpValidationSchema = ({ tError, user }: FnArgs) => {
  return object({
    firstName: string().required(tError('required')),
    lastName: string().required(tError('required')),
    password: user ? mixed() : passwordSchema('name'),
    phoneNumberCode: object().required(tError('required')),
    phoneNumber: string()
      .required(tError('required'))
      .test({
        test: (value, context) => {
          const code = context.parent.phoneNumberCode?.id?.split('+')[0]
          return isValidPhoneNumber(value || '', code)
        },
        message: tError('enter_valid_phone_number'),
      }),
    is18older: boolean().equals([true], tError('required')),
    agreement: boolean().equals([true], tError('required')),
    email: string()
      .required(tError('Please add your email address'))
      .test({
        test: (value) => {
          if (value) {
            return !checkSingleDomainEmail(value) && isValidEmail(value)
          }
          return true
        },
        message: 'Please enter a valid email address',
      }),
  })
}

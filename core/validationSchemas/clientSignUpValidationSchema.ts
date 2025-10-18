import { isValidPhoneNumber } from 'libphonenumber-js'
import { Session } from 'next-auth'
import { Translate } from 'next-translate'
import { bool, mixed, object, string } from 'yup'

import { checkSingleDomainEmail } from '@/core/helpers/check-domain-email'
import { isValidEmail } from '@/core/helpers/formValidations'

import { passwordSchema } from './passwordSchema'

interface FnArgs {
  user?: Session['user']
  tError: Translate
}
export const firstNameTest = {
  test: (v?: string) => {
    return /[A-Za-z]+/.test(v || '')
  },
  message: 'First name must have at least one alphabet eg: Bally',
}
export const LastNameTest = {
  test: (v?: string) => {
    return /[A-Za-z]+/.test(v || '')
  },
  message: 'Last name must have at least one alphabet eg: Bally',
}

export const clientSignUpValidationSchema = ({ user, tError }: FnArgs) => {
  return object({
    firstName: string()
      .trim()
      .required('Please add first name')
      .test(firstNameTest),
    lastName: string()
      .trim()
      .required('Please add the last name')
      .test(LastNameTest),
    password: user ? mixed() : passwordSchema('name'),
    phoneNumber: string()
      .required('Please add a mobile number')
      .test({
        test: (value, context) => {
          if (value) {
            const code = context.parent.phoneNumberCode?.id?.split('+')[0]
            return isValidPhoneNumber(value || '', code)
          }
          return true
        },
        message: tError('enter_valid_phone_number'),
      }),
    required: object().notRequired(),
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
    recieveNotifications: bool(),
    agreement: bool().oneOf([true], tError('Please read and agree to terms')),
  })
}

export const loginSchema = object({
  email: string().email().required(),
  password: string().required(),
})

export const registerSchema = object({
  email: string().email().required(),
  password: passwordSchema('name'),
  firstName: string()
    .trim()
    .required('Please add first name')
    .test(firstNameTest),
  lastName: string()
    .trim()
    .required('Please add the last name')
    .test(LastNameTest),
  phoneNumber: string()
    .required('Please add a mobile number')
    .test({
      test: (value, context) => {
        if (value) {
          const code = context.parent.phoneNumberCode?.id?.split('+')[0]
          return isValidPhoneNumber(value || '', code)
        }
        return true
      },
      message: 'Please enter a valid phone number',
    }),
  phoneNumberCode: object({
    id: string(),
    label: mixed(),
    search: string(),
    value: string(),
  }),
})

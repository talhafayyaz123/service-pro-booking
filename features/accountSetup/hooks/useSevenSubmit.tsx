import { isValidPhoneNumber } from 'libphonenumber-js'
import useTranslation from 'next-translate/useTranslation'
import { useCallback } from 'react'
import { ErrorOption, FieldPath, useFormContext } from 'react-hook-form'

import { onboardingRequest } from '@/api/onboarding'
import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { isValidEmail } from '@/core/helpers/formValidations'
import { CurrentWorkHours, IOnboardingFormState } from '@/types/onboarding'

export const useSevenSubmit = () => {
  const { t: tError } = useTranslation(TRANSLATE_KEYS.errors)

  const { setError, clearErrors, getValues } =
    useFormContext<IOnboardingFormState<CurrentWorkHours[]>>()
  return useCallback(async () => {
    const proContacts = getValues('proContacts')
    const { emailCheckbox, phoneCheckbox, phone, email } = proContacts
    const phoneCode = proContacts.phoneCode.id.split('+')

    const data = {
      email: proContacts.email,
      phone: '',
      phoneCode: '',
    }

    validateSevenStepEmail(
      emailCheckbox,
      phoneCheckbox,
      email,
      phone,
      phoneCode[0],
      setError,
      tError('enter_valid_phone_number'),
      'Please enter a valid email'
    )

    if (
      phone &&
      phoneCode.length &&
      !isValidPhoneNumber(phone || '', phoneCode[0] as any)
    ) {
      setError('proContacts.phone', {
        message: tError('enter_valid_phone_number'),
      })
      throw new Error('error')
    } else {
      data.phone = phone || ''
      data.phoneCode = proContacts.phoneCode.value
      if (!phone) {
        data.phoneCode = ''
      }
    }

    const isInvalid = () => {
      if (emailCheckbox && phoneCheckbox) {
        return (
          !email ||
          !isValidEmail(email) ||
          !phone ||
          !isValidPhoneNumber(phone || '', phoneCode[0] as any)
        )
      }

      if (emailCheckbox) {
        return email ? !isValidEmail(email) : true
      }
      if (phoneCheckbox) {
        return !phone
      }
    }

    if (!isInvalid()) {
      await onboardingRequest(API_ONBOARDING.proContacts, data)
      clearErrors()
    }
    //eslint-disable-next-line
      //@ts-ignore
  }, [clearErrors, getValues, setError, tError])
}

const validateSevenStepEmail = (
  emailCheckbox: boolean,
  phoneCheckbox: boolean,
  email: string,
  phone: string,
  phoneCodeId: string,
  setError: (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    name: FieldPath<IOnboardingFormState<CurrentWorkHours[]>>,
    error: ErrorOption,
    options?: { shouldFocus: boolean }
  ) => void,
  phoneErrorText: string,
  emailErrorText: string
) => {
  if (emailCheckbox) {
    if (!isValidEmail(email) || !email) {
      return setError('proContacts.email', { message: emailErrorText })
    }
  }
  if (phoneCheckbox) {
    if (!phone) {
      return setError('proContacts.phone', { message: phoneErrorText })
    }
  }
}

import { Translate } from 'next-translate'

interface Args {
  setter: any
  tErrors: Translate
  errors: Record<string, string>
}

export const setFormErrorsByKey = ({ setter, errors, tErrors }: Args) => {
  try {
    Object.keys(errors).forEach((fieldErr) => {
      setter(fieldErr, {
        message: tErrors(errors[fieldErr]),
      })
    })
  } catch {
    return
  }
}

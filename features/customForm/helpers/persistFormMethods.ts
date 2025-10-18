import { PERSIST_CUSTOM_FORM_KEY } from '@/features/customForm/consts'
import { IConvertableForm } from '@/features/customForm/types'

interface SavedDataProps {
  defaultValues?: IConvertableForm
  customFormId?: string
}

export const getSavedData = ({
  defaultValues,
  customFormId,
}: SavedDataProps) => {
  const data = sessionStorage.getItem(PERSIST_CUSTOM_FORM_KEY)

  if (data && customFormId) {
    // Parse it to a javaScript object
    try {
      const parsedData: Record<string, IConvertableForm> = JSON.parse(data)

      if (parsedData[customFormId]) {
        return parsedData[customFormId]
      } else {
        return defaultValues
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('get persisted error:', err)
    }
  }

  return defaultValues
}

export const removePersistedCustomFormData = (customFormId?: string) => {
  const data = sessionStorage.getItem(PERSIST_CUSTOM_FORM_KEY)

  if (data && customFormId) {
    // Parse it to a javaScript object
    try {
      const parsedData: Record<string, IConvertableForm> = JSON.parse(data)

      if (parsedData[customFormId]) {
        delete parsedData[customFormId]

        sessionStorage.setItem(
          PERSIST_CUSTOM_FORM_KEY,
          JSON.stringify(parsedData)
        )
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('remove persisted error:', err)
    }
  } else {
    sessionStorage.removeItem(PERSIST_CUSTOM_FORM_KEY)
  }
}

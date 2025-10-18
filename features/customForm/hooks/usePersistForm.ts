import { useEffect } from 'react'

import { PERSIST_CUSTOM_FORM_KEY } from '@/features/customForm/consts'
import { IConvertableForm } from '@/features/customForm/types'

interface IProps {
  value: IConvertableForm
  localStorageKey: string
}

export const usePersistForm = ({ value, localStorageKey }: IProps) => {
  useEffect(() => {
    const data = sessionStorage.getItem(PERSIST_CUSTOM_FORM_KEY)

    const all: Record<string, IConvertableForm> = data ? JSON.parse(data) : {}
    all[localStorageKey] = value

    sessionStorage.setItem(PERSIST_CUSTOM_FORM_KEY, JSON.stringify(all))
  }, [value, localStorageKey])

  return
}

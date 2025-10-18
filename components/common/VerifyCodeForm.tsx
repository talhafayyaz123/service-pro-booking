import { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { ErrorMessage } from '@/components/typography'

interface Props {
  length?: number
  getValues?: (v: string[]) => void
  buttonRef?: any
  error: string
  wrapperClassName?: string
  inputClassName?: string
  className?: string
  setError: (s: string) => void
}

export const Verify = ({
  length = 4,
  getValues,
  buttonRef,
  wrapperClassName,
  className,

  error,
  inputClassName,
  setError,
}: Props) => {
  const methods = useFormContext<{ code: string[] }>()
  const { watch, setFocus } = methods

  const [focusInput, setFocusInput] = useState<number | null>()
  useEffect(() => getValues && getValues(watch('code')), [getValues, watch])

  useEffect(() => {
    setFocus(`code.${0}`)
  }, [setFocus])

  const data = [...new Array(length)].map((_, index) => ({
    id: index,
  }))

  const disabled = useCallback(
    (id: number) => id !== focusInput && !watch(`code.${id}`),
    [focusInput, watch]
  )

  return (
    <div className={`small:my-8 mt-8 mb-4 mx-auto ${className}`}>
      <div className={`flex gap-3 tablet:gap-6 ${wrapperClassName}`}>
        {data.map(({ id }) => {
          return (
            <div key={id}>
              <input
                {...methods.register(`code.${id}`)}
                onKeyUp={(e) => {
                  if (e.code === 'Backspace') {
                    id > 0 && methods.setFocus?.(`code.${id - 1}`)
                  }
                }}
                onChange={(e) => {
                  if (error) {
                    setError('')
                  }
                  const value = e.target.value
                  methods.setValue(
                    `code.${id}`,
                    value.length > 1 ? value.slice(0, 1) : value
                  )
                  data.length - (id + 1) > 0 &&
                    methods.setFocus?.(`code.${id + 1}`)
                  id === length - 1 && buttonRef && buttonRef.current?.focus()
                }}
                maxLength={1}
                onFocus={(e) => {
                  e.target.select()
                  setFocusInput(id)
                  const values = watch('code').filter(
                    (el: string, index: number) => index < id
                  )
                  const ind = values.findIndex((el: string) => el === '')
                  const emptyInput = ind >= 0 ? ind : 0
                  values.includes('') && methods.setFocus(`code.${emptyInput}`)
                }}
                tabIndex={id + 1}
                id={'hide_arrows'}
                className={`w-16 h-16 text-24 font-bold ${
                  error ? 'border-orange' : 'border-lightGray/50'
                }  outline-none rounded-2xl text-center border focus-visible:border-orange ${
                  disabled(id) ? 'bg-[#F9FAFB]' : ''
                } ${inputClassName} focus-visible:caret-orange`}
                type="number"
              />
            </div>
          )
        })}
      </div>
      {error && (
        <ErrorMessage className="mt-5 !text-16 block font-medium">
          {error}
        </ErrorMessage>
      )}
    </div>
  )
}

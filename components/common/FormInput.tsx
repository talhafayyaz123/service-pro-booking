import { ChangeEvent } from 'react'
import {
  Controller,
  get,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form'

import { IInputProps, Input } from '@/components/common/Input'

export interface IFormInput extends IInputProps {
  name: string
  rules?: RegisterOptions
  sideEffect?: (v?: ChangeEvent<HTMLInputElement>) => void
}

export const FormInput = ({
  name,
  rules,
  sideEffect,
  error,
  ...rest
}: IFormInput) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, formState }) => {
        return (
          <Input
            error={error ?? get(formState.errors, name)?.message}
            value={field.value}
            onChange={(v) => {
              field.onChange(v)
              sideEffect?.(v)
            }}
            {...rest}
          />
        )
      }}
    />
  )
}

import { LegacyRef, ReactNode } from 'react'
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'

import {
  Checkbox,
  CheckboxWithLabel,
  ICheckboxWithLabelProps,
} from '@/components/common/Checkbox'
import { IFormInput } from '@/components/common/FormInput'

import { ErrorMessage } from '../typography'
interface IFormCheckbox extends IFormInput {
  checked?: boolean
  sideEffect?: () => void
  rightLabel?: ReactNode
  currentRef?: LegacyRef<HTMLDivElement>
}
export const FormCheckbox = ({
  name,
  rules,
  sideEffect,
  ...rest
}: IFormCheckbox) => {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        return (
          <>
            <Checkbox
              {...rest}
              error={!!error}
              value={field.value}
              checked={field.value}
              onChange={() => {
                field.onChange(!field.value)
                sideEffect && sideEffect()
              }}
            />
            {error && (
              <ErrorMessage className="!block text-left mt-1">
                {error.message}
              </ErrorMessage>
            )}
          </>
        )
      }}
    />
  )
}

export interface IFormCheckboxWithLabelProps extends ICheckboxWithLabelProps {
  name: string
  rules?: RegisterOptions
  sideEffect?: () => void
}

export const FormCheckboxWithLabel = ({
  name,
  rules,
  sideEffect,
  ...rest
}: IFormCheckboxWithLabelProps) => {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => {
        return (
          <CheckboxWithLabel
            {...rest}
            value={field.value}
            checked={field.value}
            onChange={() => {
              field.onChange(!field.value)
              sideEffect && sideEffect()
            }}
          />
        )
      }}
    />
  )
}

import {
  Controller,
  get,
  RegisterOptions,
  useFormContext,
} from 'react-hook-form'
import { TextareaAutosizeProps } from 'react-textarea-autosize'

import TextArea, { ITextAreaProps } from './TextArea'

export interface IFormInput extends ITextAreaProps {
  name: string
  rules?: RegisterOptions
}

export const FormTextArea = ({
  name,
  rules,
  ...rest
}: IFormInput & TextareaAutosizeProps) => {
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, formState }) => {
        return (
          <TextArea
            error={get(formState.errors, name)?.message}
            value={field.value}
            onChange={(e) => {
              const value = e.target.value
              field.onChange(value === ' ' ? '' : value)
            }}
            {...rest}
          />
        )
      }}
    />
  )
}

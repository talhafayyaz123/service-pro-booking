import { ReactNode } from 'react'
import { Controller } from 'react-hook-form'

import {
  IRadioWithLabelProps,
  Radio,
  RadioWithLabel,
} from '@/components/common/Radio'

interface IFormRadioProps
  extends Omit<IRadioWithLabelProps, 'checked' | 'onChange' | 'label'> {
  name: string
}

export const FormRadio = ({ name, value, currentRef }: IFormRadioProps) => {
  return (
    <Controller
      name={name}
      render={({ field }) => (
        <Radio
          currentRef={currentRef}
          value={value as string}
          onChange={field.onChange}
          checked={field.value === value}
        />
      )}
    />
  )
}

export const FormRadioWithLabel = ({
  name,
  value,
  currentRef,
  ...rest
}: IFormRadioProps & { label: ReactNode }) => {
  return (
    <Controller
      name={name}
      render={({ field }) => (
        <RadioWithLabel
          currentRef={currentRef}
          value={value as string}
          onChange={field.onChange}
          checked={field.value === value}
          {...rest}
        />
      )}
    />
  )
}

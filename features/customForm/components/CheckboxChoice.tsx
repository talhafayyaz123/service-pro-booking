import React from 'react'
import { Controller, get } from 'react-hook-form'

import { Checkbox } from '@/components/common/Checkbox'
import { H14, H18WithRequired } from '@/components/typography'

export const CheckboxChoice = ({
  question,
  name,
  isRequired,
  answer,
}: {
  question: string
  name: string
  answer: string
  isRequired: boolean
}) => {
  return (
    <Controller
      render={({ field, formState }) => (
        <div>
          <H18WithRequired required={isRequired}>{question}</H18WithRequired>
          <div className={'mt-3'} ref={field.ref} onBlur={field.onBlur}>
            <Checkbox
              className={'w-fit '}
              rightLabel={<H14 className={'maxTablet:!text-16 '}>{answer}</H14>}
              checked={field.value === 'true'}
              error={!!get(formState.errors, name)?.message}
              value={field.value}
              onChange={(v) => {
                field.onChange(typeof v === 'undefined' ? '' : 'true')
              }}
            />
          </div>
        </div>
      )}
      rules={{
        required: { value: isRequired, message: 'This field is required' },
      }}
      name={name}
    />
  )
}

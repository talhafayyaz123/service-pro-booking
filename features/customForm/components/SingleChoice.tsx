import React from 'react'
import { Controller, get } from 'react-hook-form'

import { RadioWithLabel } from '@/components/common/Radio'
import { H14 } from '@/components/typography'

export const SingleChoice = ({
  answerOptions,
  name,
  isRequired,
}: {
  answerOptions: string[]
  name: string
  isRequired: boolean
}) => {
  return (
    <div className={'grid gap-3 mt-4'}>
      <Controller
        render={({ field, formState }) => (
          <>
            {answerOptions.map((option, index) => (
              <RadioWithLabel
                label={
                  <H14
                    className={'break-all line-clamp-3'}
                    color={'text-black'}
                  >
                    {option}
                  </H14>
                }
                checked={option === field.value}
                onChange={field.onChange}
                rightLabel
                error={!!get(formState.errors, name)?.message}
                value={option}
                key={index}
              />
            ))}
          </>
        )}
        rules={{
          required: { value: isRequired, message: 'This field is required' },
        }}
        name={name}
      />
    </div>
  )
}

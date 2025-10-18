import React from 'react'
import { Controller, get, useFieldArray, useFormContext } from 'react-hook-form'

import { Checkbox } from '@/components/common/Checkbox'
import { H14 } from '@/components/typography'

export const MultyChoice = ({
  index,
  isRequired,
}: {
  index: number
  isRequired: boolean
}) => {
  const { control, formState } = useFormContext()
  const error = get(formState.errors, `answers[${index}].answer`)?.root?.message

  const { fields } = useFieldArray({
    name: `answers[${index}].answer` as any,
    control,
    keyName: 'keyId',
    rules: isRequired
      ? {
          validate: (v: any[]) =>
            v.some((el) => !!el.isChecked) ? true : 'This field is required',
        }
      : {},
  })

  return (
    <div className={'grid  gap-1.5 tablet:gap-3 mt-4'}>
      {(fields as { isChecked: boolean; name: string; keyId: string }[]).map(
        ({ name, keyId }, idx) => (
          <Controller
            key={keyId}
            render={({ field }) => (
              <Checkbox
                className={''}
                error={!!error}
                rightLabel={
                  <H14
                    className={'line-clamp-3 break-all'}
                    color={'text-black'}
                  >
                    {name}
                  </H14>
                }
                checked={field.value === 'true'}
                value={field.value}
                onChange={(v) => {
                  field.onChange(typeof v === 'undefined' ? '' : 'true')
                }}
                key={index}
              />
            )}
            name={`answers[${index}].answer[${idx}].isChecked`}
          />
        )
      )}
    </div>
  )
}

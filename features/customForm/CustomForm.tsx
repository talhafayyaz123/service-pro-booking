import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { ErrorMessage, H14, H18WithRequired } from '@/components/typography'
import { cn } from '@/core/helpers/cn'
import { Choice } from '@/features/customForm/components/Choices'
import { IConvertableForm, TNameType } from '@/features/customForm/types'

interface IProps {
  className?: string
}

export const CustomForm = ({ className }: IProps) => {
  const { control, getFieldState } = useFormContext<IConvertableForm>()
  const { fields } = useFieldArray({
    name: 'answers',
    control,
    keyName: 'keyId',
  })

  return (
    <div className={cn('laptop:pb-4 h-fit', className)}>
      {fields.map((question, index) => {
        const name = `answers[${index}].answer`
        const state = getFieldState(name as TNameType)

        return (
          <div
            key={question.keyId}
            className={
              'border-b border-lightGray py-5 last-of-type:pb-0 last-of-type:border-none'
            }
          >
            {question.type !== 'CHECKBOX' && (
              <H18WithRequired
                required={!!question.isRequired}
                className={'mb-1.5 tablet:mb-3 '}
              >
                {question.title}
              </H18WithRequired>
            )}

            <H14 className={'break-words'}>{question.description}</H14>

            {question.type !== 'PARAGRAPH' && (
              <Choice {...question} index={index} />
            )}

            <div className={'mt-1.5 tablet:mt-4 flex gap-1'}>
              {!!question.isRequired && (
                <ErrorMessage>*Required question</ErrorMessage>
              )}
              {state.error && state.error.message && (
                <ErrorMessage>{state.error.message}</ErrorMessage>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

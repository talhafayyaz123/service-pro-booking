import React, { memo, ReactNode, useMemo } from 'react'

import { Answer } from '@/features/customForm/components/Answer'
import { CheckboxChoice } from '@/features/customForm/components/CheckboxChoice'
import { MultyChoice } from '@/features/customForm/components/MultyChoice'
import { SingleChoice } from '@/features/customForm/components/SingleChoice'
import { SinglePhotoUpload } from '@/features/customForm/components/SinglePhotoUpload'
import { IQuestion, TCustomFormTypes } from '@/features/customForm/types'

export const Choice = memo(
  ({
    type,
    answerOptions,
    index,
    title,
    isRequired,
  }: IQuestion & { index: number } & any) => {
    const name = `answers[${index}].answer`
    const choices: Record<TCustomFormTypes, ReactNode> = useMemo(
      () => ({
        SINGLE_CHOOSE: (
          <SingleChoice
            name={name}
            isRequired={!!isRequired}
            answerOptions={answerOptions}
          />
        ),
        CHECKBOX: (
          <CheckboxChoice
            isRequired={!!isRequired}
            name={name}
            question={title}
            answer={answerOptions}
          />
        ),
        LONG_ANSWER: (
          <Answer isRequired={!!isRequired} name={name} maxLength={500} />
        ),
        MULTIPLE_CHOOSE: (
          <MultyChoice isRequired={!!isRequired} index={index} />
        ),
        PARAGRAPH: <></>,
        SHORT_ANSWER: (
          <Answer isRequired={!!isRequired} name={name} maxLength={150} />
        ),
        SINGLE_PHOTO: (
          <SinglePhotoUpload name={name} isRequired={!!isRequired} />
        ),
      }),
      [answerOptions, index, isRequired, name, title]
    )

    return <>{choices[type as TCustomFormTypes]}</>
  }
)

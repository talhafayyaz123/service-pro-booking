import { ITemplateForm } from '@/features/booking/store/bookingStore'
import { IAnswers, TCustomFormTypes } from '@/features/customForm/types'

export const convertToDefault = (currentForm?: ITemplateForm) => {
  return {
    formAnswerId: currentForm?.id,
    title: currentForm?.title,
    description: currentForm?.description,
    isRequired: !!currentForm?.isRequired,
    isAnswered: !!currentForm?.isAnswered,
    answers: currentForm?.questions.map((question) => ({
      ...question,
      answer: convertAnswer(question),
    })),
  }
}

const convertAnswer = (question: IQuestion) => {
  switch (question.type) {
    case 'MULTIPLE_CHOOSE':
      return question.answerOptions.map((name: string) => ({
        isChecked: (question.answers as string[]).includes(name)
          ? 'true'
          : 'false',
        name,
      }))
    case 'CHECKBOX': {
      return question.answers ? 'true' : 'false'
    }
    case 'PARAGRAPH': {
      return 'PARAGRAPH'
    }
    default: {
      return question.answers
    }
  }
}

export const setAnswers = ({ type, answer }: IAnswers) => {
  if (type === 'MULTIPLE_CHOOSE') {
    return {
      answers: (answer as { isChecked: string; name: string }[])
        .filter((el) => el.isChecked === 'true')
        .map((el) => el.name),
    }
  } else if (type === 'CHECKBOX') {
    return { answers: answer === 'true' }
  } else if (type === 'SINGLE_CHOOSE' && answer === '') {
    return null
  } else {
    return { answers: answer }
  }
}
interface IQuestion {
  type: TCustomFormTypes
  title: string
  description: string
  isRequired: string
  answers?: string | boolean | string[]
  answerOptions: string[]
}

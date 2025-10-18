export type TNameType = `answers.${number}.answer`

// export interface ICustomForm {
//   customFormId: string
//   title: string
//   description: string
// }

export interface IAnswers extends Omit<IQuestion, 'answer'> {
  answer: string | boolean | undefined | { isChecked: string; name: string }[]
}
export interface IConvertableForm {
  customFormId: string
  title: string
  description: string
  isRequired: boolean
  isAnswered: boolean
  proServiceId: string
  answers: IAnswers[]
}

export type TCustomFormTypes =
  | 'SINGLE_CHOOSE'
  | 'MULTIPLE_CHOOSE'
  | 'SHORT_ANSWER'
  | 'LONG_ANSWER'
  | 'CHECKBOX'
  | 'PARAGRAPH'
  | 'SINGLE_PHOTO'

export interface IQuestion {
  type: TCustomFormTypes
  title: string
  description: string
  isRequired: string
  answers?: string | boolean
  answerOptions: string[]
}

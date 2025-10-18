import { createSelector } from 'reselect'

import { ITemplateForm } from '@/features/booking/store/bookingStore'
import { IFormsStatus } from '@/features/customForm/store/slice'
import {
  IAnswers,
  IConvertableForm,
  IQuestion,
} from '@/features/customForm/types'
import { RootStateType } from '@/store/rootStore'

const forms = (state: RootStateType) => state.customForm
const bookings = (state: RootStateType) => state.bookings
const store = (state: RootStateType) => state

export const viewBookingsCustomFormsSelector = createSelector(
  bookings,
  ({ viewBooking }) => {
    return {
      formAnswers: viewBooking.data.formAnswers.map((el) => ({
        ...el,
        questions: el.answers,
      })),
      pro: viewBooking.data.pro,
      status: viewBooking.data.status,
    }
  }
)

export const currentFormSelector = createSelector(
  viewBookingsCustomFormsSelector,
  store,
  ({ formAnswers }, { modals }) => {
    return formAnswers.find((el) => el.id === modals.state?.id)
  }
)

export const defaultValuesSelector = createSelector(
  (state: RootStateType) => state.customForm.forms,
  (_: void, customForms: ITemplateForm[]) => customForms,
  (state: RootStateType) => state.modals.state,
  (forms, customForms, modalState) => {
    const currentForm = customForms.find((el) => el.id === modalState?.id)
    const touchedForm = forms.find((el) => el.id === currentForm?.id)

    return touchedForm?.data ? touchedForm?.data : convertToDefault(currentForm)
  }
)

export const convertToDefault = (currentForm?: ITemplateForm) => {
  return {
    customFormId: currentForm?.id,
    title: currentForm?.title,
    description: currentForm?.description,
    isRequired: !!currentForm?.isRequired,
    answers: currentForm?.questions.map((question) => ({
      ...question,
      answer: convertAnswer(question),
    })),
  }
}

export const convertAnswer = (question: IQuestion) => {
  if (question.type === 'MULTIPLE_CHOOSE') {
    return question.answerOptions.map((name: string) => ({
      isChecked: '',
      name,
    }))
  } else if (question.type === 'CHECKBOX') {
    return ''
  } else if (question.type === 'PARAGRAPH') {
    return 'PARAGRAPH'
  } else {
    return ''
  }
}

export const validateFormSelector = createSelector(
  forms,
  ({
    forms,
  }): Record<
    string,
    { validate?: IFormsStatus; id?: string; isRequiredForm: boolean }
  > =>
    forms.reduce(
      (
        acc,
        { id, data, isTouched, clearClose, trySubmit, isRequiredForm }
      ) => ({
        ...acc,
        [id]: {
          id,
          isRequiredForm,
          validate: validate(
            data,
            isTouched,
            trySubmit,
            clearClose,
            isRequiredForm
          ),
        },
      }),
      {}
    )
)

export const formAnswersForCreateSelector = createSelector(
  forms,
  ({ forms }) => {
    return forms
      .filter((e) => !!e.data)
      .map(({ data, id }) => ({
        customFormId: data?.customFormId,
        formAnswerId: id,
        title: data?.title,
        description: data?.description,
        isRequired: data?.isRequired,
        answers: data?.answers.map((el) => setAnswers(el)),
      }))
  }
)

export const setAnswers = ({ type, answer }: IAnswers) => {
  if (type === 'MULTIPLE_CHOOSE') {
    return {
      answers: (answer as { isChecked: string; name: string }[])
        .filter((el) => !!el.isChecked)
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

export const getFormDataByIdSelector = createSelector(
  validateFormSelector,
  (_: void, id: string) => id,
  (formData, id) =>
    (
      formData[id as keyof typeof formData] as {
        id: string
        validate?: IFormsStatus
      }
    )?.validate
)

export const validate = (
  data: IConvertableForm | null,
  isTouched: boolean,
  trySubmit: boolean,
  clearClose: boolean,
  isRequiredForm: boolean
): IFormsStatus => {
  if (
    (data === null && trySubmit && isRequiredForm) ||
    (data === null && clearClose && isRequiredForm)
  ) {
    return 'error'
  }
  if (!isTouched) {
    return 'notFilled'
  }

  if (data === null) {
    return 'notFilled'
  }

  const requiredForms = data?.answers.filter((el) => el.isRequired)
  let res: IFormsStatus = 'completed'
  for (const form of requiredForms) {
    if (form.type === 'MULTIPLE_CHOOSE') {
      const isEmpty = (
        form.answer as { isChecked: string; name: string }[]
      ).every((el) => el.isChecked === '')
      if (isEmpty) {
        res = 'error'
      }
      break
    } else if (form.answer === '') {
      res = 'error'
      break
    } else {
      res = 'completed'
    }
  }
  return res
}

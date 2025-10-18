import { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Button } from '@/components/common/buttons/Button'
import { FormInput } from '@/components/common/FormInput'
import { FormTextArea } from '@/components/common/FormTextArea'
import { Modal, useModalData } from '@/components/modals/Modal'
import { H24 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { useLazySetFaqQuery } from '@/features/userProfile/store/userProfileRequests'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

interface IForm {
  subject: string
  description: string
}

const AskAQuestionModal = () => {
  const { isOpen, onCloseModal } = useModalData(
    MODALS_TYPE.USER_PROFILE_ASK_A_QUESTION
  )

  const dispatch = useAppDispatch()
  const methods = useForm<IForm>({
    defaultValues: { subject: '', description: '' },
  })

  const setErrors = useCallback(() => {
    methods.setError('subject', { message: 'Failed to send data' })
    methods.setError('description', { message: 'Failed to send data' })
  }, [methods])

  const [action, response] = useLazySetFaqQuery()
  const { isLoading } = response

  const onSubmit = useCallback(
    (data: IForm) => {
      action(data)
        .then((e) => {
          if (e?.data?.result) {
            dispatch(setModal({}))
          } else {
            setErrors()
          }
        })
        .catch(() => {
          setErrors()
        })
    },
    [action, dispatch, setErrors]
  )
  return (
    <Modal
      maxWidth={503}
      space={'pt-7'}
      title={<H24>Ask a question</H24>}
      isOpen={isOpen}
      titleClassName={'border-b border-lightGray pb-6  flex mx-7'}
      onClose={onCloseModal}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className={''}>
          <FormInput
            rules={{
              required: { value: true, message: 'This field is required' },
            }}
            name={'subject'}
            label={'Title'}
            className={'m-8 '}
          />
          <FormTextArea
            name={'description'}
            rules={{
              required: { value: true, message: 'This field is required' },
            }}
            label={'Description'}
            minRows={3}
            className={'mx-8 mb-8'}
            maxRows={8}
          />
          <div className={'px-7 shadow-xl pb-4 pt-4'}>
            <Button
              buttonType={'orange'}
              disabled={isLoading}
              type={'submit'}
              className={'w-full'}
            >
              Ask a question
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  )
}

export default AskAQuestionModal

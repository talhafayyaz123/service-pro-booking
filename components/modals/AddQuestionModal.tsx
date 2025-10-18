import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/common/buttons/Button'
import { Input } from '@/components/common/Input'
import TextArea from '@/components/common/TextArea'
import { Modal } from '@/components/modals/Modal'
import { H24 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'

export const AddQuestionModal = () => {
  const { isSmall } = useMediaScreen()
  const dispatch = useAppDispatch()

  const { currentModal, text, subText, action, deleteAction } =
    useAppSelector(modalsSelector)

  const [value, setValue] = useState({ question: '', answer: '' })

  useEffect(() => {
    text && subText && setValue({ question: text, answer: subText })
  }, [subText, text])

  const onClose = useCallback(() => {
    dispatch(setModal({}))
    setValue({ question: '', answer: '' })
  }, [dispatch])

  return (
    <Modal
      onClose={onClose}
      divider
      maxWidth={isSmall ? 575 : 503}
      titleClassName="pb-4 small:pb-0 mx-6 small:mx-8 small:mb-8 border-b border-b-lightGray small:border-0 !items-center"
      className="small:rounded-3xl overflow-hidden  small:mx-6 small:my-10 rounded-t-[20px] max-h-screen"
      wrapperClassName="flex small:items-center items-end justify-center small:p-1"
      title={
        <div className={'w-full '}>
          <H24 className="mb-4 mr-auto">Add a question</H24>
        </div>
      }
      space="small:pt-8 pt-[52px]"
      isOpen={currentModal === MODALS_TYPE.FAQ_SECTION}
    >
      <div
        className={'mx-8 mt-6 small:mt-8 max-h-[600px] h-full overflow-auto'}
      >
        <Input
          label={'Question'}
          placeholder={'Enter question'}
          value={value.question}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, question: e.target.value }))
          }
        />
        <TextArea
          inputClassName={'h-full min-h-[160px] mb-[183px] small:mb-0'}
          label={'Answer'}
          className={'pb-6 mt-4 small:mt-8'}
          value={value.answer}
          placeholder={'Enter answer'}
          minRows={6}
          onChange={(e) =>
            setValue((prev) => ({ ...prev, answer: e.target.value }))
          }
        />
      </div>
      <div
        className={
          'small:p-8 px-5 py-3 gap-5 bg-white small:pt-6 flex shadow-xl'
        }
      >
        <Button
          onClick={() => {
            action && action({ question: value.question, answer: value.answer })
            onClose()
          }}
          disabled={value.answer === '' || value.question === ''}
          className={'w-full'}
          buttonType={'orange'}
        >
          Save
        </Button>
        {deleteAction && (
          <Button
            onClick={() => {
              deleteAction()
              onClose()
            }}
            className={'w-full'}
            buttonType={'lightMain'}
          >
            Delete
          </Button>
        )}
      </div>
    </Modal>
  )
}

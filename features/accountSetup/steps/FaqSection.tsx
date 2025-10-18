import { useCallback } from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import { useFieldArray, useFormContext } from 'react-hook-form'

import { IconArrowLeft, IconDrag, IconPlus } from '@/assets/icons/icons'
import { H16, H24, H40, OrangeBlock } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'
import { IOnboardingRequest } from '@/types/onboarding'

export const FaqSection = () => {
  const dispatch = useAppDispatch()
  const { control } = useFormContext<IOnboardingRequest>()
  const { fields, append, update, move, remove } = useFieldArray({
    name: 'proFAQs',
    control,
  })

  const handleAppend = useCallback(
    (question: string, answer: string) => {
      append({ question, answer, order: 0 })
    },
    [append]
  )
  const handleDelete = useCallback((index: number) => remove(index), [remove])
  const handleAddQuestion = () => {
    dispatch(
      setModal({
        currentModal: MODALS_TYPE.FAQ_SECTION,
        action: ({ question, answer }: { question: string; answer: string }) =>
          handleAppend(question, answer),
      })
    )
  }

  const handleUpdate = useCallback(
    (question: string, answer: string, index: number) => {
      update(index, { question, answer, order: 0 })
    },
    [update]
  )
  // const handleDrag = ({ source, destination }) => {
  const handleDrag = ({ source, destination }: DropResult) => {
    if (destination) {
      move(source.index, destination.index)
    }
  }
  return (
    <div className="my-8 tablet:mt-20 bg-white mx-auto  tablet:p-[60px] max-w-[620px] rounded-[20px]    tablet:shadow-xl">
      <H40 className="mx-5 tablet:mx-0 !font-bold mb-5 tablet:mb-8">
        Create FAQ
      </H40>
      <OrangeBlock className="mx-5 tablet:mx-0">
        Share the answers to your most asked client questions here!
      </OrangeBlock>
      <div className="bg-white mt-6 p-5 pt-6 tablet:p-6 maxTablet:rounded-b-none rounded-[20px] shadow-xl">
        <H24>General FAQ</H24>
        <DragDropContext onDragEnd={handleDrag}>
          <Droppable droppableId="test-items">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields.map(({ id, question, answer }, index) => (
                  <div key={`proFAQs[${index}]`}>
                    <Draggable
                      key={`proFAQs[${index}]`}
                      draggableId={`proFAQs[${index}]`}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          role="button"
                          style={{
                            ...provided.draggableProps.style,
                          }}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          onClick={() =>
                            dispatch(
                              setModal({
                                currentModal: MODALS_TYPE.FAQ_SECTION,
                                text: question,
                                subText: answer,
                                deleteAction: () => handleDelete(index),
                                action: ({
                                  question,
                                  answer,
                                }: {
                                  question: string
                                  answer: string
                                }) => handleUpdate(question, answer, index),
                              })
                            )
                          }
                          className={`bg-white py-5 tablet:py-6 flex gap-3 items-center justify-between cursor-pointer border-lightGray border-b`}
                          key={id}
                        >
                          <div className="flex items-center gap-5">
                            <div {...provided.dragHandleProps}>
                              <IconDrag />
                            </div>
                            <H16>{question}</H16>
                          </div>
                          <IconArrowLeft className="flex-shrink-0 rotate-180" />
                        </div>
                      )}
                    </Draggable>
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <div className="flex">
          <div
            role="button"
            onClick={handleAddQuestion}
            className="mt-5 cursor-pointer group"
          >
            <IconPlus className="mb-1 inline mr-3.5 group-hover:text-orange1 transition" />
            <H16 className="inline transition group-hover:text-orange1">
              Add a question
            </H16>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'

import { Button } from '@/components/common/buttons/Button'
import { Checkbox } from '@/components/common/Checkbox'
import TextArea from '@/components/common/TextArea'
import { useModalData } from '@/components/modals/Modal'
import { NewModal } from '@/components/modals/NewModal'
import {
  MODALS_TYPE,
  SUBSCRIPTION_CANCELLATION_REASONS,
} from '@/core/consts/common'
import { setCancellationReasons } from '@/features/userProfile/store/userProfileSlice'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'
import {
  ICancellationReson,
  ISubscriptionCancellationReason,
} from '@/types/common'

export const CancellationFeedbackModal = () => {
  // work with modal on global store
  const { isOpen, onCloseModal } = useModalData(
    MODALS_TYPE.CANCEL_SUBSCRIPTION_REASON_MODAL
  )
  const dispatch = useAppDispatch()
  const openModal = useCallback(
    (modal: MODALS_TYPE) => dispatch(setModal({ currentModal: modal })),
    [dispatch]
  )

  // local state for feedback modal
  const [selectedReasons, setSelectedReasons] = useState<
    ISubscriptionCancellationReason[]
  >([])
  const [isError, setIsError] = useState(false)

  // handle "Continue" button click
  const handleContinueClick = useCallback(() => {
    if (selectedReasons.length === 0) {
      setIsError(true)
      return
    }

    const feedbacks: ICancellationReson[] = selectedReasons.map((reason) => {
      return {
        id: reason.id,
        optionalFeedback: reason.optionalFeedback || '',
      }
    })

    // save feedback into store
    dispatch(setCancellationReasons(feedbacks))

    // close itself
    onCloseModal()

    // open unsubscribe modal
    openModal(MODALS_TYPE.CANCEL_SUBSCRIPTION_MODAL)
  }, [selectedReasons, onCloseModal, openModal, dispatch])

  // clean selected reasons and error on modal close
  useEffect(() => {
    if (!isOpen) {
      setSelectedReasons([])
      setIsError(false)
    }
  }, [isOpen])

  // clean error on at least one reason selected
  useEffect(() => {
    if (selectedReasons.length > 0) {
      setIsError(false)
    }
  }, [selectedReasons])

  return (
    <NewModal
      title={<ModalTitle isError={isError} />}
      isOpen={isOpen}
      onClose={() => onCloseModal()}
      footer={
        <ModalFooter
          onBack={() => onCloseModal()}
          onContinue={handleContinueClick}
        />
      }
    >
      <FeedbackForm
        selectedReasons={selectedReasons}
        onSelectReasons={setSelectedReasons}
      />
    </NewModal>
  )
}

const ModalTitle = ({ isError }: { isError: boolean }) => {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-bold text-28 leading-9 text-[#1F1E20]">
        Cancellation feedback
      </h2>
      {isError && (
        <div className="text-center text-14 leading-4 text-red-500">
          Please select at least one reason
        </div>
      )}
    </div>
  )
}

const ModalFooter = ({
  onBack,
  onContinue,
}: {
  onBack: () => void
  onContinue: () => void
}) => {
  return (
    <div className="flex items-center justify-between">
      <Button
        className="min-w-40 lg:min-w-[200px]"
        buttonType="lightMain"
        onClick={() => onBack()}
      >
        Back
      </Button>
      <Button
        className="min-w-40 lg:min-w-[200px]"
        buttonType="orange"
        onClick={() => onContinue()}
      >
        Continue
      </Button>
    </div>
  )
}

interface IFeedbackForm {
  selectedReasons: ISubscriptionCancellationReason[]
  onSelectReasons: (reasons: ISubscriptionCancellationReason[]) => void
}

const FeedbackForm = ({ selectedReasons, onSelectReasons }: IFeedbackForm) => {
  const handleOnChange = useCallback(
    (reason: ISubscriptionCancellationReason) => {
      const findReason = selectedReasons.find((r) => r.id === reason.id)
      if (findReason) {
        onSelectReasons(selectedReasons.filter((r) => r !== reason))
      } else {
        onSelectReasons([...selectedReasons, reason])
      }
    },
    [selectedReasons, onSelectReasons]
  )

  const handleFeedbackChange = useCallback(
    (value: string, reason: ISubscriptionCancellationReason) => {
      const updatedReasons = selectedReasons.map((r) => {
        if (r.id === reason.id) {
          return {
            ...r,
            optionalFeedback: value,
          }
        }
        return r
      })
      onSelectReasons(updatedReasons)
    },
    [selectedReasons, onSelectReasons]
  )

  return (
    <div className="flex flex-col gap-4 py-8">
      {SUBSCRIPTION_CANCELLATION_REASONS.map((reason) => {
        const isChecked = getChecked(reason, selectedReasons)
        const foundValue = selectedReasons.find((r) => r.id === reason.id)

        return (
          <div
            className="flex flex-col pb-4 border-b border-lightGray last:border-none"
            key={reason.id}
          >
            <label
              role="none"
              onClick={() => handleOnChange(reason)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox checked={isChecked} />
              <span className="text-16 leading-[22px] text-black">
                {reason.reason}
              </span>
            </label>
            {isChecked && reason.optionalFeedbackQuestion && (
              <div className="mt-4">
                <div className="text-14 leading-4 mb-2">
                  {reason.optionalFeedbackQuestion}
                </div>
                <TextArea
                  onChange={(v) => handleFeedbackChange(v.target.value, reason)}
                  value={foundValue?.optionalFeedback || ''}
                  size="200"
                  minRows={4}
                  maxLength={200}
                  count
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const getChecked = (
  reason: ISubscriptionCancellationReason,
  selectedReasons: ISubscriptionCancellationReason[]
) => {
  return selectedReasons.some((r) => r.id === reason.id)
}

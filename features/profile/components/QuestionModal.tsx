import { IconCommentIcon18 } from '@/assets/icons/icons'
import { ApplePayLink } from '@/components/common/ApplePayLink'
import { GooglePlayLink } from '@/components/common/GooglePlayLink'
import { Modal, useModalData } from '@/components/modals/Modal'
import { H28 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'

const QuestionModal = () => {
  const { isOpen, onCloseModal } = useModalData(MODALS_TYPE.ASK_A_QUESTION)
  return (
    <Modal
      space={'p-6 tablet:p-6'}
      className={'w-fit max-w-[328px] tablet:max-w-[416px] rounded-[24px]'}
      isOpen={isOpen}
      titleClassName={'pb-6 '}
      onClose={onCloseModal}
    >
      <div className={'flex flex-col items-center '}>
        <div
          className={
            'w-[78px] h-[78px] flex items-center justify-center border border-lightGray rounded-full mb-8'
          }
        >
          <IconCommentIcon18
            width="28"
            height="28"
            viewBox="0 0 19 19"
            className={'!stroke-orange '}
          />
        </div>
        <H28 className={'maxTablet:text-24'}>
          To ask a question, please download the app.
        </H28>
        <div className={'flex gap-3 tablet:gap-5 items-center h-12 mt-8'}>
          <ApplePayLink type={'black'} />
          <GooglePlayLink />
        </div>
      </div>
    </Modal>
  )
}

export default QuestionModal

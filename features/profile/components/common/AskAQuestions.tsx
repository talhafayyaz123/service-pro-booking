import { IconArrowLeft, IconCommentIcon18 } from '@/assets/icons/icons'
import { H14, H16 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const AskAQuestions = () => {
  const dispatch = useAppDispatch()

  const onOpenModal = () => {
    dispatch(setModal({ currentModal: MODALS_TYPE.ASK_A_QUESTION }))
  }
  return (
    <div
      role={'button'}
      onClick={onOpenModal}
      className="flex justify-between items-center border border-lightGray rounded-[12px] min-h-[60px] maxTablet:py-[14px] py-1 px-4 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <IconCommentIcon18
          className={'stroke-[#939DAA]'}
          width="28"
          height="28"
          viewBox="0 0 20 20"
        />

        <div className="flex flex-col gap-1">
          <H16 className={'leading-[16px]'}>Ask a question</H16>
          <H14 className="tablet:text-12 tablet:leading-[16px]">
            Usually responds within 3 hours
          </H14>
        </div>
      </div>
      <IconArrowLeft className="rotate-180 stroke-black" />
    </div>
  )
}

export const AskAQuestionsMobile = () => {
  const dispatch = useAppDispatch()

  const onOpenModal = () => {
    dispatch(setModal({ currentModal: MODALS_TYPE.ASK_A_QUESTION }))
  }
  return (
    <div
      role={'button'}
      onClick={onOpenModal}
      className="flex justify-between items-center border border-lightGray rounded-[12px] py-[14px] px-4 cursor-pointer mt-5"
    >
      <div className="flex items-center gap-3">
        <IconCommentIcon18 className={'stroke-gray'} />
        <div>
          <H16 className="leading-[18px]">Ask a question</H16>
          <H14>Usually responds within 3 hours</H14>
        </div>
      </div>
      <IconArrowLeft className="rotate-180 stroke-black" />
    </div>
  )
}

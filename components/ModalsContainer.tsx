import dynamic from 'next/dynamic'

import { MODALS_TYPE } from '@/core/consts/common'
import { ModalRender } from '@/features/modalsConfig/ModalRenderContainer'
import MessageProModal from '@/features/profile/components/common/MessageProModal'
import ProfileImageModal from '@/features/profile/components/ProfileImageModal'
import { useAppSelector } from '@/hooks/hooks'

const SignUp = dynamic(() => import('@/components/modals/signUp/SignUp'))

const SignIn = dynamic(() => import('@/components/modals/signIn/SignIn'))

const EmailExistsModal = dynamic(
  () => import('@/components/modals/EmailExistsModal')
)

const AskAQuestionModal = dynamic(
  () => import('@/components/modals/askAQuestion/AskAQuestionModal')
)

const BusinessHoursModal = dynamic(
  () => import('@/components/modals/BusinessHoursModal')
)

const AddClientProfileInfo = dynamic(
  () => import('@/components/modals/AddClientProfileInfo')
)

export const ModalsContainer = () => {
  const currentModal = useAppSelector((state) => state.modals.currentModal)

  return (
    <>
      <ModalRender />
      {currentModal === MODALS_TYPE.SIGN_IN && <SignIn />}
      {currentModal === MODALS_TYPE.SIGN_UP && <SignUp />}

      {/*<TemplateFormModal />*/}
      {currentModal === MODALS_TYPE.BUSINESS_HOURS && <BusinessHoursModal />}
      {currentModal === MODALS_TYPE.CLIENT_ADD_PROFILE_INFO && (
        <AddClientProfileInfo />
      )}
      <EmailExistsModal />
      {currentModal === MODALS_TYPE.USER_PROFILE_ASK_A_QUESTION && (
        <AskAQuestionModal />
      )}

      {currentModal === MODALS_TYPE.VIEW_PROFILE_IMAGE_MODAL && (
        <ProfileImageModal />
      )}

      {currentModal === MODALS_TYPE.MESSAGE_PRO_MODAL && <MessageProModal />}
    </>
  )
}

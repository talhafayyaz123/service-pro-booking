import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useMemo } from 'react'

import { ITab, Stepper } from '@/components/common/steppers/Stepper'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { ForYou } from '@/features/inspiration/tabs/forYou/ForYou'
import { InspireFollowing } from '@/features/inspiration/tabs/InspireFollowing'

export const InspirationContent = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  const session = useSession()
  const role = session.data?.user.role
  const tabs: ITab[] = useMemo(() => {
    return [
      {
        label: t('tabs.for_you'),
        content: <ForYou />,
        id: 'for_you',
      },
      {
        label: t('tabs.following'),
        content: <InspireFollowing />,
        id: 'following',
      },
    ]
  }, [t])

  return (
    <div className="container relative mt-6 small:mt-[60px]">
      <Stepper
        fullRender={false}
        className={''}
        tabs={role ? tabs : tabs.filter((el) => el.id !== 'following')}
      />
    </div>
  )
}

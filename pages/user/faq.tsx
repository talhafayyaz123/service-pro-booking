import { useRouter } from 'next/router'

import { Faq } from '@/features/userProfile/components/accountSettings/steps/faq/Faq'
import { TRole } from '@/types/common'

const FaqPage = () => {
  const router = useRouter()

  const role = router.query.role as TRole
  return (
    <div id="app_layout" className="flex flex-col justify-between">
      <div className="grid flex-1 h-full pb-10 overflow-auto">
        <Faq role={role} />
      </div>
    </div>
  )
}

export default FaqPage

import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { getQueriesForSearchRedirect } from '@/features/search/helpers/localLocation'
import { useSearchStore } from '@/features/search/hooks/useSearchStore'

import { Button } from './Button'

export const SearchNearbyButton = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  const router = useRouter()
  const canFetch = useSearchStore((state) => state.canFetch)

  const onNearbyClick = () => {
    const query = getQueriesForSearchRedirect()
    canFetch.current = false
    router.push({
      pathname: ROUTES.search,
      query: { ...query, extendBox: 'true' },
    })
  }
  return (
    <Button onClick={onNearbyClick} buttonType={'3d'} className="w-min">
      {t('buttons.search_nearby')}
    </Button>
  )
}

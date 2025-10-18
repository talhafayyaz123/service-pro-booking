import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { useAppSelector } from '@/hooks/hooks'

export const useIsPreviewProfile = (proId?: string) => {
  const {
    query: { proId: slug },
  } = useRouter()
  const meSlug = useAppSelector((state) => state.me.me.pro?.slug)

  return useMemo(() => slug === (proId ? proId : meSlug), [meSlug, proId, slug])
}

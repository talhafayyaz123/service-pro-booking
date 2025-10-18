import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { useEffect } from 'react'

import { Favorites } from '@/features/favorites/Favorites'
import { IProInfo } from '@/features/profile/profileType'
import { getFavoritesServerSide } from '@/features/userProfile/store/userProfileRequests'
import { updateMeSlice } from '@/features/userProfile/store/userProfileSlice'
import { useAppDispatch } from '@/hooks/hooks'
import { useRedirectProToUserPage } from '@/hooks/useRedirectProToUserPage'
import BaseLayout from '@/layouts/BaseLayout'
import { MainLayout } from '@/layouts/MainLayout'

const ClientFavoritesPage = ({
  favorites,
}: {
  favorites: { data: IProInfo[]; total: number }
}) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      updateMeSlice({
        favorites: {
          data: favorites?.data || [],
          total: favorites?.total || 1,
          status: false,
          page: 1,
        },
      })
    )
  }, [dispatch, favorites])

  useRedirectProToUserPage()

  return (
    <BaseLayout seoTitle={'Favorites'} seoDescription={'123'}>
      <MainLayout>
        <Favorites />
      </MainLayout>
    </BaseLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  const token = await getToken(ctx)

  const favorites = await getFavoritesServerSide({
    token: token?.accessToken || '',
  })

  if (!session?.user || session.user.role === 'PRO') {
    return {
      notFound: true,
      props: {},
    }
  }

  return {
    props: {
      favorites,
    },
  }
}

export default ClientFavoritesPage

import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { signIn, signOut } from 'next-auth/react'
import { useEffect } from 'react'

import { refreshToken } from '@/api/auth/refreshToken'
import { getUserInfo } from '@/api/user/getUserInfo'
import { ROUTES } from '@/core/consts/routes'
import { handleSignOut } from '@/core/helpers/handleSignOut'
import { LoginResponse } from '@/features/userProfile/types'

interface Props {
  error?: string
  user?: LoginResponse
}

const MobileLoginPage: NextPage<Props> = ({ user, error }) => {
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.replace('/')
    }
    const authorizeUser = async () => {
      await signOut({
        redirect: false,
      })
      await signIn('credentials', {
        redirect: false,
        user: JSON.stringify(user),
      })
      router.replace(ROUTES.upgradeSubscription)

      // helper function that consists of all functions that are should be called while signing out
      handleSignOut()
    }

    authorizeUser()
  }, [user, router])

  return <>{error ? <p>{error}</p> : null}</>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const _refreshToken = ctx.query.token as string
  const id = ctx.query.tokenId as string

  if (!_refreshToken) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  try {
    const tokens = await refreshToken({ token: _refreshToken, id })
    const user = await getUserInfo(tokens.accessToken)
    const _user: LoginResponse = {
      name: '',
      birthday: '',
      country: user.country,
      phoneCode: user.phoneCode || null,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      phone: user.phone,
      proId: user.pro?.id || null,
      role: user.role,
      accessToken: {
        token: tokens.accessToken,
        expiresIn: tokens.accessTokenExp,
      },
      refreshToken: {
        token: tokens.refreshToken,
        id: tokens.refreshTokenId,
      },
    }

    return {
      props: {
        user: _user,
      },
    }
  } catch (err) {
    //eslint-disable-next-line
    console.log('mobile_login.ts file err:', err)
  }

  return {
    props: {
      error: 'Something went wrong, please try again',
    },
  }
}

export default MobileLoginPage

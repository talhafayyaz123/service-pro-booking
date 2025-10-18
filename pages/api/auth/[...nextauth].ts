import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import AppleProvider from 'next-auth/providers/apple'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import { parseCookies } from 'nookies'

import { loginWithCredentials } from '@/api/auth/loginWithCredentials'
import { loginWithSocial } from '@/api/auth/loginWithSocial'
import { refreshToken } from '@/api/auth/refreshToken'
import { TRole } from '@/types/common'

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookies({ req })
  const role = cookies.role
  const fromPage =
    cookies.fromPage && cookies.fromPage !== '/' ? cookies.fromPage : ''
  const refToken = cookies.refToken

  return await NextAuth(req, res, {
    cookies: {
      callbackUrl: {
        name: `__Secure-next-auth.callback-url`,
        options: {
          httpOnly: false,
          sameSite: 'none',
          path: '/',
          secure: true,
        },
      },
    },
    providers: [
      AppleProvider({
        authorization: {
          params: {
            scope: 'name email',
            response_mode: 'form_post',
            response_type: 'code',
          },
        },
        clientSecret: process.env.APPLE_CLIENT_SECRET as string,
        clientId: process.env.APPLE_CLIENT_ID as string,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
      FacebookProvider({
        clientId: process.env.FACEBOOK_CLIENT_ID as string,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
        authorization: {
          url: 'https://www.facebook.com/v11.0/dialog/oauth',
          params: {
            client_id: process.env.FACEBOOK_CLIENT_ID,
            scope: 'openid email public_profile',
            response_type: 'code',
          },
        },
        token: {
          url: 'https://graph.facebook.com/oauth/access_token',
          async request(context) {
            //eslint-disable-next-line
            // @ts-ignore
            const response = await axios.get(this.url, {
              params: {
                code: context.params.code,
                client_id: context.provider.clientId,
                redirect_uri: context.provider.callbackUrl,
                client_secret: context.provider.clientSecret,
              },
            })

            const tokens = response.data
            return { tokens }
          },
        },
        idToken: true,
      }),
      CredentialsProvider({
        name: 'readyhubb',
        credentials: {
          email: {
            label: 'email',
            type: 'email',
            placeholder: 'test@gmail.com',
          },
          password: { label: 'Password', type: 'password' },
          user: {},
          role: {
            label: 'role',
            type: 'string',
          },
        },
        async authorize(credentials) {
          if (
            (!credentials?.password || !credentials.email) &&
            !credentials?.user
          ) {
            return null
          }

          if (credentials?.user) {
            return JSON.parse(credentials.user)
          }

          const body = {
            email: credentials.email,
            password: credentials.password,
            role: credentials.role as TRole,
          }

          try {
            const { res, status } = await loginWithCredentials(body)

            if (status) {
              return res
            }
          } catch (err) {
            throw new Error(JSON.stringify(err))
          }
        },
      }),
    ],
    callbacks: {
      async signIn({ user, account, profile }: any) {
        //eslint-disable-next-line
        console.log(
          '[nextAuth].ts file log:',
          user,
          'USER',
          '\n',
          account,
          'ACCOUNT',
          profile,
          'PROFILE',
          '\n'
        )

        try {
          if (account && account.provider !== 'credentials') {
            const body: any = {
              email: user.email as string,
              id: user.id as string,
              name: (user.name === 'null null'
                ? ''
                : user.name?.trim() || '') as string,
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              socialNetwork: account.provider.toUpperCase(),
              token: (account.id_token || account.access_token) as string,
              signupSource: 'WEB',
            }

            if (role) {
              body.role = role
            }

            if (refToken) {
              body.refToken = refToken
            }
            if (account.provider === 'facebook') {
              body.token = account.access_token as string
            }
            const res = await loginWithSocial(body)

            user.name = `${res.firstName || ''} ${res.lastName || ''}`
            user.firstName = res.firstName || ''
            user.lastName = res.lastName || ''
            user.accessToken = res.accessToken
            user.refreshToken = res.refreshToken
            user.role = res.role
            user.phone = res.phone || ''
            user.phoneCode = res.phoneCode || ''
            user.isVerified = res.isVerified
          }
        } catch (err: any) {
          //eslint-disable-next-line
          console.log('[nextAuth].ts file err:', err)
          const message = err?.response.data.email || 'Unknown Error'

          const _ = fromPage?.split('?')
          const url = _[0]
          const queries = _.length > 1 ? _[1] : ''
          const finalUrl = `${url}?${
            queries
              ? `${queries}&auth_error=${message}`
              : `auth_error=${message}`
          }`

          return finalUrl
        }

        return true
      },
      // eslint-disable-next-line
      // @ts-ignore
      jwt: async ({ user, token, account }) => {
        if (account && user) {
          const { accessToken, refreshToken } = user as any
          const decodedToken = jwt_decode(accessToken.token || accessToken)
          return {
            ...user,
            accessTokenExp: (decodedToken as any).exp,
            accessToken: accessToken.token,
            refreshToken: refreshToken.token,
            refreshTokenId: refreshToken.id,
          }
        }

        if (Date.now() < token.accessTokenExp * 1000) {
          return token
        }

        try {
          const newTokens = await refreshToken(
            {
              id: token.refreshTokenId,
              token: token.refreshToken,
            },
            token.accessToken
          )

          return {
            ...token,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            accessTokenExp: newTokens.accessTokenExp,
            refreshTokenId: newTokens.refreshTokenId,
          }
        } catch {
          return {
            ...token,
            error: 'refresh_error',
          }
        }
      },
      session: ({ session, token }) => {
        if (session.user && token) {
          session.error = token.error || ''
          session.user.accessToken = token.accessToken
          session.user.refreshToken = token.refreshToken
          session.user.refreshTokenId = token.refreshTokenId
          session.user.role = token.role
          session.user.phone = token.phone || ''
          session.user.phoneCode = token.phoneCode || ''
          session.user.isVerified = token.isVerified
          session.user.name =
            (token.firstName || '') + ' ' + (token.lastName || '')
          session.user.firstName = token.firstName
          session.user.lastName = token.lastName
        }
        return session
      },
    },
    debug: true,
    pages: {
      signIn: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
  })
}

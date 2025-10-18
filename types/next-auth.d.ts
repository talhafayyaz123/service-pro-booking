/* eslint-disable */
import NextAuth, { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import { TRole } from './common'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      accessToken: string
      refreshToken: string
      refreshTokenId: string
      role: TRole
      firstName: string
      lastName: string
      phone?: string
      phoneCode?: string
      isVerified: boolean
    } & DefaultSession['user']
    error?: string
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    accessToken: string
    refreshToken: string
    refreshTokenId: string
    firstName: string
    lastName: string
    role: TRole
    phone?: string
    phoneCode?: string
    isVerified: boolean
    accessTokenExp: number
    error?: string
  }
}

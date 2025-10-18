import { signOut } from 'next-auth/react'
import { useEffect } from 'react'

import { handleSignOut } from '@/core/helpers/handleSignOut'

const SignOut = () => {
  useEffect(() => {
    signOut({
      redirect: true,
      callbackUrl: '/',
    })

    // helper function that consists of all functions that are should be called while signing out
    handleSignOut()
  }, [])

  return <>Signing out...</>
}

export default SignOut

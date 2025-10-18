import Link from 'next/link'

import { FormInput } from '@/components/common/FormInput'
import { H16 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'

export const BookingLoginForm = () => {
  return (
    <>
      <H16 color="text-black" className="!font-bold">
        Log in to confirm your booking
      </H16>

      <FormInput
        name="password"
        placeholder="Enter your password"
        label="Password*"
        autoComplete="new-password"
        type="password"
        className="w-full"
      />

      <H16 className="ml-auto -mt-4">
        <Link href={ROUTES.forgotPassword}>
          <a className="text-gray">Forgot password?</a>
        </Link>
      </H16>
    </>
  )
}

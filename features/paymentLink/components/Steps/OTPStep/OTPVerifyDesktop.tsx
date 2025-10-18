import React from 'react'

import { Button } from '@/components/common/buttons/Button'
import { H16, H32 } from '@/components/typography'
import { OTPVerify } from '@/features/paymentLink/components/Steps/OTPStep/component/OTPVerify'
import { useOTPVerifyInfo } from '@/features/paymentLink/components/Steps/OTPStep/useOTPVerifyInfo'

export const OTPVerifyDesktop = () => {
  const {
    handleVerify,
    onBack,
    errorMessage,
    handleRequestVerifyCode,
    phoneSecret,
    isLoading,
    resendCount,
  } = useOTPVerifyInfo()

  return (
    <div className={'bg-white rounded-2xl mx-2 my-4'}>
      <OTPVerify
        showTimer={resendCount.current <= 2}
        error={errorMessage}
        resendVerifyCode={handleRequestVerifyCode}
        title={
          <H32 className="!font-semibold !text-center block">
            OTP Verification
          </H32>
        }
        subtitle={
          <article className={'text-center mt-2'}>
            <H16 color="text-gray">
              We have sent you one time password to
              <br />
              <span className={'text-black'}>{phoneSecret}</span>
            </H16>
          </article>
        }
        footer={(verifyCode) => (
          <div className={'flex flex-col gap-4 mt-8'}>
            <Button
              disabled={verifyCode.length !== 4}
              onClick={() => handleVerify(verifyCode)}
              buttonType={'orange'}
              isLoading={isLoading}
            >
              Verify
            </Button>
            <Button className="mt-2" onClick={onBack} buttonType="text">
              Go back
            </Button>
          </div>
        )}
      />
    </div>
  )
}

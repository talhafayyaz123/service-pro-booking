import React, { memo } from 'react'

import { IconLeftSmile } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { LogoButtonSubdomain } from '@/components/common/buttons/LogoButton'
import { H16, H24 } from '@/components/typography'
import { OTPVerify } from '@/features/paymentLink/components/Steps/OTPStep/component/OTPVerify'
import { useOTPVerifyInfo } from '@/features/paymentLink/components/Steps/OTPStep/useOTPVerifyInfo'

export const OTPVerifyMobile = memo(() => {
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
    <section className={'h-screen laptop:hidden flex flex-col'} id="app_layout">
      <header className="flex-none flex justify-between py-4 px-5 bg-white">
        <button
          onClick={onBack}
          className="rounded-full shadow-xl w-10 h-10 flex items-center justify-center"
        >
          <div className={'p-[3px] small:mt-[-2px]'}>
            <IconLeftSmile className={''} />
          </div>
        </button>
        <LogoButtonSubdomain className="mr-[13px]" />
        <div className={'w-10'} />
      </header>
      <div className={'bg-violet h-full'}>
        <div className={'bg-white m-6 rounded-2xl'}>
          <OTPVerify
            showTimer={resendCount.current <= 2}
            error={errorMessage}
            resendVerifyCode={handleRequestVerifyCode}
            title={
              <H24 className="!font-semibold !text-center block">
                OTP Verification
              </H24>
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
      </div>
    </section>
  )
})

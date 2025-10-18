import classNames from 'classnames'
import React, { ReactNode, useEffect, useRef, useState } from 'react'

import { BaseLink } from '@/components/common/links/BaseLink'
import { ErrorMessage, H16 } from '@/components/typography'
import { OTP_TIMEFRAME } from '@/core/consts/common'
import { useOTPSeconds } from '@/hooks/useOTPSeconds'

export const OTPVerify = ({
  title = <></>,
  subtitle = '',
  showTimer = true,
  resendVerifyCode,
  footer,
  error,
}: {
  title: ReactNode
  subtitle: ReactNode
  showTimer: boolean
  resendVerifyCode: (otp: string) => void
  footer: (otp: string) => ReactNode
  error?: string
}) => {
  const [otp, setOtp] = useState(['', '', '', ''])
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [isAvailable, setIsAvailable] = useState(true)
  const { seconds, setSeconds, otpText } = useOTPSeconds()

  const inputRefs: React.MutableRefObject<HTMLInputElement | null>[] = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value

    if (value.length === 1 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus()
      setFocusedIndex(index + 1)
    }

    const newOtp = [...otp]

    newOtp[index] = value.charAt(0)
    setOtp(newOtp)
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs?.[index - 1]?.current?.focus()
      setFocusedIndex(index - 1)
    }
  }

  useEffect(() => {
    inputRefs[0].current?.focus()
    setIsAvailable(false)
    setSeconds(OTP_TIMEFRAME)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (showTimer) {
      if ((seconds || 0) > 0) {
        const timer = setTimeout(() => setSeconds((seconds || 0) - 1), 1000)
        return () => clearTimeout(timer)
      } else if (seconds === 0 && !isAvailable) {
        setIsAvailable(true)
      }
    }
  }, [seconds, isAvailable, showTimer, setSeconds])

  return (
    <div className={'p-4'}>
      {title}
      {subtitle}
      {showTimer && (
        <H16
          data-testid={'otp-timer'}
          className={'mt-1 text-center'}
          color={'text-orange'}
        >
          {isAvailable ? 'Please resend the code' : otpText}
        </H16>
      )}

      <div className={'flex gap-3 tablet:gap-6 mx-auto w-fit mt-8'}>
        {inputRefs.map((ref, index) => (
          <input
            key={index}
            type="number"
            max={1}
            data-testid={`otp-input-index-${index + 1}`}
            ref={ref}
            value={otp[index]}
            onChange={(e) => handleInput(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={classNames(
              'w-16 h-16  text-24 font-bold outline-none border-lightGray transition-all duration-300',
              'rounded-2xl text-center border focus-visible:border-orange',
              { ['!bg-lightGray']: !otp[index] && focusedIndex !== index }
            )}
          />
        ))}
      </div>
      {error && (
        <ErrorMessage className={'px-4 text-center w-full block mt-2'}>
          {error}
        </ErrorMessage>
      )}

      {seconds === 0 && (
        <div className="flex items-center justify-center mt-3">
          <H16 color="text-gray" className="mr-1">
            Didn’t receive the OTP?
          </H16>
          <BaseLink
            type="button"
            onClick={() => {
              resendVerifyCode(otp.join(''))
              setIsAvailable(false)
              setSeconds(OTP_TIMEFRAME)
            }}
            size="200"
            line={false}
            className="!font-normal"
          >
            Resend Code
          </BaseLink>
        </div>
      )}
      {footer?.(otp.join(''))}
    </div>
  )
}

import { useState } from 'react'

export const useOTPSeconds = () => {
  const [seconds, setSeconds] = useState<null | number>(null)

  // Format minutes and seconds
  const displayMinutes = seconds ? Math.floor(seconds / 60) : 0
  const displaySeconds = seconds ? seconds % 60 : 0

  const otpText =
    seconds === 0
      ? 'Please resend the code'
      : `${displayMinutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`

  return {
    seconds,
    setSeconds,
    displayMinutes,
    displaySeconds,
    otpText,
  }
}

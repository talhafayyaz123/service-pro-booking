import { useState } from 'react'

export const useCaptchaError = () => {
  const [captchaError, setCaptchaError] = useState('')

  return { captchaError, setCaptchaError }
}

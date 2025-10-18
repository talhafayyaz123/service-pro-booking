import { IconOtpClient } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { H16, H20 } from '@/components/typography'
import { closeModal } from '@/features/modalsConfig/modalConfig'

export const OTPTroubleModal = () => {
  return (
    <div className="w-full flex flex-col justify-start items-center p-5 tablet:p-10 gap-3">
      <div
        className={
          'bg-yellow flex items-center justify-center rounded-full border-2 border-white shadow-xl p-4'
        }
      >
        <IconOtpClient />
      </div>
      <H20 className="mt-3">Oops! Having trouble with the OTP?</H20>
      <div className="w-full flex flex-col justify-start items-start text-left">
        <H16>Here are a few things to check:</H16>
        <ul className="list-disc pl-4">
          <li>
            <H16>Ensure your phone number is correct.</H16>
          </li>
          <li>
            <H16>
              Ensure you aren't using an internet-based phone number like Google
              Voice.
            </H16>
          </li>
          <li>
            <H16>Check your network connection</H16>
          </li>
        </ul>
        <H16>
          Still no luck? Reach out to{' '}
          <a href="mailto:hello@readyhubb.com" className="underline">
            hello@readyhubb.com
          </a>{' '}
          for help.
        </H16>
      </div>
      <Button
        className="w-full mt-6 small:mt-8"
        type="button"
        size="200"
        buttonType="orange"
        onClick={closeModal}
      >
        Close
      </Button>
    </div>
  )
}

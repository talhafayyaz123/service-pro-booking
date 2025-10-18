import { memo, ReactNode, useEffect } from 'react'

import { IconCalendar, IconChatBubble, IconLock } from '@/assets/icons/icons'
import { FormPhoneDropdown } from '@/components/common/dropdown/phoneDropdown/FormPhoneDropdown'
import { FormInput } from '@/components/common/FormInput'
import { H16 } from '@/components/typography'
import { cn } from '@/core/helpers/cn'
import { usePasswordObserver } from '@/features/booking/BookingFooter'
import { useAppSelector } from '@/hooks/hooks'

export const BookingRegister = memo(() => {
  useEffect(() => {
    return () => {
      usePasswordObserver.getState().setStore({ isShowPolicy: false })
    }
  }, [])

  const proName = useAppSelector((state) => state.profile.iProInfo.data.name)

  return (
    <>
      <div className="flex flex-row w-full gap-4">
        <FormInput
          name="firstName"
          placeholder="first name"
          label="First name*"
          autoComplete="new-password"
          type="text"
          className="w-full"
        />
        <FormInput
          name="lastName"
          placeholder="last name"
          label="Last name*"
          autoComplete="new-password"
          type="text"
          className="w-full"
        />
      </div>
      <FormPhoneDropdown
        required
        label="Mobile number*"
        className="w-full !bottom-5"
      />
      <div className="flex flex-col items-center justify-center w-full h-full gap-6 p-5 shadow-xl rounded-xl">
        <H16 className="!font-bold">Create an account</H16>
        <FormInput
          name="password"
          placeholder="Enter your password"
          label="Password*"
          autoComplete="new-password"
          type="password"
          className="w-full"
          sideEffect={(e) => {
            usePasswordObserver
              .getState()
              .setStore({ isShowPolicy: !!e?.target?.value })
          }}
        />
        <div className="flex flex-col items-start justify-start w-full gap-4">
          {featureIcons.map((item, i) => (
            <section
              key={i}
              className="flex flex-row items-center justify-start w-full gap-4"
            >
              <span
                className={cn(
                  'shadow-xl p-[11px] rounded-full border-2 border-white',
                  item.class
                )}
              >
                <item.Icon className="w-5 h-5" />
              </span>
              <H16 className="w-full text-left text-wrap">
                {item.title(proName)}
              </H16>
            </section>
          ))}
        </div>
      </div>
    </>
  )
})

export const featureIcons = [
  {
    Icon: IconChatBubble,
    title: (name?: ReactNode) => (
      <>Chat with {name} directly from the Readyhubb app</>
    ),
    class: 'bg-[#B6BECE4D] drop-shadow-xl',
  },
  {
    Icon: IconCalendar,
    title: () =>
      `Manage your bookings and stay updated with the latest promotions`,
    class: 'bg-lightMain',
  },
  {
    Icon: IconLock,
    title: () => `Make secure payments`,
    class: 'bg-[#F5D4A4]',
  },
]

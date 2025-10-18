import { FormEvent, ReactNode } from 'react'

import { H16, H32 } from '@/components/typography'

interface Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children: ReactNode
  title: string
  description?: string
}

export const ForgotPasswordWrapper = ({
  onSubmit,
  title,
  description,
  children,
}: Props) => {
  return (
    <div className="small:mt-14 mt-6 small:mx-0 mx-6 flex justify-center">
      <form
        onSubmit={onSubmit}
        className="rounded-xl bg-white flex flex-col items-center justify-center small:p-8 p-4 max-w-[592px] w-full"
      >
        <H32 className="!font-bold mb-2">{title}</H32>
        {description ? (
          <H16 className="text-center !font-normal" color="text-gray">
            {description}
          </H16>
        ) : null}
        {children}
      </form>
    </div>
  )
}

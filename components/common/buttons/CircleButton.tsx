import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

import { IconLeftSmile } from '@/assets/icons/icons'
type ICircleButton = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>
export const CircleButton = (props: ICircleButton) => {
  return (
    <button
      {...props}
      className={`bg-white shadow-xl  flex  items-center h-10 w-10 justify-center p-2 transition rounded-full ${
        props.className
      } ${
        props.disabled
          ? 'opacity-50 cursor-no-drop'
          : 'cursor-pointer hover:!bg-lightGray'
      }`}
    >
      <IconLeftSmile className={''} />
    </button>
  )
}

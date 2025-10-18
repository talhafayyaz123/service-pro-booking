import { TippyProps } from '@tippy.js/react'
import { useRef } from 'react'
import { Instance, sticky } from 'tippy.js'

interface Props {
  trigger?: (o: boolean) => void
  options?: Partial<TippyProps>
}

export const useTippy = ({ options, trigger }: Props = {}) => {
  const tippyInstance = useRef<Instance | null>(null)

  const tippyProps: Partial<TippyProps> = {
    animation: 'scale',
    arrow: true,
    interactive: true,
    trigger: 'manual',
    interactiveBorder: 10,
    delay: [0, 0],
    duration: [200, 150],
    appendTo: typeof window !== 'undefined' ? window?.document?.body : 'parent',
    sticky: true,
    plugins: [sticky],
    boundary: 'window',
    theme: 'light',
    distance: 240,
    inertia: true,
    onCreate: (instance) => {
      tippyInstance.current = instance
    },
    onHidden: () => {
      if (trigger) {
        trigger(false)
      }
    },
    onShow: () => {
      if (trigger) {
        trigger(true)
      }
    },
    placement: 'bottom-end',
  }

  const onShow = () => {
    tippyInstance.current?.show()
  }
  const onHide = () => {
    tippyInstance.current?.hide()
  }

  return {
    onShow,
    onHide,
    tippyProps: { ...tippyProps, ...options },
  }
}

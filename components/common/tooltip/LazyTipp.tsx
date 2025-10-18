import Tippy, { TippyProps } from '@tippyjs/react/headless'
import { useState } from 'react'

export const LazyTippy = ({
  lazy = true,
  ...props
}: TippyProps & { lazy?: boolean }) => {
  const [mounted, setMounted] = useState(false)

  const lazyPlugin = {
    fn: () => ({
      onMount: () => (lazy ? setMounted(true) : undefined),
      onHidden: () => (lazy ? setMounted(false) : undefined),
    }),
  }

  const computedProps = { ...props }

  computedProps.plugins = [lazyPlugin, ...(props.plugins || [])]

  if (props.render) {
    const render = props.render
    computedProps.render = (...args) => (mounted ? render(...args) : '')
  } else {
    computedProps.content = mounted ? props.content : ''
  }

  return <Tippy {...computedProps} />
}

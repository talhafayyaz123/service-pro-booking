import {
  createRef,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { RadioWithLabel } from '@/components/common/Radio'
import { isFullVisibility } from '@/core/helpers/viewingWindow'

export interface ITab {
  label: ReactNode
  sideEffect?: (id: string) => void
  content: ReactNode
  id: string
  disableClick?: boolean
  currentRef?: RefObject<HTMLDivElement>
}

interface IStepper {
  tabs: ITab[]
  initialTabId?: string
  className?: string
  stickyTop?: string
  title?: ReactNode
  scrollAfterClick?: boolean
  showRadio?: boolean
  wrapperClassName?: string
  tabClassName?: string
}

export const SideStepper = ({
  tabs,
  initialTabId,
  title,
  stickyTop = 'top-0',
  className,
  scrollAfterClick,
  wrapperClassName,
  tabClassName,
  showRadio = true,
}: IStepper) => {
  const ref = useRef<HTMLDivElement>(null)
  const data: Record<string, ITab> = useMemo(
    () =>
      tabs.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: { ...item, currentRef: createRef<HTMLDivElement>() },
        }),
        {}
      ),
    [tabs]
  )
  const [currentTab, setCurrentTab] = useState(initialTabId || tabs[0].id)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    initialTabId && setCurrentTab(initialTabId)
  }, [initialTabId])

  useEffect(() => {
    document.addEventListener(
      'scroll',
      () => setVisible(isFullVisibility(ref)),
      true
    )
    return document.removeEventListener(
      'scroll',
      () => setVisible(isFullVisibility(ref)),
      true
    )
  }, [])
  return (
    <div
      className={` ${
        wrapperClassName ?? 'grid grid-cols-[400px_1fr] gap-[150px]'
      }`}
    >
      <div
        className={`grid grid-cols-1  mb-auto sticky self-start  ${stickyTop}  ${className}`}
      >
        {title}
        {tabs.map(
          ({ label, id, currentRef, sideEffect, disableClick }, index) => {
            const active = id === currentTab
            return (
              <div
                className={`${
                  active ? 'shadow-xl' : ''
                } h-[54px] cursor-pointer px-4 rounded-[12px] transition duration-300  items-center flex flex-1  min-w-full ${tabClassName}`}
                role={'tab'}
                onClick={() => {
                  !disableClick && setCurrentTab(id)
                  sideEffect && sideEffect(id)
                  scrollAfterClick &&
                    !visible &&
                    ref.current?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                }}
                key={id + index}
                ref={currentRef}
              >
                {showRadio ? (
                  <RadioWithLabel
                    wrapperClassName={'w-full h-full items-center'}
                    rightLabel
                    key={index + id}
                    label={label}
                    checked={active}
                  />
                ) : (
                  label
                )}
              </div>
            )
          }
        )}
      </div>
      <div ref={ref}>
        {Object.values(data).map((el, index) => (
          <div
            className={`${el.id === currentTab ? '' : 'hidden'}`}
            key={index + el.id}
          >
            {el.content}
          </div>
        ))}
      </div>
    </div>
  )
}

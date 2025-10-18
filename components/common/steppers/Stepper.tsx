import {
  createRef,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { H16 } from '@/components/typography'

export interface ITab {
  label: ReactNode
  labelClassName?: string
  lineClassName?: string
  sideEffect?: (id: string) => void
  content?: ReactNode
  id: string
  currentRef?: RefObject<HTMLDivElement>
}

interface IStepper {
  tabs: (ITab | null)[]
  fullWidthLine?: boolean
  initialTabId?: string
  stepsClassName?: string
  contentWrapperClassName?: string
  fullRender?: boolean
  labelClassName?: string
  wrapperClassName?: string
  className?: string
  contentTop?: ReactNode
  currentTab?: string
  stepChangeEffect?: (id?: string) => void
  lineClassName?: string
}

export const Stepper = ({
  tabs,
  initialTabId,
  fullRender = true,
  stepsClassName,
  contentWrapperClassName,
  labelClassName,
  stepChangeEffect,
  currentTab,
  className,
  contentTop,
  wrapperClassName,
  lineClassName,
}: IStepper) => {
  const unEmptyTabs = useMemo(
    () => tabs.filter((el) => el !== null) || [],
    [tabs]
  ) as ITab[]

  const data: Record<string, ITab> = useMemo(
    () =>
      unEmptyTabs.reduce(
        (acc, item) => ({
          ...acc,
          [item.id]: { ...item, currentRef: createRef<HTMLDivElement>() },
        }),
        {}
      ),
    [unEmptyTabs]
  )
  const [currentTabInside, setCurrentTabInside] = useState(
    initialTabId || unEmptyTabs[0].id
  )

  useEffect(() => {
    initialTabId && setCurrentTabInside(initialTabId)
  }, [initialTabId])

  return (
    <div className={`${className}`}>
      <div className={` ${wrapperClassName}`}>{contentTop}</div>

      <div
        className={`${contentWrapperClassName} bg-white pt-1 mt-4 rounded-t-[20px] shadow-[0px_4px_27px_0px_rgba(182,190,206,0.30)]`}
      >
        <>
          <div
            className={`flex gap-[20px] tablet:gap-[24px] relative mb-5 ${stepsClassName}`}
          >
            <div className={'w-full bottom-[1px] bg-lightGray z-0 absolute'} />
            {unEmptyTabs.map(
              ({ label, id, currentRef, sideEffect, ...rest }) => {
                const active = id === (currentTab ?? currentTabInside)
                return (
                  <div
                    ref={currentRef}
                    role={'button'}
                    onClick={() => {
                      setCurrentTabInside(id)
                      stepChangeEffect && stepChangeEffect(id)
                      sideEffect && sideEffect(id)
                    }}
                    key={id}
                    className={'flex flex-col cursor-pointer z-10'}
                  >
                    <H16
                      className={`transition   ${
                        active
                          ? '!text-orange'
                          : '!text-gray hover:!text-orange'
                      } ${labelClassName} ${rest?.labelClassName || ''}`}
                    >
                      {label}
                    </H16>
                    {active && (
                      <div
                        className={`w-[24px] tablet:w-[29px] bg-orange h-[2px] rounded-[2px] ${lineClassName} ${
                          rest?.lineClassName || ''
                        }`}
                      />
                    )}
                  </div>
                )
              }
            )}
          </div>

          {fullRender
            ? Object.values(data).map((el) => (
                <div
                  className={`${
                    el.id === (currentTab ?? currentTabInside) ? '' : 'hidden'
                  }`}
                  key={el.id}
                >
                  {el?.content}
                </div>
              ))
            : data[currentTab ?? currentTabInside]?.content}
        </>
      </div>
    </div>
  )
}

import { Switch } from '@headlessui/react'
import classNames from 'classnames'

export const Switcher = ({
  checked = false,
  setChecked,
}: {
  checked?: boolean
  setChecked?: (checked: boolean) => void
}) => {
  return (
    <div className={'h-6 flex h-fit w-fit items-center'}>
      <Switch
        checked={checked}
        onChange={(checked) => setChecked && setChecked(checked)}
        className={`bg-orange ml-1.5 relative inline-flex h-4 w-11 items-center rounded-full`}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${
            checked ? 'translate-x-6' : 'translate-x-[-6px]'
          } inline-block h-6 w-6 transform rounded-full bg-white transition shadow-switcher`}
        />
      </Switch>
    </div>
  )
}

export const SwitcherXl = ({
  checked = false,
  setChecked,
}: {
  checked?: boolean
  setChecked?: (checked: boolean) => void
}) => {
  return (
    <div className={' flex h-fit w-fit items-center'}>
      <Switch
        checked={checked}
        onChange={(checked) => setChecked && setChecked(checked)}
        className={classNames(
          ' ml-1.5 relative inline-flex h-6 w-10 items-center rounded-full transition',
          { ['bg-orange']: checked },
          { ['bg-lightGray']: !checked }
        )}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={`${
            checked ? 'translate-x-[18px]' : 'translate-x-[2px]'
          } inline-block h-5 w-5 transform rounded-full bg-white transition shadow-switcher`}
        />
      </Switch>
    </div>
  )
}

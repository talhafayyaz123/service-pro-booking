import { Switch } from '@headlessui/react'
import clsx from 'clsx'

export const Toggle = ({
  checked = false,
  setChecked,
}: {
  checked?: boolean
  setChecked?: (checked: boolean) => void
}) => {
  return (
    <div className={'flex h-fit w-fit items-center'}>
      <Switch
        checked={checked}
        onChange={(checked) => setChecked && setChecked(checked)}
        className={clsx(
          'relative inline-flex w-11 items-center rounded-full p-0.5',
          checked ? 'bg-orange' : 'bg-secondary-dark'
        )}
      >
        <span className="sr-only">Enable notifications</span>
        <span
          className={clsx(
            checked ? 'translate-x-4' : 'translate-x-[-0px]',
            'inline-block h-6 w-6 transform rounded-full bg-white transition shadow-switcher'
          )}
        />
      </Switch>
    </div>
  )
}

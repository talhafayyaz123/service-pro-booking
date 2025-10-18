import { memo, useMemo } from 'react'

import { Button } from '@/components/common/buttons/Button'

export const Footer = memo(
  ({
    isLoading,
    disabled,
    onClick,
    watch,
  }: {
    isLoading: boolean
    disabled: boolean
    onClick?: () => void
    watch?: any
  }) => {
    const form = watch

    const isDisabled = useMemo(
      () => !form?.bio || !form?.businessName || !form?.file?.iconUrl,
      [form?.bio, form?.businessName, form?.file?.iconUrl]
    )

    return (
      <footer
        className={
          'flex-none h-[82px] flex mt-auto bg-white maxLaptop:rounded-t-[20px]  items-center justify-end shadow-xl px-3 laptop:px-20'
        }
      >
        <Button
          disabled={disabled || isDisabled}
          isLoading={isLoading}
          form={!onClick ? 'baseInfoForm' : undefined}
          type={onClick ? 'button' : 'submit'}
          buttonType="3d"
          onClick={onClick}
          className="px-10 maxTablet:hidden"
        >
          Save and continue
        </Button>

        <Button
          disabled={disabled || isDisabled}
          isLoading={isLoading}
          form={!onClick ? 'baseInfoForm' : undefined}
          type={onClick ? 'button' : 'submit'}
          buttonType="orange"
          onClick={onClick}
          size="50"
          className="w-full tablet:hidden"
        >
          Save and continue
        </Button>
      </footer>
    )
  }
)

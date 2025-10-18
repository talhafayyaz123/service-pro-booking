import { memo } from 'react'

import { Button } from '@/components/common/buttons/Button'

export const BusinessDetailFooter = memo(
  ({
    isLoading,
    disabled,
    onClick,
  }: {
    isLoading: boolean
    disabled: boolean
    onClick?: () => void
  }) => {
    return (
      <footer
        className={
          'flex-none h-[82px] flex mt-auto bg-white maxLaptop:rounded-t-[20px]  items-center justify-end shadow-xl px-3 laptop:px-20'
        }
      >
        <Button
          disabled={disabled}
          isLoading={isLoading}
          buttonType="3d"
          onClick={onClick}
          className="px-10 maxTablet:hidden"
        >
          Save and continue
        </Button>

        <Button
          disabled={disabled}
          isLoading={isLoading}
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

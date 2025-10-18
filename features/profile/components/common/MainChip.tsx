import { ChipBase, IChipProps } from '@/components/Chip/ChipBase'
import { IProfileInfo } from '@/types/profileInfoTypes'

export const MainChip = ({
  isMobile,
  isInHome,
  isInVenue,
  isVirtual,
  chipProps,
}: IProfileInfo & { chipProps?: Partial<IChipProps> }) => {
  const data = [
    isInHome && 'Home based',
    isInVenue && 'Venue based',
    isMobile && 'Mobile',
    isVirtual && 'Virtual',
  ]
    .filter((el) => el)
    .map((el, index, arr) => {
      if (index === arr.length - 1) {
        return el
      } else {
        return el + ' · '
      }
    })
    .join()
    .replaceAll(',', '')

  return (
    <>
      {(isInHome || isInVenue || isMobile || isVirtual) && (
        <ChipBase
          textClassName={'block !text-black'}
          size={'14'}
          name={data}
          {...chipProps}
        />
      )}
    </>
  )
}

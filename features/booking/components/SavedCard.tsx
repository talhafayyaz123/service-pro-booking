import { Radio } from '@/components/common/Radio'
import { H16 } from '@/components/typography'
import { getCardIconByBrand } from '@/core/helpers/getCardIconByBrand'
import { ISavedCard } from '@/types/payment'

interface Props {
  card?: ISavedCard
  onClick: () => void
  isSelected: boolean
  text?: string
}

export const SavedCard = ({ card, isSelected, onClick, text }: Props) => {
  const classNames = `shadow-xl hover:bg-lightGray/10 transition-colors cursor-pointer justify-between rounded-lg bg-white py-[15px] px-4 flex items-center border ${
    isSelected ? 'border-orange' : 'border-transparent'
  }`
  const icon = getCardIconByBrand(card?.brand)
  return (
    <div role="button" onClick={onClick} className={classNames}>
      {text ? (
        <H16>{text}</H16>
      ) : (
        <div className="flex items-center">
          {icon}
          <H16 className="ml-3">{`****${card?.lastDigits}`}</H16>
        </div>
      )}
      <Radio checked={isSelected} />
    </div>
  )
}

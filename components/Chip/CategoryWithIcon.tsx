import { UserIcon } from '@/components/cardElements/UserIcon'
import { H14 } from '@/components/typography'
import { ICategory } from '@/types/categoriesTypes'

export const CategoryWithIcon = (props: ICategory & { className?: string }) => {
  return (
    <div className={`flex gap-1 ${props?.className}`}>
      <UserIcon iconUrl={props.iconUrl as string} size={'18'} />
      <H14 className={'!mt-[1px] block whitespace-nowrap'}>{props.name}</H14>
    </div>
  )
}

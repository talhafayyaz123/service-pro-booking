import { ChipBase } from '@/components/Chip/ChipBase'

export const CategoryList = ({
  status,
  categories,
}: {
  status?: boolean
  categories?: Array<{
    name: string
    id: string | number
  }>
}) => (
  <div className={'flex flex-wrap gap-2'}>
    {!status
      ? (categories || []).map(({ name, id }) => (
          <ChipBase key={id} textClassName={'block'} size={'14'} name={name} />
        ))
      : [...new Array(4)].map((_, index) => (
          <ChipBase
            key={index}
            textClassName={
              'block w-[80px] h-[18px] bg-lightGray rounded-[12px] animate-pulse'
            }
            size={'14'}
            name={''}
          />
        ))}
  </div>
)

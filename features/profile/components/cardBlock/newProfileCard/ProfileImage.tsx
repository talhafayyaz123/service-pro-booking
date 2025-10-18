import Image from 'next/image'

import { ImgProUser } from '@/assets/images/images'
import { UserIcon } from '@/components/cardElements/UserIcon'

export const ProfileImage = ({
  iconUrl,
  onClick,
}: {
  iconUrl: string
  onClick: () => void
}) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div onClick={onClick}>
    {iconUrl && iconUrl !== 'https://string' ? (
      <div role="button" className="w-max cursor-pointer">
        <UserIcon size={'128'} iconUrl={iconUrl} />
      </div>
    ) : (
      <div
        className={'p-4 bg-[#EDDFFF] rounded-full h-32 w-32 overflow-hidden'}
      >
        <Image alt={'alt pro icon'} src={ImgProUser} />
      </div>
    )}
  </div>
)

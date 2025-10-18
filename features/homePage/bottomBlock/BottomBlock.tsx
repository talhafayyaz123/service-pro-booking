import { DownloadApp } from '@/features/homePage/bottomBlock/DownloadApp'
import { SellServices } from '@/features/homePage/bottomBlock/SellServices'
import { YouGet } from '@/features/homePage/bottomBlock/YouGet'

export const BottomBlock = () => {
  return (
    <div className="pt-10 desktop:pt-[120px]">
      <DownloadApp />
      <YouGet />
      <SellServices />
    </div>
  )
}

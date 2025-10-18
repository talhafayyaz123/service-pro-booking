import { ReactNode } from 'react'

import { MainLayout } from '@/layouts/MainLayout'

interface IWrapperProps {
  children: ReactNode
  isMobile: boolean
}

export const MainLayoutWrapper = ({ isMobile, children }: IWrapperProps) => {
  return isMobile ? (
    <>{children}</>
  ) : (
    <MainLayout id="app_layout">{children}</MainLayout>
  )
}

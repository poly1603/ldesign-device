import { ReactNode } from 'react'
import './ResponsiveLayout.css'

interface Props {
  deviceType: 'mobile' | 'tablet' | 'desktop'
  children: ReactNode
}

export default function ResponsiveLayout({ deviceType, children }: Props) {
  return (
    <div className={`responsive-layout layout-${deviceType}`}>
      {children}
    </div>
  )
}



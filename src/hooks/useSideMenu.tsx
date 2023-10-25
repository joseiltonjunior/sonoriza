import React, { createContext, useContext, useState } from 'react'

interface SideMenuContextData {
  isVisible: boolean
  handleIsVisible(): void
}

const SideMenuContext = createContext<SideMenuContextData>(
  {} as SideMenuContextData,
)

export function SideMenuProvider({ children }: React.PropsWithChildren) {
  const [isVisible, setIsVisible] = useState(false)

  const handleIsVisible = () => {
    setIsVisible(!isVisible)
  }

  return (
    <SideMenuContext.Provider value={{ handleIsVisible, isVisible }}>
      {children}
    </SideMenuContext.Provider>
  )
}

export function useSideMenu(): SideMenuContextData {
  const context = useContext(SideMenuContext)

  if (!context) {
    throw new Error('useSideMenu must be used within an SideMenuProvider')
  }

  return context
}

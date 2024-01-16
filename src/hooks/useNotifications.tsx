import React, { createContext, useContext, useState } from 'react'

interface NotificationsContextData {
  isVisible: boolean
  handleIsVisible(): void
}

const NotificationsContext = createContext<NotificationsContextData>(
  {} as NotificationsContextData,
)

export function NotificationsProvider({ children }: React.PropsWithChildren) {
  const [isVisible, setIsVisible] = useState(false)

  const handleIsVisible = () => {
    setIsVisible(!isVisible)
  }

  return (
    <NotificationsContext.Provider value={{ handleIsVisible, isVisible }}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications(): NotificationsContextData {
  const context = useContext(NotificationsContext)

  if (!context) {
    throw new Error(
      'useNotifications must be used within an NotificationsProvider',
    )
  }

  return context
}

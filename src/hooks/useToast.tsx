import React, { createContext, useContext, useState } from 'react'

interface ToastProps {
  title: string
}

interface ToastStateProps extends ToastProps {
  visible: boolean
}

interface ToastContextData {
  toastState: ToastStateProps
  showToast({ title }: ToastProps): void
  hiddenToast(): void
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData)

export function ToastProvider({ children }: React.PropsWithChildren) {
  const [toastState, setTostState] = useState<ToastStateProps>({
    visible: false,
    title: '',
  })

  const showToast = (payload: ToastStateProps) => {
    setTostState({ ...payload, visible: true })
  }

  const hiddenToast = () => {
    setTostState({ ...toastState, visible: false })
  }

  return (
    <ToastContext.Provider value={{ toastState, showToast, hiddenToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextData {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within an ToastProvider')
  }

  return context
}

"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { useToast as useToastHook } from "@/hooks/use-toast"
import { ToastContainer } from "./toast-container"

const ToastContext = createContext<ReturnType<typeof useToastHook> | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToastHook()

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

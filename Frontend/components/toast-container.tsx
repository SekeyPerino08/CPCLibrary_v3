"use client"

import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from "lucide-react"
import type { Toast } from "@/hooks/use-toast"

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  const getIcon = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-500" />
      case "error":
        return <AlertCircle size={20} className="text-red-500" />
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-500" />
      default:
        return <Info size={20} className="text-blue-500" />
    }
  }

  const getBgColor = (type: Toast["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
      case "error":
        return "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
      case "warning":
        return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800"
      default:
        return "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getBgColor(toast.type)} border rounded-lg p-4 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300`}
        >
          <div className="flex gap-3">
            {getIcon(toast.type)}
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-foreground">{toast.title}</h3>
              {toast.description && <p className="text-xs text-muted-foreground mt-1">{toast.description}</p>}
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

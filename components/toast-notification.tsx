"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

interface ToastProps {
  message: string
  type: "success" | "error" | "info"
  onClose: () => void
  duration?: number
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const bgColor = {
    success: "bg-green-50 border-green-200",
    error: "bg-red-50 border-red-200",
    info: "bg-blue-50 border-blue-200",
  }[type]

  const textColor = {
    success: "text-green-800",
    error: "text-red-800",
    info: "text-blue-800",
  }[type]

  const iconColor = {
    success: "text-green-600",
    error: "text-red-600",
    info: "text-blue-600",
  }[type]

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm border rounded-lg shadow-lg p-4 flex items-start gap-3 z-50 animate-in fade-in slide-in-from-top-2 ${bgColor}`}
    >
      <div className={`flex-1 ${textColor} text-sm font-medium`}>{message}</div>
      <button onClick={onClose} className={`${iconColor} hover:opacity-70 transition-opacity`}>
        <X size={18} />
      </button>
    </div>
  )
}

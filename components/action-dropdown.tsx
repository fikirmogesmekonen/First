"use client"

import { MoreVertical, Check, X, Edit2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import type { ServiceRecord } from "@/lib/download-utils"

interface ActionDropdownProps {
  service: ServiceRecord
  onEnable: (service: ServiceRecord) => void
  onDisable: (service: ServiceRecord) => void
  onUpdate: (service: ServiceRecord) => void
}

export function ActionDropdown({ service, onEnable, onDisable, onUpdate }: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const isActive = service.status === "Active"

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-1 hover:bg-gray-200 rounded transition-colors">
        <MoreVertical size={18} className="text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              if (!isActive) {
                onEnable(service)
              }
              setIsOpen(false)
            }}
            disabled={isActive}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
              isActive
                ? "text-gray-400 cursor-not-allowed bg-gray-50"
                : "text-gray-700 hover:bg-green-50 hover:text-green-700"
            }`}
          >
            <Check size={16} />
            Enable
          </button>
          <button
            onClick={() => {
              if (isActive) {
                onDisable(service)
              }
              setIsOpen(false)
            }}
            disabled={!isActive}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors border-t border-gray-200 ${
              !isActive
                ? "text-gray-400 cursor-not-allowed bg-gray-50"
                : "text-gray-700 hover:bg-red-50 hover:text-red-700"
            }`}
          >
            <X size={16} />
            Disable
          </button>
          <button
            onClick={() => {
              onUpdate(service)
              setIsOpen(false)
            }}
            className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors border-t border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
          >
            <Edit2 size={16} />
            Update
          </button>
        </div>
      )}
    </div>
  )
}

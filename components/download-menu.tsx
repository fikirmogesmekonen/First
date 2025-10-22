"use client"

import { useState, useRef, useEffect } from "react"
import { Download, ChevronDown } from "lucide-react"
import { downloadCSV, downloadPDF } from "@/lib/download-utils"
import type { ServiceRecord } from "@/lib/download-utils"

interface DownloadMenuProps {
  data: ServiceRecord[]
}

export function DownloadMenu({ data }: DownloadMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDownloadCSV = () => {
    downloadCSV(data, `services-${new Date().toISOString().split("T")[0]}.csv`)
    setIsOpen(false)
  }

  const handleDownloadPDF = () => {
    downloadPDF(data, `services-${new Date().toISOString().split("T")[0]}.pdf`)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Download size={18} />
        <span className="text-sm font-medium">Download</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={handleDownloadCSV}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2 border-b border-gray-100"
          >
            <span className="text-sm font-medium text-gray-700">Download as CSV</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <span className="text-sm font-medium text-gray-700">Download as PDF</span>
          </button>
        </div>
      )}
    </div>
  )
}

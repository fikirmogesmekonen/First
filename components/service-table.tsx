"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { ActionDropdown } from "./action-dropdown"
import type { ServiceRecord } from "@/lib/download-utils"

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700"
    case "Exp_soon":
      return "bg-yellow-100 text-yellow-700"
    case "Expired":
      return "bg-red-100 text-red-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "Exp_soon":
      return "Exp_soon"
    default:
      return status
  }
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return dateString
  }
}

interface ServiceTableProps {
  data?: ServiceRecord[]
  onEnable?: (service: ServiceRecord) => void
  onDisable?: (service: ServiceRecord) => void
  onUpdate?: (service: ServiceRecord) => void
}

export function ServiceTable({ data = [], onEnable, onDisable, onUpdate }: ServiceTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  const tableData = data.length > 0 ? data : []

  const totalPages = Math.ceil(tableData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = tableData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ser_No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Ref No</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">employee</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">package_name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ser_number</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">vendor</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expires</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.refNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.employee}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.packageName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.serNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.vendor}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        row.status,
                      )}`}
                    >
                      {getStatusLabel(row.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(row.expires)}</td>
                  <td className="px-6 py-4 text-sm">
                    <ActionDropdown
                      service={row}
                      onEnable={onEnable || (() => {})}
                      onDisable={onDisable || (() => {})}
                      onUpdate={onUpdate || (() => {})}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                  No services found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show result</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                page === currentPage ? "bg-teal-500 text-white" : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
          {totalPages > 5 && <span className="text-gray-600">...</span>}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}

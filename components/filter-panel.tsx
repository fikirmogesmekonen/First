"use client"

import { useState } from "react"
import { X, ChevronDown, Search } from "lucide-react"
import type { ServiceRecord } from "@/lib/download-utils"

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  onApplyFilters: (filters: FilterState) => void
  data: ServiceRecord[]
}

export interface FilterState {
  employee: string[]
  type: string[]
  vendor: string[]
  status: string[]
  packageName: string[]
  dateFrom: string
  dateTo: string
  serNumber: string
  refNo: string
}

export function FilterPanel({ isOpen, onClose, onApplyFilters, data }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    employee: [],
    type: [],
    vendor: [],
    status: [],
    packageName: [],
    dateFrom: "",
    dateTo: "",
    serNumber: "",
    refNo: "",
  })

  const [searchTerms, setSearchTerms] = useState({
    employee: "",
    type: "",
    vendor: "",
    packageName: "",
  })

  const [expandedSections, setExpandedSections] = useState({
    employee: true,
    type: true,
    vendor: true,
    status: true,
    packageName: true,
    dateRange: true,
    serNumber: true,
    refNo: true,
  })

  // Extract unique values from data
  const uniqueEmployees = Array.from(new Set(data.map((d) => d.employee))).sort()
  const uniqueTypes = Array.from(new Set(data.map((d) => d.type))).sort()
  const uniqueVendors = Array.from(new Set(data.map((d) => d.vendor))).sort()
  const uniqueStatuses = Array.from(new Set(data.map((d) => d.status))).sort()
  const uniquePackages = Array.from(new Set(data.map((d) => d.packageName))).sort()

  const filteredEmployees = uniqueEmployees.filter((emp) =>
    emp.toLowerCase().includes(searchTerms.employee.toLowerCase()),
  )
  const filteredTypes = uniqueTypes.filter((type) => type.toLowerCase().includes(searchTerms.type.toLowerCase()))
  const filteredVendors = uniqueVendors.filter((vendor) =>
    vendor.toLowerCase().includes(searchTerms.vendor.toLowerCase()),
  )
  const filteredPackages = uniquePackages.filter((pkg) =>
    pkg.toLowerCase().includes(searchTerms.packageName.toLowerCase()),
  )

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const toggleFilter = (
    category: keyof Omit<FilterState, "dateFrom" | "dateTo" | "serNumber" | "refNo">,
    value: string,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }))
  }

  const handleApplyFilters = () => {
    onApplyFilters(filters)
    onClose()
  }

  const handleResetFilters = () => {
    setFilters({
      employee: [],
      type: [],
      vendor: [],
      status: [],
      packageName: [],
      dateFrom: "",
      dateTo: "",
      serNumber: "",
      refNo: "",
    })
    setSearchTerms({
      employee: "",
      type: "",
      vendor: "",
      packageName: "",
    })
  }

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "dateFrom" || key === "dateTo" || key === "serNumber" || key === "refNo") {
      return value !== ""
    }
    return Array.isArray(value) && value.length > 0
  }).length

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Filter Panel */}
      <div className="fixed right-0 top-0 h-screen w-96 bg-white shadow-lg z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            {activeFilterCount > 0 && (
              <p className="text-sm text-teal-600 mt-1">{activeFilterCount} active filter(s)</p>
            )}
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Filter Sections */}
        <div className="p-6 space-y-4">
          {/* Service Number Filter */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection("serNumber")}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">Service Number</span>
              <ChevronDown
                size={18}
                className={`text-gray-600 transition-transform ${expandedSections.serNumber ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.serNumber && (
              <div className="px-4 py-3 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Search service number..."
                  value={filters.serNumber}
                  onChange={(e) => setFilters((prev) => ({ ...prev, serNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}
          </div>

          {/* Reference Number Filter */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection("refNo")}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">Reference Number</span>
              <ChevronDown
                size={18}
                className={`text-gray-600 transition-transform ${expandedSections.refNo ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.refNo && (
              <div className="px-4 py-3 border-t border-gray-200">
                <input
                  type="text"
                  placeholder="Search reference number..."
                  value={filters.refNo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, refNo: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            )}
          </div>

          {/* Employee Filter */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection("employee")}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">Employee</span>
              <ChevronDown
                size={18}
                className={`text-gray-600 transition-transform ${expandedSections.employee ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.employee && (
              <div className="px-4 py-3 border-t border-gray-200 space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees..."
                    value={searchTerms.employee}
                    onChange={(e) => setSearchTerms((prev) => ({ ...prev, employee: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <label key={emp} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.employee.includes(emp)}
                          onChange={() => toggleFilter("employee", emp)}
                          className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">{emp}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 py-2">No employees found</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Type Filter */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection("type")}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">Service Type</span>
              <ChevronDown
                size={18}
                className={`text-gray-600 transition-transform ${expandedSections.type ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.type && (
              <div className="px-4 py-3 border-t border-gray-200 space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search types..."
                    value={searchTerms.type}
                    onChange={(e) => setSearchTerms((prev) => ({ ...prev, type: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredTypes.length > 0 ? (
                    filteredTypes.map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={() => toggleFilter("type", type)}
                          className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 py-2">No types found</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Package Name Filter */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection("packageName")}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">Package Name</span>
              <ChevronDown
                size={18}
                className={`text-gray-600 transition-transform ${expandedSections.packageName ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.packageName && (
              <div className="px-4 py-3 border-t border-gray-200 space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search packages..."
                    value={searchTerms.packageName}
                    onChange={(e) => setSearchTerms((prev) => ({ ...prev, packageName: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg) => (
                      <label key={pkg} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.packageName.includes(pkg)}
                          onChange={() => toggleFilter("packageName", pkg)}
                          className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">{pkg}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 py-2">No packages found</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Vendor Filter */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection("vendor")}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">Vendor</span>
              <ChevronDown
                size={18}
                className={`text-gray-600 transition-transform ${expandedSections.vendor ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.vendor && (
              <div className="px-4 py-3 border-t border-gray-200 space-y-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={searchTerms.vendor}
                    onChange={(e) => setSearchTerms((prev) => ({ ...prev, vendor: e.target.value }))}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {filteredVendors.length > 0 ? (
                    filteredVendors.map((vendor) => (
                      <label key={vendor} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.vendor.includes(vendor)}
                          onChange={() => toggleFilter("vendor", vendor)}
                          className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                        />
                        <span className="text-sm text-gray-700">{vendor}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 py-2">No vendors found</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection("status")}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">Status</span>
              <ChevronDown
                size={18}
                className={`text-gray-600 transition-transform ${expandedSections.status ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.status && (
              <div className="px-4 py-3 border-t border-gray-200 space-y-2">
                {uniqueStatuses.map((status) => (
                  <label key={status} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={() => toggleFilter("status", status)}
                      className="w-4 h-4 rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">{status}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Filter */}
          <div className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection("dateRange")}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900">Expiration Date Range</span>
              <ChevronDown
                size={18}
                className={`text-gray-600 transition-transform ${expandedSections.dateRange ? "rotate-180" : ""}`}
              />
            </button>
            {expandedSections.dateRange && (
              <div className="px-4 py-3 border-t border-gray-200 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <button
            onClick={handleResetFilters}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}

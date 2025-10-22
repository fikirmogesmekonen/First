"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Calendar } from "lucide-react"
import { KPICard } from "./kpi-card"
import { ServiceTable } from "./service-table"
import { DownloadMenu } from "./download-menu"
import { FilterPanel, type FilterState } from "./filter-panel"
import { AssignServiceModal } from "./assign-service-modal"
import { UpdateServiceModal } from "./update-service-modal"
import { useToast, ToastContainer } from "./toast-container"
import { apiClient, type ServiceRecord } from "@/lib/api-client"

export function ServiceManagement() {
  const [tableData, setTableData] = useState<ServiceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("April 11 - April 24")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<FilterState>({
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

  const { toasts, addToast, removeToast } = useToast()

  // Fetch services on component mount
  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const services = await apiClient.getAllServices()
      setTableData(services)
    } catch (error) {
      console.error("Failed to fetch services:", error)
      addToast("Failed to load services", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAssignService = async (newService: ServiceRecord) => {
    try {
      const created = await apiClient.createService({
        refNo: newService.refNo,
        employee: newService.employee,
        type: newService.type,
        packageName: newService.packageName,
        serNumber: newService.serNumber,
        vendor: newService.vendor,
        expires: newService.expires,
      })
      setTableData((prev) => [created, ...prev])
      addToast("Successfully created", "success")
    } catch (error) {
      console.error("Failed to create service:", error)
      addToast("Failed to create service", "error")
    }
  }

  const handleEnable = async (service: ServiceRecord) => {
    try {
      await apiClient.enableService(service.id)
      setTableData((prev) => prev.map((item) => (item.id === service.id ? { ...item, status: "Active" } : item)))
      addToast("Successfully enabled", "success")
    } catch (error) {
      console.error("Failed to enable service:", error)
      addToast("Failed to enable service", "error")
    }
  }

  const handleDisable = async (service: ServiceRecord) => {
    try {
      await apiClient.disableService(service.id)
      setTableData((prev) => prev.map((item) => (item.id === service.id ? { ...item, status: "Expired" } : item)))
      addToast("Successfully disabled", "success")
    } catch (error) {
      console.error("Failed to disable service:", error)
      addToast("Failed to disable service", "error")
    }
  }

  const handleUpdate = (service: ServiceRecord) => {
    setSelectedService(service)
    setIsUpdateModalOpen(true)
  }

  const handleUpdateSubmit = async (updatedService: ServiceRecord) => {
    try {
      await apiClient.updateService(updatedService.id, {
        refNo: updatedService.refNo,
        employee: updatedService.employee,
        type: updatedService.type,
        packageName: updatedService.packageName,
        serNumber: updatedService.serNumber,
        vendor: updatedService.vendor,
        status: updatedService.status,
        expires: updatedService.expires,
      })
      setTableData((prev) => prev.map((item) => (item.id === updatedService.id ? updatedService : item)))
      setIsUpdateModalOpen(false)
      setSelectedService(null)
      addToast("Successfully updated", "success")
    } catch (error) {
      console.error("Failed to update service:", error)
      addToast("Failed to update service", "error")
    }
  }

  const filteredData = tableData.filter((item) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      item.id.toLowerCase().includes(searchLower) ||
      item.employee.toLowerCase().includes(searchLower) ||
      item.packageName.toLowerCase().includes(searchLower) ||
      item.vendor.toLowerCase().includes(searchLower) ||
      item.serNumber.toLowerCase().includes(searchLower) ||
      item.refNo.toLowerCase().includes(searchLower)

    if (!matchesSearch) return false

    if (activeFilters.employee.length > 0 && !activeFilters.employee.includes(item.employee)) {
      return false
    }

    if (activeFilters.type.length > 0 && !activeFilters.type.includes(item.type)) {
      return false
    }

    if (activeFilters.vendor.length > 0 && !activeFilters.vendor.includes(item.vendor)) {
      return false
    }

    if (activeFilters.status.length > 0 && !activeFilters.status.includes(item.status)) {
      return false
    }

    if (activeFilters.packageName.length > 0 && !activeFilters.packageName.includes(item.packageName)) {
      return false
    }

    if (activeFilters.serNumber && !item.serNumber.toLowerCase().includes(activeFilters.serNumber.toLowerCase())) {
      return false
    }

    if (activeFilters.refNo && !item.refNo.toLowerCase().includes(activeFilters.refNo.toLowerCase())) {
      return false
    }

    if (activeFilters.dateFrom || activeFilters.dateTo) {
      const itemDate = new Date(item.expires.split("/").reverse().join("-"))
      if (activeFilters.dateFrom) {
        const fromDate = new Date(activeFilters.dateFrom)
        if (itemDate < fromDate) return false
      }
      if (activeFilters.dateTo) {
        const toDate = new Date(activeFilters.dateTo)
        if (itemDate > toDate) return false
      }
    }

    return true
  })

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (key === "dateFrom" || key === "dateTo" || key === "serNumber" || key === "refNo") {
        if (value !== "") count++
      } else if (Array.isArray(value) && value.length > 0) {
        count++
      }
    })
    return count
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <div>
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
      </div>

      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
            <p className="text-gray-600 text-sm mt-1">Assign and manage mobile services, packages, and airtimes</p>
          </div>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <span>+</span>
            Assign Services
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Services"
            value={tableData.length.toString()}
            trend="-0.5%"
            trendType="down"
            icon="dollar"
          />
          <KPICard
            title="Active Services"
            value={tableData.filter((s) => s.status === "Active").length.toString()}
            trend="+1.0%"
            trendType="up"
            icon="cart"
          />
          <KPICard
            title="Expiring soon"
            value={tableData.filter((s) => s.status === "Exp_soon").length.toString()}
            trend="-0.5%"
            trendType="down"
            icon="dollar"
          />
          <KPICard
            title="Expired"
            value={tableData.filter((s) => s.status === "Expired").length.toString()}
            trend="+10%"
            trendType="up"
            icon="cart"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">All Services</h3>
          <p className="text-gray-600 text-sm mt-1">View and manage all service assignments</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, product, or others..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors relative"
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Filters</span>
            {getActiveFilterCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar size={18} />
            <span className="text-sm font-medium">{dateRange}</span>
          </button>
          <DownloadMenu data={filteredData} />
        </div>

        <ServiceTable data={filteredData} onEnable={handleEnable} onDisable={handleDisable} onUpdate={handleUpdate} />
      </div>

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        data={tableData}
      />

      <AssignServiceModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSubmit={handleAssignService}
      />

      <UpdateServiceModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false)
          setSelectedService(null)
        }}
        onSubmit={handleUpdateSubmit}
        service={selectedService}
      />
    </div>
  )
}

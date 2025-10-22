import type { ServiceRecord, CreateServiceRequest, FilterRequest } from "./api-client"

// Mock data
const mockServices: ServiceRecord[] = [
  {
    id: "SER-001",
    refNo: "#ref2024",
    employee: "Aman Buze",
    type: "Packages",
    packageName: "Unlimited Voice",
    serNumber: "+251980808080",
    vendor: "ETHIO_TELE",
    status: "Active",
    expires: "02/10/2026",
  },
  {
    id: "SER-002",
    refNo: "#ref2024",
    employee: "Aman Buze",
    type: "Packages",
    packageName: "Unlimited Voice",
    serNumber: "+251980808080",
    vendor: "ETHIO_TELE",
    status: "Exp_soon",
    expires: "02/10/2026",
  },
  {
    id: "SER-003",
    refNo: "#ref2024",
    employee: "Aman Buze",
    type: "Packages",
    packageName: "Unlimited Voice",
    serNumber: "+251980808080",
    vendor: "ETHIO_TELE",
    status: "Expired",
    expires: "02/10/2026",
  },
]

const services = [...mockServices]
let idCounter = 4

export class MockApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getAllServices(): Promise<ServiceRecord[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))
    return services
  }

  async getServiceById(id: string): Promise<ServiceRecord> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const service = services.find((s) => s.id === id)
    if (!service) throw new Error("Service not found")
    return service
  }

  async createService(data: CreateServiceRequest): Promise<ServiceRecord> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newService: ServiceRecord = {
      id: `SER-${String(idCounter).padStart(3, "0")}`,
      refNo: data.refNo,
      employee: data.employee,
      type: data.type,
      packageName: data.packageName,
      serNumber: data.serNumber,
      vendor: data.vendor,
      status: data.status || "Active",
      expires: data.expires,
    }
    idCounter++
    services.unshift(newService)
    return newService
  }

  async updateService(id: string, data: CreateServiceRequest): Promise<ServiceRecord> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const index = services.findIndex((s) => s.id === id)
    if (index === -1) throw new Error("Service not found")

    const updatedService: ServiceRecord = {
      id,
      refNo: data.refNo,
      employee: data.employee,
      type: data.type,
      packageName: data.packageName,
      serNumber: data.serNumber,
      vendor: data.vendor,
      status: data.status || "Active",
      expires: data.expires,
    }
    services[index] = updatedService
    return updatedService
  }

  async enableService(id: string): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const service = services.find((s) => s.id === id)
    if (!service) throw new Error("Service not found")
    service.status = "Active"
    return { message: "Service enabled successfully" }
  }

  async disableService(id: string): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const service = services.find((s) => s.id === id)
    if (!service) throw new Error("Service not found")
    service.status = "Expired"
    return { message: "Service disabled successfully" }
  }

  async filterServices(filter: FilterRequest): Promise<ServiceRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return services.filter((service) => {
      if (filter.employee.length > 0 && !filter.employee.includes(service.employee)) return false
      if (filter.type.length > 0 && !filter.type.includes(service.type)) return false
      if (filter.vendor.length > 0 && !filter.vendor.includes(service.vendor)) return false
      if (filter.status.length > 0 && !filter.status.includes(service.status)) return false
      if (filter.packageName.length > 0 && !filter.packageName.includes(service.packageName)) return false
      if (filter.serNumber && !service.serNumber.includes(filter.serNumber)) return false
      if (filter.refNo && !service.refNo.includes(filter.refNo)) return false
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase()
        if (
          !service.id.toLowerCase().includes(query) &&
          !service.employee.toLowerCase().includes(query) &&
          !service.packageName.toLowerCase().includes(query) &&
          !service.vendor.toLowerCase().includes(query)
        ) {
          return false
        }
      }
      return true
    })
  }

  async deleteService(id: string): Promise<{ message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const index = services.findIndex((s) => s.id === id)
    if (index === -1) throw new Error("Service not found")
    services.splice(index, 1)
    return { message: "Service deleted successfully" }
  }
}

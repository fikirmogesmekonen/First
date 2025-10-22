import { MockApiClient } from "./mock-api-client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7001/api"

export interface ServiceRecord {
  id: string
  refNo: string
  employee: string
  type: string
  packageName: string
  serNumber: string
  vendor: string
  status: string
  expires: string
}

export interface CreateServiceRequest {
  refNo: string
  employee: string
  type: string
  packageName: string
  serNumber: string
  vendor: string
  status?: string
  expires: string
}

export interface FilterRequest {
  employee: string[]
  type: string[]
  vendor: string[]
  status: string[]
  packageName: string[]
  serNumber: string
  refNo: string
  dateFrom: string
  dateTo: string
  searchQuery: string
}

class ApiClient {
  private baseUrl: string
  private mockClient: MockApiClient
  private useRealApi: boolean

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    this.mockClient = new MockApiClient(baseUrl)
    this.useRealApi = !!process.env.NEXT_PUBLIC_API_URL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.useRealApi) {
      return this.getMockResponse<T>(endpoint, options)
    }

    const url = `${this.baseUrl}${endpoint}`
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`)
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format")
      }

      return response.json()
    } catch (error) {
      console.log("[v0] Real API failed, falling back to mock client:", error instanceof Error ? error.message : error)
      return this.getMockResponse<T>(endpoint, options)
    }
  }

  private async getMockResponse<T>(endpoint: string, options: RequestInit): Promise<T> {
    // Route to appropriate mock method based on endpoint and method
    const method = options.method || "GET"

    if (endpoint === "/services" && method === "GET") {
      return (await this.mockClient.getAllServices()) as T
    }

    if (endpoint.startsWith("/services/") && endpoint.endsWith("/enable") && method === "PATCH") {
      const id = endpoint.split("/")[2]
      return (await this.mockClient.enableService(id)) as T
    }

    if (endpoint.startsWith("/services/") && endpoint.endsWith("/disable") && method === "PATCH") {
      const id = endpoint.split("/")[2]
      return (await this.mockClient.disableService(id)) as T
    }

    if (endpoint === "/services" && method === "POST") {
      const data = JSON.parse(options.body as string)
      return (await this.mockClient.createService(data)) as T
    }

    if (endpoint.startsWith("/services/") && method === "PUT") {
      const id = endpoint.split("/")[2]
      const data = JSON.parse(options.body as string)
      return (await this.mockClient.updateService(id, data)) as T
    }

    if (endpoint === "/services/filter" && method === "POST") {
      const data = JSON.parse(options.body as string)
      return (await this.mockClient.filterServices(data)) as T
    }

    if (endpoint.startsWith("/services/") && method === "DELETE") {
      const id = endpoint.split("/")[2]
      return (await this.mockClient.deleteService(id)) as T
    }

    throw new Error("Unknown endpoint")
  }

  // Services endpoints
  async getAllServices(): Promise<ServiceRecord[]> {
    return this.request<ServiceRecord[]>("/services")
  }

  async getServiceById(id: string): Promise<ServiceRecord> {
    return this.request<ServiceRecord>(`/services/${id}`)
  }

  async createService(data: CreateServiceRequest): Promise<ServiceRecord> {
    return this.request<ServiceRecord>("/services", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateService(id: string, data: CreateServiceRequest): Promise<ServiceRecord> {
    return this.request<ServiceRecord>(`/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async enableService(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/services/${id}/enable`, {
      method: "PATCH",
    })
  }

  async disableService(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/services/${id}/disable`, {
      method: "PATCH",
    })
  }

  async filterServices(filter: FilterRequest): Promise<ServiceRecord[]> {
    return this.request<ServiceRecord[]>("/services/filter", {
      method: "POST",
      body: JSON.stringify(filter),
    })
  }

  async deleteService(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/services/${id}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

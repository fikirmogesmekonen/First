"use client"

import type React from "react"

import { X } from "lucide-react"
import { useState, useEffect } from "react"
import type { ServiceRecord } from "@/lib/download-utils"

interface UpdateServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (updatedService: ServiceRecord) => void
  service: ServiceRecord | null
}

const SERVICE_TYPES = ["Voice package", "Internet package", "Dongle", "Dongle with sim", "Smart phone with sim"]

export function UpdateServiceModal({ isOpen, onClose, onSubmit, service }: UpdateServiceModalProps) {
  const [formData, setFormData] = useState<ServiceRecord>({
    id: "",
    refNo: "",
    employee: "",
    type: "",
    packageName: "",
    serNumber: "",
    vendor: "",
    status: "Active",
    expires: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (service) {
      setFormData(service)
      setErrors({})
      setTouched({})
    }
  }, [service, isOpen])

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "employee":
        if (!value.trim()) return "Employee name is required"
        if (!/^[a-zA-Z\s]+$/.test(value)) return "Employee name can only contain letters and spaces"
        return ""

      case "refNo":
        if (!value.trim()) return "Reference number is required"
        if (!/^[a-zA-Z0-9#\-_]+$/.test(value)) return "Invalid characters in reference number"
        return ""

      case "packageName":
        if (!value.trim()) return "Package name is required"
        if (!/^[a-zA-Z0-9\s\-()]+$/.test(value)) return "Invalid characters in package name"
        return ""

      case "serNumber":
        if (!value.trim()) return "Service number is required"
        if (!/^[\d+\-\s()]+$/.test(value))
          return "Service number can only contain digits, +, -, spaces, and parentheses"
        if (!/\d/.test(value)) return "Service number must contain at least one digit"
        return ""

      case "vendor":
        if (!value.trim()) return "Vendor is required"
        if (!/^[a-zA-Z0-9\s_]+$/.test(value)) return "Invalid characters in vendor name"
        return ""

      case "expires":
        if (!value.trim()) return "Expiry date is required"
        return ""

      case "type":
        if (!value) return "Service type is required"
        return ""

      default:
        return ""
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach((key) => {
      if (key !== "id" && key !== "status") {
        const error = validateField(key, formData[key as keyof ServiceRecord] as string)
        if (error) newErrors[key] = error
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched(
        Object.keys(formData).reduce(
          (acc, key) => {
            acc[key] = true
            return acc
          },
          {} as Record<string, boolean>,
        ),
      )
      return
    }

    onSubmit(formData)
    setFormData({
      id: "",
      refNo: "",
      employee: "",
      type: "",
      packageName: "",
      serNumber: "",
      vendor: "",
      status: "Active",
      expires: "",
    })
    setErrors({})
    setTouched({})
    onClose()
  }

  if (!isOpen || !service) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">Update Service</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                touched["type"] && errors["type"] ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            >
              <option value="">Select service type</option>
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {touched["type"] && errors["type"] && <p className="text-red-500 text-xs mt-1">{errors["type"]}</p>}
          </div>

          {/* Employee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
            <input
              type="text"
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter employee name"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                touched["employee"] && errors["employee"] ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {touched["employee"] && errors["employee"] && (
              <p className="text-red-500 text-xs mt-1">{errors["employee"]}</p>
            )}
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
            <input
              type="text"
              name="refNo"
              value={formData.refNo}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., #ref2024"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                touched["refNo"] && errors["refNo"] ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {touched["refNo"] && errors["refNo"] && <p className="text-red-500 text-xs mt-1">{errors["refNo"]}</p>}
          </div>

          {/* Package Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Package Name</label>
            <input
              type="text"
              name="packageName"
              value={formData.packageName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Unlimited Voice"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                touched["packageName"] && errors["packageName"] ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {touched["packageName"] && errors["packageName"] && (
              <p className="text-red-500 text-xs mt-1">{errors["packageName"]}</p>
            )}
          </div>

          {/* Service Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Number</label>
            <input
              type="text"
              name="serNumber"
              value={formData.serNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., +251980808080"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                touched["serNumber"] && errors["serNumber"] ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {touched["serNumber"] && errors["serNumber"] && (
              <p className="text-red-500 text-xs mt-1">{errors["serNumber"]}</p>
            )}
          </div>

          {/* Vendor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
            <input
              type="text"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., ETHIO_TELE"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                touched["vendor"] && errors["vendor"] ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {touched["vendor"] && errors["vendor"] && <p className="text-red-500 text-xs mt-1">{errors["vendor"]}</p>}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <input
              type="date"
              name="expires"
              value={formData.expires}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                touched["expires"] && errors["expires"] ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {touched["expires"] && errors["expires"] && (
              <p className="text-red-500 text-xs mt-1">{errors["expires"]}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="Active">Active</option>
              <option value="Exp_soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors"
            >
              Update Service
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { X, AlertCircle } from "lucide-react"
import type { ServiceRecord } from "@/lib/download-utils"

interface AssignServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (service: ServiceRecord) => void
}

const SERVICE_TYPES = [
  { value: "voice", label: "Voice Package" },
  { value: "internet", label: "Internet Package" },
  { value: "dongle", label: "Dongle" },
  { value: "dongle_sim", label: "Dongle with SIM" },
  { value: "smartphone_sim", label: "Smartphone with SIM" },
]

const VENDORS = ["ETHIO_TELE", "VODAFONE", "ORANGE", "AIRTEL"]

const EMPLOYEES = ["Aman Buze", "John Doe", "Jane Smith", "Ahmed Hassan", "Maria Garcia"]

const validatePhoneNumber = (value: string): string => {
  if (!value) return "Service number is required"
  // Allow phone numbers with +, -, spaces, and digits only
  const phoneRegex = /^[\d\s\-+()]*$/
  if (!phoneRegex.test(value)) {
    return "Service number can only contain digits, +, -, spaces, and parentheses"
  }
  if (value.replace(/\D/g, "").length < 7) {
    return "Service number must contain at least 7 digits"
  }
  return ""
}

const validateReferenceNumber = (value: string): string => {
  if (!value) return "Reference number is required"
  // Allow alphanumeric and special characters like #, -, _
  const refRegex = /^[a-zA-Z0-9#\-_]*$/
  if (!refRegex.test(value)) {
    return "Reference number can only contain letters, numbers, #, -, and _"
  }
  return ""
}

const validatePackageName = (value: string): string => {
  if (!value) return "Package name is required"
  // Allow letters, numbers, spaces, and common punctuation
  const packageRegex = /^[a-zA-Z0-9\s\-()]*$/
  if (!packageRegex.test(value)) {
    return "Package name can only contain letters, numbers, spaces, hyphens, and parentheses"
  }
  return ""
}

export function AssignServiceModal({ isOpen, onClose, onSubmit }: AssignServiceModalProps) {
  const [formData, setFormData] = useState({
    serviceType: "",
    employee: "",
    refNo: "",
    packageName: "",
    serNumber: "",
    vendor: "",
    expiryDate: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Real-time validation for specific fields
    let fieldError = ""
    if (name === "serNumber" && value) {
      fieldError = validatePhoneNumber(value)
    } else if (name === "refNo" && value) {
      fieldError = validateReferenceNumber(value)
    } else if (name === "packageName" && value) {
      fieldError = validatePackageName(value)
    }

    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }))
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.serviceType) newErrors.serviceType = "Service type is required"
    if (!formData.employee) newErrors.employee = "Employee is required"

    // Validate reference number
    const refError = validateReferenceNumber(formData.refNo)
    if (refError) newErrors.refNo = refError

    // Validate package name
    const packageError = validatePackageName(formData.packageName)
    if (packageError) newErrors.packageName = packageError

    // Validate service number
    const phoneError = validatePhoneNumber(formData.serNumber)
    if (phoneError) newErrors.serNumber = phoneError

    if (!formData.vendor) newErrors.vendor = "Vendor is required"
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateServiceId = () => {
    return `SER-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const newService: ServiceRecord = {
      id: generateServiceId(),
      refNo: formData.refNo,
      employee: formData.employee,
      type: "Packages",
      packageName: formData.packageName,
      serNumber: formData.serNumber,
      vendor: formData.vendor,
      status: "Active",
      expires: formData.expiryDate,
    }

    onSubmit(newService)

    // Reset form
    setFormData({
      serviceType: "",
      employee: "",
      refNo: "",
      packageName: "",
      serNumber: "",
      vendor: "",
      expiryDate: "",
    })
    setErrors({})
    setTouched({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Assign Service</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.serviceType && touched.serviceType ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            >
              <option value="">Select a service type</option>
              {SERVICE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.serviceType && touched.serviceType && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                <AlertCircle size={16} />
                {errors.serviceType}
              </div>
            )}
          </div>

          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Employee <span className="text-red-500">*</span>
            </label>
            <select
              name="employee"
              value={formData.employee}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.employee && touched.employee ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            >
              <option value="">Select an employee</option>
              {EMPLOYEES.map((emp) => (
                <option key={emp} value={emp}>
                  {emp}
                </option>
              ))}
            </select>
            {errors.employee && touched.employee && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                <AlertCircle size={16} />
                {errors.employee}
              </div>
            )}
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Reference Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="refNo"
              value={formData.refNo}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., #ref2024"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.refNo && touched.refNo ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.refNo && touched.refNo && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                <AlertCircle size={16} />
                {errors.refNo}
              </div>
            )}
          </div>

          {/* Package Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Package Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="packageName"
              value={formData.packageName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., Unlimited Voice"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.packageName && touched.packageName ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.packageName && touched.packageName && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                <AlertCircle size={16} />
                {errors.packageName}
              </div>
            )}
          </div>

          {/* Service Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Service Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="serNumber"
              value={formData.serNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g., +251980808080"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.serNumber && touched.serNumber ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.serNumber && touched.serNumber && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                <AlertCircle size={16} />
                {errors.serNumber}
              </div>
            )}
          </div>

          {/* Vendor Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Vendor <span className="text-red-500">*</span>
            </label>
            <select
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.vendor && touched.vendor ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            >
              <option value="">Select a vendor</option>
              {VENDORS.map((vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
            {errors.vendor && touched.vendor && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                <AlertCircle size={16} />
                {errors.vendor}
              </div>
            )}
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                errors.expiryDate && touched.expiryDate ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {errors.expiryDate && touched.expiryDate && (
              <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
                <AlertCircle size={16} />
                {errors.expiryDate}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Service
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

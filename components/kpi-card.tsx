import { DollarSign, ShoppingCart } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  trend: string
  trendType: "up" | "down"
  icon: "dollar" | "cart"
}

export function KPICard({ title, value, trend, trendType, icon }: KPICardProps) {
  const IconComponent = icon === "dollar" ? DollarSign : ShoppingCart

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
          <IconComponent size={24} className="text-teal-500" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className={`text-sm font-medium ${trendType === "up" ? "text-green-600" : "text-red-600"}`}>
          {trendType === "up" ? "▲" : "▼"} {trend}
        </span>
        <span className="text-gray-500 text-sm">from last week</span>
      </div>
    </div>
  )
}

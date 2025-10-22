"use client"

import { useState } from "react"
import { LayoutDashboard, Zap, Smartphone, Users, FileText, BarChart3, Settings, ChevronLeft } from "lucide-react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#" },
  { icon: Zap, label: "Services", href: "#", active: true, badge: 7 },
  { icon: Smartphone, label: "Devices", href: "#" },
  { icon: Users, label: "Employees", href: "#", badge: 5 },
  { icon: FileText, label: "Audit Trails", href: "#" },
  { icon: BarChart3, label: "Reports", href: "#" },
  { icon: Settings, label: "Settings", href: "#", indicator: true },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="font-bold text-lg text-gray-900">ZoSale</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft size={20} className={`text-gray-600 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
          {!collapsed && "Overview"}
        </div>
        {menuItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative ${
              item.active ? "bg-teal-50 text-teal-600" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <item.icon size={20} />
            {!collapsed && (
              <>
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-teal-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
                {item.indicator && <span className="ml-auto w-2 h-2 bg-teal-500 rounded-full"></span>}
              </>
            )}
          </a>
        ))}
      </nav>
    </aside>
  )
}

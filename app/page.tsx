import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { ServiceManagement } from "@/components/service-management"

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <ServiceManagement />
        </main>
      </div>
    </div>
  )
}

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import WaterDashboard from "@/components/water-dashboard"

export default function WaterPage() {
  return (
    <DashboardLayout title="Water Analysis" subtitle="Advanced Real-time Analytics Dashboard">
      <WaterDashboard />
    </DashboardLayout>
  )
}

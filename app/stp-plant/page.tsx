import { DashboardLayout } from "@/components/layout/dashboard-layout"
import RealSTPDashboard from "@/features/stp-plant/components/real-stp-dashboard"

export default function StpPlantPage() {
  return (
    <DashboardLayout title="STP Plant (750 m³/d)" subtitle="Advanced monitoring and analytics for wastewater treatment operations">
      <RealSTPDashboard />
    </DashboardLayout>
  )
}

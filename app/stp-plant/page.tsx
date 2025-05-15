import { DashboardLayout } from "@/components/layout/dashboard-layout"
import StpPlantDashboard from "@/features/stp-plant/components/stp-plant-dashboard"

export default function StpPlantPage() {
  return (
    <DashboardLayout title="STP Plant (750 m³/d)" subtitle="Real-time monitoring and control">
      <StpPlantDashboard />
    </DashboardLayout>
  )
}

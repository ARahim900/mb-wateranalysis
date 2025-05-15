import { DashboardLayout } from "@/components/layout/dashboard-layout"
import EnhancedSTPPlantDashboard from "@/features/stp-plant/components/enhanced-stp-plant-dashboard"

export default function StpPlantPage() {
  return (
    <DashboardLayout title="STP Plant (750 m³/d)" subtitle="Real-time monitoring and control">
      <EnhancedSTPPlantDashboard />
    </DashboardLayout>
  )
}

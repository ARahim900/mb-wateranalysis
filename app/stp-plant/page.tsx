import { DashboardLayout } from "@/components/layout/dashboard-layout"
import EnhancedSTPDashboard from "@/features/stp-plant/components/enhanced-stp-dashboard"

export default function StpPlantPage() {
  return (
    <DashboardLayout title="STP Plant (750 m³/d)" subtitle="Advanced monitoring and analytics for wastewater treatment operations">
      <EnhancedSTPDashboard />
    </DashboardLayout>
  )
}

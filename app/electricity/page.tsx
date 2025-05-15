import { DashboardLayout } from "@/components/layout/dashboard-layout"
import ElectricityDashboard from "@/features/electricity/components/electricity-dashboard"

export default function ElectricityPage() {
  return (
    <DashboardLayout title="Electricity Analysis" subtitle="Monitoring and optimization dashboard">
      <ElectricityDashboard />
    </DashboardLayout>
  )
}

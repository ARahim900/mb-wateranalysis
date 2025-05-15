import { DashboardLayout } from "@/components/layout/dashboard-layout"
import STPPlantDashboard from "@/features/stp-plant/components/stp-plant-dashboard"

export default function STPPlantPage() {
  return (
    <DashboardLayout>
      <STPPlantDashboard />
    </DashboardLayout>
  )
}

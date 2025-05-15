import { DashboardLayout } from "@/components/layout/dashboard-layout"
import ContractorDashboard from "@/features/contractors/components/contractor-dashboard"

export default function ContractorsPage() {
  return (
    <DashboardLayout title="Contractor Tracker" subtitle="Manage and monitor contractor activities">
      <ContractorDashboard />
    </DashboardLayout>
  )
}

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import LeakDetectionDashboard from "@/components/leak-detection-dashboard"

export default function LeakDetectionPage() {
  return (
    <DashboardLayout title="Leak Detection" subtitle="Zone 05 Water Loss Analysis & Vendor Management">
      <LeakDetectionDashboard />
    </DashboardLayout>
  )
}

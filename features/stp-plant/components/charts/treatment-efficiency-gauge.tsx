"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface TreatmentEfficiencyGaugeProps {
  efficiency: number
  treatmentRatio: number
  showDetails?: boolean
}

export function TreatmentEfficiencyGauge({
  efficiency,
  treatmentRatio,
  showDetails = false,
}: TreatmentEfficiencyGaugeProps) {
  // Ensure values are within range
  const safeEfficiency = useMemo(() => Math.min(100, Math.max(0, efficiency)), [efficiency])
  const safeTreatmentRatio = useMemo(() => Math.min(100, Math.max(0, treatmentRatio)), [treatmentRatio])

  // Calculate remaining percentages
  const efficiencyRemaining = 100 - safeEfficiency
  const treatmentRatioRemaining = 100 - safeTreatmentRatio

  // Prepare data for the gauge charts
  const efficiencyData = [
    { name: "Efficiency", value: safeEfficiency },
    { name: "Remaining", value: efficiencyRemaining },
  ]

  const treatmentRatioData = [
    { name: "Treatment Ratio", value: safeTreatmentRatio },
    { name: "Remaining", value: treatmentRatioRemaining },
  ]

  // Determine colors based on values
  const getEfficiencyColor = (value: number) => {
    if (value >= 90) return "#10B981" // Green for excellent
    if (value >= 80) return "#22C55E" // Light green for good
    if (value >= 70) return "#EAB308" // Yellow for average
    return "#EF4444" // Red for poor
  }

  const getTreatmentRatioColor = (value: number) => {
    if (value >= 90) return "#8B5CF6" // Purple for excellent
    if (value >= 80) return "#A78BFA" // Light purple for good
    if (value >= 70) return "#F59E0B" // Amber for average
    return "#F43F5E" // Pink for poor
  }

  const efficiencyColor = getEfficiencyColor(safeEfficiency)
  const treatmentRatioColor = getTreatmentRatioColor(safeTreatmentRatio)

  // Efficiency rating text
  const getEfficiencyRating = (value: number) => {
    if (value >= 90) return "Excellent"
    if (value >= 80) return "Good"
    if (value >= 70) return "Average"
    return "Needs Improvement"
  }

  const efficiencyRating = getEfficiencyRating(safeEfficiency)
  const treatmentRatioRating = getEfficiencyRating(safeTreatmentRatio)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treatment Efficiency</CardTitle>
        <CardDescription>Key performance indicators for water treatment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={efficiencyData}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={0}
                    dataKey="value"
                    cornerRadius={5}
                  >
                    <Cell key="efficiency-cell-0" fill={efficiencyColor} />
                    <Cell key="efficiency-cell-1" fill="#F3F4F6" />
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value.toFixed(1)}%`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.375rem",
                      padding: "8px 12px",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <div className="text-2xl font-bold" style={{ color: efficiencyColor }}>
                {safeEfficiency.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Treatment Efficiency</div>
              <div className="text-sm font-medium mt-1" style={{ color: efficiencyColor }}>
                {efficiencyRating}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={treatmentRatioData}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="60%"
                    outerRadius="80%"
                    paddingAngle={0}
                    dataKey="value"
                    cornerRadius={5}
                  >
                    <Cell key="ratio-cell-0" fill={treatmentRatioColor} />
                    <Cell key="ratio-cell-1" fill="#F3F4F6" />
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value.toFixed(1)}%`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.375rem",
                      padding: "8px 12px",
                      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <div className="text-2xl font-bold" style={{ color: treatmentRatioColor }}>
                {safeTreatmentRatio.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">TSE to Irrigation Ratio</div>
              <div className="text-sm font-medium mt-1" style={{ color: treatmentRatioColor }}>
                {treatmentRatioRating}
              </div>
            </div>
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="text-center p-2 rounded bg-red-50 dark:bg-red-900/20">
              <p className="text-xs text-gray-500 dark:text-gray-400">Poor</p>
              <p className="font-medium text-red-500 dark:text-red-400">&lt;70%</p>
            </div>
            <div className="text-center p-2 rounded bg-yellow-50 dark:bg-yellow-900/20">
              <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
              <p className="font-medium text-yellow-500 dark:text-yellow-400">70-80%</p>
            </div>
            <div className="text-center p-2 rounded bg-green-50 dark:bg-green-900/20">
              <p className="text-xs text-gray-500 dark:text-gray-400">Good</p>
              <p className="font-medium text-green-500 dark:text-green-400">&gt;80%</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

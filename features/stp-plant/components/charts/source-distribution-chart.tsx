"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import type { STPData } from "../../hooks/use-stp-data"
import { ensureNumber } from "../../hooks/use-stp-data"

interface SourceDistributionChartProps {
  tankerPercentage: number
  directPercentage: number
  showTrends?: boolean
  data?: STPData[]
}

export function SourceDistributionChart({
  tankerPercentage,
  directPercentage,
  showTrends = false,
  data = [],
}: SourceDistributionChartProps) {
  // Prepare data for the pie chart
  const pieData = [
    { name: "Tanker Discharge", value: tankerPercentage, color: "#4E4456" },
    { name: "Direct Sewage", value: directPercentage, color: "#6366F1" },
  ]

  // Prepare trend data if needed
  const trendData = useMemo(() => {
    if (!showTrends || !data || data.length === 0) return []

    // Group data by week for better visualization
    const weeklyData: Record<string, any> = {}

    data.forEach((item) => {
      const date = new Date(item.date)
      // Get week number (approximate)
      const weekNum = Math.floor(date.getDate() / 7) + 1
      const monthName = date.toLocaleString("default", { month: "short" })
      const weekKey = `${monthName} W${weekNum}`

      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          week: weekKey,
          tankerVolume: 0,
          directSewage: 0,
          totalInlet: 0,
          count: 0,
        }
      }

      weeklyData[weekKey].tankerVolume += ensureNumber(item.expectedTankerVolume)
      weeklyData[weekKey].directSewage += ensureNumber(item.directInlineSewage)
      weeklyData[weekKey].totalInlet += ensureNumber(item.totalInletSewage)
      weeklyData[weekKey].count += 1
    })

    // Convert to array and calculate percentages
    return Object.values(weeklyData).map((week: any) => ({
      week: week.week,
      tankerPercentage: week.totalInlet > 0 ? (week.tankerVolume / week.totalInlet) * 100 : 0,
      directPercentage: week.totalInlet > 0 ? (week.directSewage / week.totalInlet) * 100 : 0,
    }))
  }, [data, showTrends])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Source Distribution</CardTitle>
        <CardDescription>Breakdown of water sources in the STP system</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {!showTrends ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  label={{
                    value: "Percentage %",
                    angle: -90,
                    position: "insideLeft",
                    style: { textAnchor: "middle" },
                  }}
                />
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
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tankerPercentage"
                  stroke="#4E4456"
                  name="Tanker Discharge %"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="directPercentage"
                  stroke="#6366F1"
                  name="Direct Sewage %"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import type { STPData } from "../../hooks/use-stp-data"
import { ensureNumber } from "../../hooks/use-stp-data"

interface WaterBalanceChartProps {
  data: STPData[]
  showDetails?: boolean
}

export function WaterBalanceChart({ data, showDetails = false }: WaterBalanceChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

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
          treatedWater: 0,
          tseWater: 0,
          count: 0,
        }
      }

      weeklyData[weekKey].tankerVolume += ensureNumber(item.expectedTankerVolume)
      weeklyData[weekKey].directSewage += ensureNumber(item.directInlineSewage)
      weeklyData[weekKey].totalInlet += ensureNumber(item.totalInletSewage)
      weeklyData[weekKey].treatedWater += ensureNumber(item.totalTreatedWater)
      weeklyData[weekKey].tseWater += ensureNumber(item.totalTSEWater)
      weeklyData[weekKey].count += 1
    })

    // Convert to array and calculate treatment efficiency
    return Object.values(weeklyData).map((week: any) => ({
      week: week.week,
      tankerVolume: week.tankerVolume,
      directSewage: week.directSewage,
      totalInlet: week.totalInlet,
      treatedWater: week.treatedWater,
      tseWater: week.tseWater,
      efficiency: (week.treatedWater / week.totalInlet) * 100,
      treatmentLoss: week.totalInlet - week.treatedWater,
      distributionLoss: week.treatedWater - week.tseWater,
    }))
  }, [data])

  // Calculate overall efficiency
  const overallEfficiency = useMemo(() => {
    if (!data || data.length === 0) return 0

    const totalInlet = data.reduce((sum, item) => sum + ensureNumber(item.totalInletSewage), 0)
    const totalTreated = data.reduce((sum, item) => sum + ensureNumber(item.totalTreatedWater), 0)

    return totalInlet > 0 ? (totalTreated / totalInlet) * 100 : 0
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Water Balance Analysis</CardTitle>
        <CardDescription>Weekly breakdown of water flow and treatment efficiency</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              {showDetails && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#82ca9d"
                  domain={[0, 100]}
                  label={{
                    value: "Efficiency %",
                    angle: 90,
                    position: "insideRight",
                    style: { textAnchor: "middle" },
                  }}
                />
              )}
              <Tooltip
                formatter={(value, name) => {
                  if (name === "efficiency") return [`${value.toFixed(1)}%`, "Efficiency"]
                  return [
                    `${value.toLocaleString()} m³`,
                    name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
                  ]
                }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.375rem",
                  padding: "8px 12px",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="tankerVolume" stackId="a" fill="#4E4456" name="Tanker Volume" />
              <Bar yAxisId="left" dataKey="directSewage" stackId="a" fill="#6366F1" name="Direct Sewage" />
              {showDetails && (
                <>
                  <Bar yAxisId="left" dataKey="treatmentLoss" stackId="b" fill="#F43F5E" name="Treatment Loss" />
                  <Bar yAxisId="left" dataKey="treatedWater" stackId="b" fill="#8B5CF6" name="Treated Water" />
                  <Bar yAxisId="left" dataKey="distributionLoss" stackId="c" fill="#F59E0B" name="Distribution Loss" />
                  <Bar yAxisId="left" dataKey="tseWater" stackId="c" fill="#10B981" name="TSE Water" />
                  <ReferenceLine
                    yAxisId="right"
                    y={overallEfficiency}
                    stroke="#ff7300"
                    strokeDasharray="3 3"
                    label={{
                      value: `Avg: ${overallEfficiency.toFixed(1)}%`,
                      position: "insideBottomRight",
                      fill: "#ff7300",
                    }}
                  />
                </>
              )}
              {!showDetails && (
                <>
                  <Bar yAxisId="left" dataKey="treatedWater" fill="#8B5CF6" name="Treated Water" />
                  <Bar yAxisId="left" dataKey="tseWater" fill="#10B981" name="TSE Water" />
                </>
              )}
              {showDetails && (
                <Bar yAxisId="right" dataKey="efficiency" fill="#ff7300" name="Efficiency %" type="monotone" />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

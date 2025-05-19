"use client"

import { useMemo } from "react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts"
import type { STPData } from "../../hooks/use-stp-data"
import { ensureNumber } from "../../hooks/use-stp-data"

interface WaterQualityMatrixProps {
  data: STPData[]
  type?: "radar" | "trends" | "compliance"
}

export function WaterQualityMatrix({ data, type = "radar" }: WaterQualityMatrixProps) {
  // Generate synthetic quality data since we don't have real quality metrics
  const qualityData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Calculate efficiency as a base for quality metrics
    const efficiencies = data.map((item) => {
      const inlet = ensureNumber(item.totalInletSewage)
      const treated = ensureNumber(item.totalTreatedWater)
      return inlet > 0 ? (treated / inlet) * 100 : 0
    })

    const avgEfficiency = efficiencies.reduce((sum, val) => sum + val, 0) / efficiencies.length

    // Generate synthetic quality metrics based on efficiency
    // In a real implementation, these would come from actual water quality tests
    return [
      {
        parameter: "pH",
        value: 7.2,
        standard: 7.0,
        compliance: 100,
        fullMark: 100,
      },
      {
        parameter: "BOD",
        value: Math.max(10, 30 - avgEfficiency * 0.2),
        standard: 30,
        compliance: Math.min(100, (30 / Math.max(10, 30 - avgEfficiency * 0.2)) * 100),
        fullMark: 100,
      },
      {
        parameter: "COD",
        value: Math.max(50, 100 - avgEfficiency * 0.5),
        standard: 100,
        compliance: Math.min(100, (100 / Math.max(50, 100 - avgEfficiency * 0.5)) * 100),
        fullMark: 100,
      },
      {
        parameter: "TSS",
        value: Math.max(20, 50 - avgEfficiency * 0.3),
        standard: 50,
        compliance: Math.min(100, (50 / Math.max(20, 50 - avgEfficiency * 0.3)) * 100),
        fullMark: 100,
      },
      {
        parameter: "TN",
        value: Math.max(5, 15 - avgEfficiency * 0.1),
        standard: 15,
        compliance: Math.min(100, (15 / Math.max(5, 15 - avgEfficiency * 0.1)) * 100),
        fullMark: 100,
      },
    ]
  }, [data])

  // Generate trend data
  const trendData = useMemo(() => {
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
          efficiency: 0,
          count: 0,
        }
      }

      const inlet = ensureNumber(item.totalInletSewage)
      const treated = ensureNumber(item.totalTreatedWater)
      const efficiency = inlet > 0 ? (treated / inlet) * 100 : 0

      weeklyData[weekKey].efficiency += efficiency
      weeklyData[weekKey].count += 1
    })

    // Convert to array and calculate averages
    const weeklyEfficiency = Object.values(weeklyData).map((week: any) => ({
      week: week.week,
      efficiency: week.efficiency / week.count,
      // Generate synthetic quality metrics based on efficiency
      pH: 7.0 + Math.random() * 0.5,
      BOD: Math.max(10, 30 - (week.efficiency / week.count) * 0.2),
      COD: Math.max(50, 100 - (week.efficiency / week.count) * 0.5),
    }))

    return weeklyEfficiency
  }, [data])

  if (type === "trends") {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
            <YAxis
              yAxisId="left"
              orientation="left"
              label={{
                value: "Concentration (mg/L)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[6.5, 8.0]}
              label={{
                value: "pH",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              formatter={(value, name) => {
                if (name === "pH") return [value.toFixed(1), name]
                return [`${value.toFixed(1)} mg/L`, name]
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
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="BOD"
              stroke="#8884d8"
              name="BOD"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="COD"
              stroke="#82ca9d"
              name="COD"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="pH"
              stroke="#ff7300"
              name="pH"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === "compliance") {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={qualityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              domain={[0, 100]}
              label={{
                value: "Compliance %",
                position: "insideBottom",
                offset: -10,
                style: { textAnchor: "middle" },
              }}
            />
            <YAxis dataKey="parameter" type="category" tick={{ fontSize: 12 }} />
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
            <Bar
              dataKey="compliance"
              name="Compliance"
              fill={(entry) => {
                if (entry.compliance >= 90) return "#10B981"
                if (entry.compliance >= 75) return "#F59E0B"
                return "#EF4444"
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={qualityData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="parameter" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar name="Quality Compliance" dataKey="compliance" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
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
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

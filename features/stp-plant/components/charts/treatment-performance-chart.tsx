"use client"

import { useMemo } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { STPData } from "../../hooks/use-stp-data"
import { ensureNumber } from "../../hooks/use-stp-data"

interface TreatmentPerformanceChartProps {
  data: STPData[]
}

export function TreatmentPerformanceChart({ data }: TreatmentPerformanceChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Sort data by date
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate metrics
    return sortedData.map((item) => {
      const totalInlet = ensureNumber(item.totalInletSewage)
      const totalTreated = ensureNumber(item.totalTreatedWater)
      const totalTSE = ensureNumber(item.totalTSEWater)

      return {
        date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        inflow: totalInlet,
        treated: totalTreated,
        irrigation: totalTSE,
        treatmentLoss: Math.max(0, totalInlet - totalTreated),
        distributionLoss: Math.max(0, totalTreated - totalTSE),
      }
    })
  }, [data])

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
          <YAxis
            label={{
              value: "Volume (m³)",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
          <Tooltip
            formatter={(value) => `${value.toLocaleString()} m³`}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "0.375rem",
              padding: "8px 12px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            }}
          />
          <Legend />
          <Area type="monotone" dataKey="inflow" stackId="1" stroke="#8ACCD5" fill="#8ACCD5" name="Total Inflow" />
          <Area type="monotone" dataKey="treated" stackId="2" stroke="#8B5CF6" fill="#8B5CF6" name="Treated Water" />
          <Area
            type="monotone"
            dataKey="irrigation"
            stackId="3"
            stroke="#10B981"
            fill="#10B981"
            name="Irrigation Output"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

"use client"

import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
  ScatterChart,
  ZAxis,
  Brush,
} from "recharts"
import type { STPData } from "../../hooks/use-stp-data"
import { ensureNumber } from "../../hooks/use-stp-data"

interface EfficiencyTrendChartProps {
  data: STPData[]
  showDetails?: boolean
}

export function EfficiencyTrendChart({ data, showDetails = false }: EfficiencyTrendChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Sort data by date
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate efficiency and other metrics
    return sortedData.map((item) => {
      const totalInlet = ensureNumber(item.totalInletSewage)
      const totalTreated = ensureNumber(item.totalTreatedWater)
      const totalTSE = ensureNumber(item.totalTSEWater)

      const efficiency = totalInlet > 0 ? (totalTreated / totalInlet) * 100 : 0
      const treatmentRatio = totalTreated > 0 ? (totalTSE / totalTreated) * 100 : 0
      const tankerPercentage = totalInlet > 0 ? (ensureNumber(item.expectedTankerVolume) / totalInlet) * 100 : 0

      return {
        date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        efficiency,
        treatmentRatio,
        tankerPercentage,
        totalInlet,
        totalTreated,
        totalTSE,
      }
    })
  }, [data])

  // Calculate average efficiency
  const avgEfficiency = useMemo(() => {
    if (!chartData.length) return 0
    return chartData.reduce((sum, item) => sum + item.efficiency, 0) / chartData.length
  }, [chartData])

  // Calculate average treatment ratio
  const avgTreatmentRatio = useMemo(() => {
    if (!chartData.length) return 0
    return chartData.reduce((sum, item) => sum + item.treatmentRatio, 0) / chartData.length
  }, [chartData])

  // Calculate correlation data for scatter plot
  const correlationData = useMemo(() => {
    if (!showDetails || !chartData.length) return []

    return chartData.map((item) => ({
      x: item.tankerPercentage,
      y: item.efficiency,
      z: item.totalInlet / 100, // Size based on total inlet
      name: item.date,
    }))
  }, [chartData, showDetails])

  return (
    <div className="h-80">
      {!showDetails ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
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
            <ReferenceLine
              y={avgEfficiency}
              stroke="#8884d8"
              strokeDasharray="3 3"
              label={{
                value: `Avg: ${avgEfficiency.toFixed(1)}%`,
                position: "insideBottomRight",
                fill: "#8884d8",
              }}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#8884d8"
              name="Treatment Efficiency"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="treatmentRatio"
              stroke="#82ca9d"
              name="TSE to Irrigation Ratio"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
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
              <ReferenceLine y={avgEfficiency} stroke="#8884d8" strokeDasharray="3 3" />
              <ReferenceLine y={avgTreatmentRatio} stroke="#82ca9d" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#8884d8"
                name="Treatment Efficiency"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="treatmentRatio"
                stroke="#82ca9d"
                name="TSE to Irrigation Ratio"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="tankerPercentage"
                stroke="#ff7300"
                name="Tanker Percentage"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Brush dataKey="date" height={30} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                dataKey="x"
                name="Tanker Percentage"
                domain={[0, 100]}
                label={{
                  value: "Tanker Percentage %",
                  position: "insideBottom",
                  offset: -10,
                  style: { textAnchor: "middle" },
                }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Efficiency"
                domain={[0, 100]}
                label={{
                  value: "Efficiency %",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle" },
                }}
              />
              <ZAxis type="number" dataKey="z" range={[50, 400]} name="Volume" />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "Tanker Percentage") return [`${value.toFixed(1)}%`, name]
                  if (name === "Efficiency") return [`${value.toFixed(1)}%`, name]
                  if (name === "Volume") return [`${(value * 100).toFixed(0)} m³`, "Total Inlet"]
                  return [value, name]
                }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.375rem",
                  padding: "8px 12px",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
                cursor={{ strokeDasharray: "3 3" }}
              />
              <Legend />
              <Scatter name="Efficiency vs Tanker %" data={correlationData} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

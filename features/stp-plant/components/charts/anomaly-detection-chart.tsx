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
  ComposedChart,
  Bar,
  BarChart,
} from "recharts"

interface AnomalyData {
  date: string
  efficiency: number
  movingAvg: number
  isAnomaly: boolean
}

interface AnomalyDetectionChartProps {
  data: AnomalyData[]
  type?: "line" | "boxplot" | "impact"
}

export function AnomalyDetectionChart({ data, type = "line" }: AnomalyDetectionChartProps) {
  // Calculate statistics for boxplot
  const stats = useMemo(() => {
    if (!data || data.length === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, mean: 0 }

    const efficiencies = data.map((item) => item.efficiency).sort((a, b) => a - b)
    const min = efficiencies[0]
    const max = efficiencies[efficiencies.length - 1]
    const q1 = efficiencies[Math.floor(efficiencies.length * 0.25)]
    const median = efficiencies[Math.floor(efficiencies.length * 0.5)]
    const q3 = efficiencies[Math.floor(efficiencies.length * 0.75)]
    const mean = efficiencies.reduce((sum, val) => sum + val, 0) / efficiencies.length

    return { min, q1, median, q3, max, mean }
  }, [data])

  // Calculate impact data
  const impactData = useMemo(() => {
    if (!data || data.length === 0) return []

    const anomalies = data.filter((item) => item.isAnomaly)
    const normal = data.filter((item) => !item.isAnomaly)

    const avgNormal = normal.reduce((sum, item) => sum + item.efficiency, 0) / normal.length
    const avgAnomaly =
      anomalies.length > 0 ? anomalies.reduce((sum, item) => sum + item.efficiency, 0) / anomalies.length : 0

    return [
      { name: "Normal Days", value: avgNormal },
      { name: "Anomaly Days", value: avgAnomaly },
      { name: "Impact", value: Math.abs(avgNormal - avgAnomaly) },
    ]
  }, [data])

  // Prepare data for boxplot visualization
  const boxplotData = useMemo(() => {
    return [
      { name: "Min", value: stats.min },
      { name: "Q1", value: stats.q1 },
      { name: "Median", value: stats.median },
      { name: "Q3", value: stats.q3 },
      { name: "Max", value: stats.max },
    ]
  }, [stats])

  if (type === "boxplot") {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={boxplotData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              domain={[0, 100]}
              label={{
                value: "Efficiency %",
                position: "insideBottom",
                offset: -10,
                style: { textAnchor: "middle" },
              }}
            />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} />
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
            <Bar dataKey="value" fill="#8884d8" name="Efficiency Distribution" barSize={20} />
            <ReferenceLine
              x={stats.mean}
              stroke="#ff7300"
              strokeDasharray="3 3"
              label={{
                value: `Mean: ${stats.mean.toFixed(1)}%`,
                position: "insideTopLeft",
                fill: "#ff7300",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === "impact") {
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={impactData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[0, 100]}
              label={{
                value: "Efficiency %",
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
            <Bar
              dataKey="value"
              name="Value"
              fill={(entry) => {
                if (entry.name === "Normal Days") return "#10B981"
                if (entry.name === "Anomaly Days") return "#EF4444"
                return "#F59E0B"
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
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
          <YAxis
            domain={[0, 100]}
            label={{
              value: "Efficiency %",
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
            dataKey="efficiency"
            stroke="#8884d8"
            name="Efficiency"
            strokeWidth={2}
            dot={(props) => {
              const { cx, cy, payload } = props
              if (payload.isAnomaly) {
                return <circle cx={cx} cy={cy} r={6} fill="#EF4444" stroke="#8884d8" strokeWidth={1} />
              }
              return <circle cx={cx} cy={cy} r={3} fill="#8884d8" />
            }}
          />
          <Line
            type="monotone"
            dataKey="movingAvg"
            stroke="#82ca9d"
            name="Moving Average"
            strokeWidth={2}
            strokeDasharray="3 3"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

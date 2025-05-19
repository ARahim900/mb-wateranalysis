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
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
} from "recharts"
import type { STPData } from "../../hooks/use-stp-data"
import { ensureNumber } from "../../hooks/use-stp-data"

interface OperationalInsightsChartProps {
  data: STPData[]
  showCorrelation?: boolean
}

export function OperationalInsightsChart({ data, showCorrelation = false }: OperationalInsightsChartProps) {
  // Calculate operational metrics
  const operationalData = useMemo(() => {
    if (!data || data.length === 0) return []

    // Calculate averages and normalize to 0-100 scale for radar chart
    const totalInlet = data.reduce((sum, item) => sum + ensureNumber(item.totalInletSewage), 0)
    const avgInlet = totalInlet / data.length
    const maxInlet = Math.max(...data.map((item) => ensureNumber(item.totalInletSewage)))

    const totalTreated = data.reduce((sum, item) => sum + ensureNumber(item.totalTreatedWater), 0)
    const avgTreated = totalTreated / data.length

    const totalTSE = data.reduce((sum, item) => sum + ensureNumber(item.totalTSEWater), 0)
    const avgTSE = totalTSE / data.length

    const avgEfficiency = (avgTreated / avgInlet) * 100

    const avgTankerCount = data.reduce((sum, item) => sum + ensureNumber(item.tankerTrips), 0) / data.length
    const maxTankerCount = Math.max(...data.map((item) => ensureNumber(item.tankerTrips)))

    const tankerPercentage =
      data.reduce((sum, item) => {
        const inlet = ensureNumber(item.totalInletSewage)
        const tanker = ensureNumber(item.expectedTankerVolume)
        return sum + (inlet > 0 ? (tanker / inlet) * 100 : 0)
      }, 0) / data.length

    // Normalize values to 0-100 scale
    return [
      {
        metric: "Efficiency",
        value: Math.min(100, avgEfficiency),
        fullMark: 100,
      },
      {
        metric: "Volume",
        value: (avgInlet / maxInlet) * 100,
        fullMark: 100,
      },
      {
        metric: "Treatment Ratio",
        value: Math.min(100, (avgTSE / avgTreated) * 100),
        fullMark: 100,
      },
      {
        metric: "Tanker Usage",
        value: (avgTankerCount / maxTankerCount) * 100,
        fullMark: 100,
      },
      {
        metric: "Direct Sewage",
        value: Math.min(100, 100 - tankerPercentage),
        fullMark: 100,
      },
    ]
  }, [data])

  // Calculate correlation data for scatter plot
  const correlationData = useMemo(() => {
    if (!showCorrelation || !data || data.length === 0) return []

    return data.map((item) => {
      const inlet = ensureNumber(item.totalInletSewage)
      const treated = ensureNumber(item.totalTreatedWater)
      const tankerVolume = ensureNumber(item.expectedTankerVolume)
      const tankerPercentage = inlet > 0 ? (tankerVolume / inlet) * 100 : 0
      const efficiency = inlet > 0 ? (treated / inlet) * 100 : 0

      return {
        x: tankerPercentage,
        y: efficiency,
        z: inlet / 100, // Size based on total inlet
        name: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }
    })
  }, [data, showCorrelation])

  return (
    <div className="h-80">
      {!showCorrelation ? (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={operationalData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="Operational Performance" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
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
      ) : (
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
      )}
    </div>
  )
}

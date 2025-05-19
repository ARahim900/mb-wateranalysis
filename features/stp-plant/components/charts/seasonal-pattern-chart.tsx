"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"

interface SeasonalData {
  month: string
  avgInflow: number
  avgTreated: number
  avgIrrigation: number
}

interface SeasonalPatternChartProps {
  data: SeasonalData[]
  type?: "monthly" | "weekly"
}

export function SeasonalPatternChart({ data, type = "monthly" }: SeasonalPatternChartProps) {
  // Transform data for weekly patterns if needed
  const chartData = useMemo(() => {
    if (type === "weekly") {
      // This is a placeholder for weekly data
      // In a real implementation, you would calculate day-of-week averages
      const weekdayData = [
        { day: "Mon", avgInflow: 520, avgTreated: 580, avgIrrigation: 500 },
        { day: "Tue", avgInflow: 540, avgTreated: 590, avgIrrigation: 510 },
        { day: "Wed", avgInflow: 510, avgTreated: 570, avgIrrigation: 490 },
        { day: "Thu", avgInflow: 530, avgTreated: 585, avgIrrigation: 505 },
        { day: "Fri", avgInflow: 550, avgTreated: 600, avgIrrigation: 520 },
        { day: "Sat", avgInflow: 480, avgTreated: 540, avgIrrigation: 470 },
        { day: "Sun", avgInflow: 460, avgTreated: 520, avgIrrigation: 450 },
      ]
      return weekdayData
    }
    return data
  }, [data, type])

  return (
    <div className="h-80">
      {type === "monthly" ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={type === "monthly" ? "month" : "day"} tick={{ fontSize: 12 }} />
            <YAxis
              label={{
                value: "Average Volume (m³)",
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
            <Bar dataKey="avgInflow" fill="#8ACCD5" name="Avg. Inflow" />
            <Bar dataKey="avgTreated" fill="#8B5CF6" name="Avg. Treated" />
            <Bar dataKey="avgIrrigation" fill="#10B981" name="Avg. Irrigation" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis
              label={{
                value: "Average Volume (m³)",
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
            <Line
              type="monotone"
              dataKey="avgInflow"
              stroke="#8ACCD5"
              name="Avg. Inflow"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="avgTreated"
              stroke="#8B5CF6"
              name="Avg. Treated"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="avgIrrigation"
              stroke="#10B981"
              name="Avg. Irrigation"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

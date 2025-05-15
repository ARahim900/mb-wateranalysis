import type React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts"

interface MonthlyData {
  month: string
  efficiency: number
  target: number
  flowRate: number
}

interface MonthlyEfficiencyChartProps {
  data: MonthlyData[]
  title?: string
}

export const MonthlyEfficiencyChart: React.FC<MonthlyEfficiencyChartProps> = ({
  data,
  title = "Efficiency Trends",
}) => {
  // Calculate average efficiency
  const avgEfficiency = data.reduce((sum, item) => sum + item.efficiency, 0) / data.length

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="month"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
              axisLine={{ stroke: "#e5e7eb" }}
              domain={[0, 100]}
              label={{
                value: "Efficiency (%)",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle", fill: "#6b7280", fontSize: 12 },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickLine={{ stroke: "#e5e7eb" }}
              axisLine={{ stroke: "#e5e7eb" }}
              label={{
                value: "Flow Rate (m³/day)",
                angle: 90,
                position: "insideRight",
                style: { textAnchor: "middle", fill: "#6b7280", fontSize: 12 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              }}
              formatter={(value, name) => {
                if (name === "Efficiency") return [`${value}%`, name]
                if (name === "Target") return [`${value}%`, name]
                if (name === "Flow Rate") return [`${value} m³/day`, name]
                return [value, name]
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
            <ReferenceLine
              y={avgEfficiency}
              yAxisId="left"
              label={{
                value: `Avg: ${avgEfficiency.toFixed(1)}%`,
                position: "insideBottomRight",
                fill: "#6b7280",
                fontSize: 12,
              }}
              stroke="#6b7280"
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              name="Efficiency"
              stroke="#8884d8"
              yAxisId="left"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#ff7300"
              yAxisId="left"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="flowRate"
              name="Flow Rate"
              stroke="#82ca9d"
              yAxisId="right"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-2 rounded bg-purple-50">
          <p className="text-xs text-gray-500">Avg. Efficiency</p>
          <p className="font-medium text-purple-600">{avgEfficiency.toFixed(1)}%</p>
        </div>
        <div className="text-center p-2 rounded bg-orange-50">
          <p className="text-xs text-gray-500">Avg. Target</p>
          <p className="font-medium text-orange-600">
            {(data.reduce((sum, item) => sum + item.target, 0) / data.length).toFixed(1)}%
          </p>
        </div>
        <div className="text-center p-2 rounded bg-green-50">
          <p className="text-xs text-gray-500">Avg. Flow Rate</p>
          <p className="font-medium text-green-600">
            {(data.reduce((sum, item) => sum + item.flowRate, 0) / data.length).toFixed(1)} m³/day
          </p>
        </div>
      </div>
    </div>
  )
}

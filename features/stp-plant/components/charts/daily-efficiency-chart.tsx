import type React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface DailyData {
  day: string
  efficiency: number
  flowRate: number
  qualityIndex: number
}

interface DailyEfficiencyChartProps {
  data: DailyData[]
  title?: string
}

export const DailyEfficiencyChart: React.FC<DailyEfficiencyChartProps> = ({
  data,
  title = "Daily Efficiency Analysis",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="day"
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
                if (name === "Flow Rate") return [`${value} m³/day`, name]
                if (name === "Quality Index") return [`${value}`, name]
                return [value, name]
              }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingTop: "10px" }} />
            <Area
              type="monotone"
              dataKey="efficiency"
              name="Efficiency"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorEfficiency)"
              yAxisId="left"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="flowRate"
              name="Flow Rate"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorFlow)"
              yAxisId="right"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="qualityIndex"
              name="Quality Index"
              stroke="#ffc658"
              fillOpacity={1}
              fill="url(#colorQuality)"
              yAxisId="left"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center p-2 rounded bg-purple-50">
          <p className="text-xs text-gray-500">Avg. Efficiency</p>
          <p className="font-medium text-purple-600">
            {(data.reduce((sum, item) => sum + item.efficiency, 0) / data.length).toFixed(1)}%
          </p>
        </div>
        <div className="text-center p-2 rounded bg-green-50">
          <p className="text-xs text-gray-500">Avg. Flow Rate</p>
          <p className="font-medium text-green-600">
            {(data.reduce((sum, item) => sum + item.flowRate, 0) / data.length).toFixed(1)} m³/day
          </p>
        </div>
        <div className="text-center p-2 rounded bg-yellow-50">
          <p className="text-xs text-gray-500">Avg. Quality</p>
          <p className="font-medium text-yellow-600">
            {(data.reduce((sum, item) => sum + item.qualityIndex, 0) / data.length).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  )
}

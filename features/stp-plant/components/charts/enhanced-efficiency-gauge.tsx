import type React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface EfficiencyGaugeProps {
  efficiency: number
  title?: string
}

export const EnhancedEfficiencyGauge: React.FC<EfficiencyGaugeProps> = ({
  efficiency,
  title = "Treatment Efficiency",
}) => {
  // Calculate the remaining percentage
  const remaining = 100 - efficiency

  const data = [
    { name: "Efficiency", value: efficiency },
    { name: "Remaining", value: remaining },
  ]

  // Determine color based on efficiency level
  const getEfficiencyColor = (value: number) => {
    if (value >= 90) return "#10b981" // Green for excellent
    if (value >= 75) return "#22c55e" // Light green for good
    if (value >= 60) return "#eab308" // Yellow for average
    if (value >= 40) return "#f97316" // Orange for below average
    return "#ef4444" // Red for poor
  }

  const efficiencyColor = getEfficiencyColor(efficiency)

  const COLORS = [efficiencyColor, "#f3f4f6"]

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)

    return (
      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      <div className="flex flex-col items-center">
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={180}
                endAngle={0}
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={0}
                dataKey="value"
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4">
          <span className="text-4xl font-bold" style={{ color: efficiencyColor }}>
            {efficiency}%
          </span>
          <p className="text-gray-500 mt-1">Current Efficiency</p>
        </div>
        <div className="w-full mt-4 grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded bg-red-50">
            <p className="text-xs text-gray-500">Poor</p>
            <p className="font-medium text-red-500">&lt;60%</p>
          </div>
          <div className="text-center p-2 rounded bg-yellow-50">
            <p className="text-xs text-gray-500">Average</p>
            <p className="font-medium text-yellow-500">60-80%</p>
          </div>
          <div className="text-center p-2 rounded bg-green-50">
            <p className="text-xs text-gray-500">Good</p>
            <p className="font-medium text-green-500">&gt;80%</p>
          </div>
        </div>
      </div>
    </div>
  )
}

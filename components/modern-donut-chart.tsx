"use client"

import { useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface DonutChartProps {
  data: {
    name: string
    value: number
    percentage: string | number
  }[]
  colors: string[]
  title: string
  innerRadius?: number
  outerRadius?: number
  paddingAngle?: number
}

export default function ModernDonutChart({
  data,
  colors,
  title,
  innerRadius = 60,
  outerRadius = 80,
  paddingAngle = 4,
}: DonutChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  // Calculate total for percentage
  const total = data.reduce((sum, entry) => sum + entry.value, 0)

  // Format data with percentages
  const chartData = data.map((item) => ({
    ...item,
    percentage: typeof item.percentage === "string" ? Number.parseFloat(item.percentage) : item.percentage,
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="font-medium text-gray-800">{payload[0].name}</p>
          <p className="text-sm text-gray-600">
            {payload[0].value.toLocaleString()} m³ ({payload[0].payload.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="flex-1 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={paddingAngle}
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                  opacity={activeIndex === null || activeIndex === index ? 1 : 0.7}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text - can be customized */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="w-3 h-3 bg-gray-300 rounded-full mx-auto mb-1"></div>
          </div>
        </div>
      </div>

      {/* Legend below chart */}
      <div className="mt-6 flex flex-col items-center">
        <div className="flex items-center justify-center gap-8 mb-4">
          {chartData.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-sm text-gray-600">{entry.name}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-8">
          {chartData.map((entry, index) => (
            <div key={`stat-${index}`} className="text-center">
              <p className="text-2xl font-bold" style={{ color: colors[index % colors.length] }}>
                {entry.percentage}%
              </p>
              <p className="text-sm text-gray-500">{entry.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart } from "@/components/ui/charts"

interface DailyData {
  day: string
  efficiency: number
  flowRate: number
  qualityIndex: number
}

interface DailyEfficiencyChartProps {
  data: DailyData[]
}

export function DailyEfficiencyChart({ data }: DailyEfficiencyChartProps) {
  // Process data for chart
  const chartData = data.map((item) => ({
    day: `Day ${item.day}`,
    Efficiency: item.efficiency,
    "Flow Rate": item.flowRate / 10, // Scaled down to fit on same chart
    "Quality Index": item.qualityIndex * 10, // Scaled up to fit on same chart
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Daily Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <AreaChart
            data={chartData}
            index="day"
            categories={["Efficiency", "Flow Rate", "Quality Index"]}
            colors={["#10b981", "#3b82f6", "#f59e0b"]}
            valueFormatter={(value, category) => {
              if (category === "Efficiency") return `${value.toFixed(1)}%`
              if (category === "Flow Rate") return `${(value * 10).toFixed(0)} m³`
              if (category === "Quality Index") return `${(value / 10).toFixed(1)}`
              return value.toString()
            }}
            yAxisWidth={60}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="font-medium">Average Efficiency</div>
            <div className="text-2xl font-bold text-emerald-600">
              {(data.reduce((sum, item) => sum + item.efficiency, 0) / data.length).toFixed(1)}%
            </div>
          </div>
          <div>
            <div className="font-medium">Average Flow</div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(data.reduce((sum, item) => sum + item.flowRate, 0) / data.length)} m³
            </div>
          </div>
          <div>
            <div className="font-medium">Avg Quality Index</div>
            <div className="text-2xl font-bold text-amber-600">
              {(data.reduce((sum, item) => sum + item.qualityIndex, 0) / data.length).toFixed(1)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

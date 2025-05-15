"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart } from "@/components/ui/charts"

interface MonthlyData {
  month: string
  efficiency: number
  target: number
  flowRate: number
}

interface MonthlyEfficiencyChartProps {
  data: MonthlyData[]
}

export function MonthlyEfficiencyChart({ data }: MonthlyEfficiencyChartProps) {
  // Calculate stats
  const latestMonth = data[data.length - 1] || { month: "Unknown", efficiency: 0, target: 0, flowRate: 0 }
  const previousMonth = data[data.length - 2] || { month: "Unknown", efficiency: 0, target: 0, flowRate: 0 }
  
  const efficiencyChange = previousMonth.efficiency
    ? ((latestMonth.efficiency - previousMonth.efficiency) / previousMonth.efficiency) * 100
    : 0
  
  const flowRateChange = previousMonth.flowRate
    ? ((latestMonth.flowRate - previousMonth.flowRate) / previousMonth.flowRate) * 100
    : 0

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Monthly Efficiency Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <LineChart 
                data={data}
                index="month"
                categories={["efficiency", "target"]}
                colors={["#10b981", "#f59e0b"]}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                yAxisWidth={60}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <div className="text-sm text-gray-500">Current Efficiency</div>
                <div className="text-2xl font-bold text-emerald-600">
                  {latestMonth.efficiency.toFixed(1)}%
                </div>
                <div className={`text-sm ${efficiencyChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {efficiencyChange >= 0 ? '↑' : '↓'} {Math.abs(efficiencyChange).toFixed(1)}% from previous month
                </div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-sm text-gray-500">Target Efficiency</div>
                <div className="text-2xl font-bold text-amber-600">
                  {latestMonth.target.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">
                  {latestMonth.efficiency >= latestMonth.target 
                    ? '✓ Target achieved' 
                    : `${(latestMonth.target - latestMonth.efficiency).toFixed(1)}% below target`}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Monthly Flow Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart 
                data={data}
                index="month"
                categories={["flowRate"]}
                colors={["#3b82f6"]}
                valueFormatter={(value) => `${value.toFixed(0)} m³`}
                yAxisWidth={60}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-3">
                <div className="text-sm text-gray-500">Current Avg Daily Flow</div>
                <div className="text-2xl font-bold text-blue-600">
                  {latestMonth.flowRate.toFixed(0)} m³
                </div>
                <div className={`text-sm ${flowRateChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {flowRateChange >= 0 ? '↑' : '↓'} {Math.abs(flowRateChange).toFixed(1)}% from previous month
                </div>
              </div>
              <div className="border rounded-lg p-3">
                <div className="text-sm text-gray-500">Plant Capacity Usage</div>
                <div className="text-2xl font-bold text-gray-700">
                  {((latestMonth.flowRate / 750) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">
                  of 750 m³/day design capacity
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Monthly Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Month</th>
                  <th className="text-right py-2">Avg. Daily Flow (m³)</th>
                  <th className="text-right py-2">Efficiency (%)</th>
                  <th className="text-right py-2">Target Met</th>
                </tr>
              </thead>
              <tbody>
                {data.slice(-6).map((month, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{month.month}</td>
                    <td className="text-right py-2">{month.flowRate.toFixed(0)}</td>
                    <td className="text-right py-2">{month.efficiency.toFixed(1)}%</td>
                    <td className="text-right py-2">
                      {month.efficiency >= month.target ? (
                        <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">Yes</span>
                      ) : (
                        <span className="inline-block px-2 py-1 bg-amber-100 text-amber-700 rounded-full">No</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

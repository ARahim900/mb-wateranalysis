import type React from "react"
import { Activity, Droplets, Filter, Gauge, BarChart3, Percent } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  unit: string
  change: number
  icon: "treatment" | "flow" | "utilization" | "efficiency" | "quality"
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, unit, change, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case "treatment":
        return <Filter className="h-6 w-6 text-emerald-500" />
      case "flow":
        return <Droplets className="h-6 w-6 text-blue-500" />
      case "utilization":
        return <Gauge className="h-6 w-6 text-amber-500" />
      case "efficiency":
        return <Percent className="h-6 w-6 text-violet-500" />
      case "quality":
        return <Activity className="h-6 w-6 text-rose-500" />
      default:
        return <BarChart3 className="h-6 w-6 text-gray-500" />
    }
  }

  const isPositiveChange = change >= 0
  const changeColor = isPositiveChange ? "text-green-500" : "text-red-500"
  const changeArrow = isPositiveChange ? "↑" : "↓"
  const changeAbs = Math.abs(change)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-3xl font-semibold text-gray-800">{value}</p>
            <span className="ml-1 text-sm text-gray-500">{unit}</span>
          </div>
        </div>
        <div className="p-2 rounded-full bg-gray-50">{getIcon()}</div>
      </div>
      <div className="mt-4">
        <span className={`inline-flex items-center ${changeColor}`}>
          {changeArrow} {changeAbs.toFixed(1)}%
        </span>
        <span className="ml-1 text-xs text-gray-500">vs previous month</span>
      </div>
    </div>
  )
}

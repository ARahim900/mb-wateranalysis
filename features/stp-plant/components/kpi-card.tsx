import { ArrowDown, ArrowUp, BarChart, Droplets, Gauge, LineChart } from "lucide-react"

interface KPICardProps {
  title: string
  value: number
  unit: string
  change: number
  icon: "flow" | "efficiency" | "utilization" | "quality"
}

export function KPICard({ title, value, unit, change, icon }: KPICardProps) {
  const formatValue = (val: number): string => {
    if (val >= 1000) {
      return (val / 1000).toFixed(1) + "k"
    }
    return val.toLocaleString()
  }

  const getIcon = () => {
    switch (icon) {
      case "flow":
        return <Droplets className="h-5 w-5 text-blue-500" />
      case "efficiency":
        return <Gauge className="h-5 w-5 text-green-500" />
      case "utilization":
        return <BarChart className="h-5 w-5 text-amber-500" />
      case "quality":
        return <LineChart className="h-5 w-5 text-purple-500" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-medium text-gray-500">{title}</h3>
        {getIcon()}
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-800">{formatValue(value)}</span>
        {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center">
        {change > 0 ? (
          <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${change > 0 ? "text-green-500" : "text-red-500"}`}>
          {Math.abs(change).toFixed(1)}%
        </span>
        <span className="text-xs text-gray-500 ml-1">vs previous month</span>
      </div>
    </div>
  )
}

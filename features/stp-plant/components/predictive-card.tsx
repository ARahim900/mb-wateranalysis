import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface PredictiveCardProps {
  title: string
  current: number
  predicted: number
  unit: string
  description: string
  trend: "up" | "down" | "stable"
  timeframe: string
}

export default function PredictiveCard({
  title,
  current,
  predicted,
  unit,
  description,
  trend,
  timeframe
}: PredictiveCardProps) {
  // Calculate percent change
  const difference = predicted - current
  const percentChange = Math.abs(Math.round((difference / current) * 100))
  
  // Format numbers for display
  const formatValue = (value: number) => {
    if (value >= 1000000) return (value / 1000000).toFixed(1) + "M"
    if (value >= 1000) return (value / 1000).toFixed(1) + "K"
    return value.toLocaleString()
  }
  
  // Calculate progress bar value - normalized between 0-100
  const progressValue = Math.max(0, Math.min(100, (predicted / (current * 1.5)) * 100))
  
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="text-2xl font-bold">{formatValue(current)}</span>
              <span className="text-sm ml-1">{unit}</span>
              <p className="text-xs text-gray-500 mt-1">Current</p>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end">
                <span className="text-2xl font-bold">{formatValue(predicted)}</span>
                <span className="text-sm ml-1">{unit}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Predicted</p>
            </div>
          </div>
          
          <Progress value={progressValue} className="h-2" />
          
          <div className="flex justify-between">
            <div className="flex items-center">
              {trend === "up" ? (
                <ArrowUp className="h-4 w-4 mr-1 text-emerald-500" />
              ) : trend === "down" ? (
                <ArrowDown className="h-4 w-4 mr-1 text-red-500" />
              ) : null}
              <span className={`text-sm font-medium ${
                trend === "up" 
                  ? "text-emerald-500" 
                  : trend === "down" 
                  ? "text-red-500" 
                  : "text-gray-500"
              }`}>
                {percentChange}%
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>{timeframe}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
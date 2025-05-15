"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface EnhancedEfficiencyGaugeProps {
  efficiency: number
}

export function EnhancedEfficiencyGauge({ efficiency }: EnhancedEfficiencyGaugeProps) {
  // Calculate the stroke-dasharray percentage for the SVG circle
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = `${(efficiency / 100) * circumference} ${circumference}`
  
  // Determine color based on efficiency
  const getColor = () => {
    if (efficiency >= 85) return "#10b981" // emerald/green for high efficiency
    if (efficiency >= 70) return "#f59e0b" // amber/yellow for medium efficiency
    return "#ef4444" // red for low efficiency
  }

  // Get label text based on efficiency
  const getLabel = () => {
    if (efficiency >= 85) return "Excellent"
    if (efficiency >= 70) return "Good"
    if (efficiency >= 50) return "Fair"
    return "Poor"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Treatment Efficiency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={getColor()}
                strokeWidth="10"
                strokeDasharray={strokeDasharray}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold" style={{ color: getColor() }}>{efficiency}%</span>
              <span className="text-gray-500 text-sm">{getLabel()}</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-500 mt-1">
              Treatment efficiency measures how effectively the plant converts raw sewage into treated water. Target: 85%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

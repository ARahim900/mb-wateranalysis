"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"
import type { MonthlyAggregate } from "../../utils/data-parser"

interface EfficiencyGaugeChartProps {
  data: MonthlyAggregate | null
  title: string
  value: number | null
  maxValue?: number
  change?: number | null
  colorScheme?: [string, string, string]
}

export function EfficiencyGaugeChart({
  data,
  title,
  value,
  maxValue = 100,
  change,
  colorScheme = ["#FF6B6B", "#FFB347", "#50C878"],
}: EfficiencyGaugeChartProps) {
  const gaugeValue = useMemo(() => {
    if (value === null) return 0
    return Math.min(Math.max(value, 0), maxValue)
  }, [value, maxValue])

  const gaugeColor = useMemo(() => {
    if (value === null) return colorScheme[1]

    const percentage = (value / maxValue) * 100
    if (percentage < 70) return colorScheme[0]
    if (percentage < 90) return colorScheme[1]
    return colorScheme[2]
  }, [value, maxValue, colorScheme])

  const rotation = useMemo(() => {
    if (value === null) return 0
    return (value / maxValue) * 180
  }, [value, maxValue])

  if (!data) return null

  return (
    <Card>
      <CardContent className="p-6">
        <SectionHeader title={title} />
        <div className="flex flex-col items-center justify-center h-64">
          <div className="relative w-48 h-24 overflow-hidden">
            {/* Gauge background */}
            <div className="absolute w-full h-full bg-gray-200 rounded-t-full"></div>

            {/* Gauge fill */}
            <div
              className="absolute w-full h-full rounded-t-full transition-all duration-1000 ease-in-out"
              style={{
                backgroundColor: gaugeColor,
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "bottom center",
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                opacity: 0.8,
              }}
            ></div>

            {/* Gauge center point */}
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>

            {/* Gauge needle */}
            <div
              className="absolute bottom-0 left-1/2 w-1 h-24 bg-gray-800 transition-all duration-1000 ease-in-out"
              style={{
                transformOrigin: "bottom center",
                transform: `translateX(-50%) rotate(${rotation}deg)`,
              }}
            ></div>
          </div>

          {/* Value display */}
          <div className="mt-8 text-center">
            <div className="text-4xl font-bold" style={{ color: gaugeColor }}>
              {value !== null ? value.toFixed(1) : "-"}%
            </div>
            {change !== null && (
              <div className={`text-sm mt-1 ${change >= 0 ? "text-green-500" : "text-red-500"}`}>
                {change >= 0 ? "↑" : "↓"} {Math.abs(change).toFixed(1)}% from previous month
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

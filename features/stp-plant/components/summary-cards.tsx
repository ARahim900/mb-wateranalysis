"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { MonthlyAggregate } from "../utils/data-parser"

interface SummaryCardsProps {
  data: MonthlyAggregate | null
  changes: {
    totalInletSewage: number
    totalTreatedWater: number
    totalIrrigationOutput: number
    avgEfficiency: number
    avgUtilizationRate: number
  } | null
}

export function SummaryCards({ data, changes }: SummaryCardsProps) {
  if (!data) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-[#4E4456] to-[#8A7A94] text-white">
        <CardContent className="p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider text-white/80">Total Inlet Sewage</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold">{data.totalInletSewage.toLocaleString()}</p>
            <p className="ml-2 text-sm text-white/80">m³</p>
          </div>
          {changes && (
            <div className="mt-3 flex items-center">
              <span
                className={`text-xs font-medium ${changes.totalInletSewage >= 0 ? "text-green-300" : "text-red-300"}`}
              >
                {changes.totalInletSewage >= 0 ? "↑" : "↓"} {Math.abs(changes.totalInletSewage)}%
              </span>
              <span className="text-white/60 text-xs ml-2">vs previous month</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#8ACCD5] to-[#5BC0DE] text-white">
        <CardContent className="p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider text-white/80">Total Treated Water</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold">{data.totalTreatedWater.toLocaleString()}</p>
            <p className="ml-2 text-sm text-white/80">m³</p>
          </div>
          {changes && (
            <div className="mt-3 flex items-center">
              <span
                className={`text-xs font-medium ${changes.totalTreatedWater >= 0 ? "text-green-300" : "text-red-300"}`}
              >
                {changes.totalTreatedWater >= 0 ? "↑" : "↓"} {Math.abs(changes.totalTreatedWater)}%
              </span>
              <span className="text-white/60 text-xs ml-2">vs previous month</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#50C878] to-[#3CB371] text-white">
        <CardContent className="p-5">
          <h3 className="text-sm font-medium uppercase tracking-wider text-white/80">Irrigation Output</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold">{data.totalIrrigationOutput.toLocaleString()}</p>
            <p className="ml-2 text-sm text-white/80">m³</p>
          </div>
          {changes && (
            <div className="mt-3 flex items-center">
              <span
                className={`text-xs font-medium ${changes.totalIrrigationOutput >= 0 ? "text-green-300" : "text-red-300"}`}
              >
                {changes.totalIrrigationOutput >= 0 ? "↑" : "↓"} {Math.abs(changes.totalIrrigationOutput)}%
              </span>
              <span className="text-white/60 text-xs ml-2">vs previous month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

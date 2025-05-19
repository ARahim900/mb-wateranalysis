import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: number | string
  unit?: string
  change?: number | string
  changeLabel?: string
  gradient: string
  className?: string
  icon?: React.ReactNode
}

export function KPICard({ title, value, unit, change, changeLabel, gradient, className, icon }: KPICardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="h-2" style={{ background: gradient }} aria-hidden="true"></div>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">{title}</h3>
          {icon && (
            <span className="text-gray-400" aria-hidden="true">
              {icon}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-baseline">
          <p className="text-3xl font-bold" style={{ color: "#4E4456" }}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {unit && <p className="ml-2 text-sm text-gray-500">{unit}</p>}
        </div>
        {change !== undefined && (
          <div className="mt-3 flex items-center">
            <span
              className={`text-xs font-medium ${
                Number.parseFloat(change.toString()) >= 0 ? "text-green-500" : "text-red-500"
              }`}
              aria-label={`${
                Number.parseFloat(change.toString()) >= 0 ? "Increased by" : "Decreased by"
              } ${Math.abs(Number.parseFloat(change.toString()))}%`}
            >
              {Number.parseFloat(change.toString()) >= 0 ? "↑" : "↓"} {Math.abs(Number.parseFloat(change.toString()))}%
            </span>
            <span className="text-gray-400 text-xs ml-2">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

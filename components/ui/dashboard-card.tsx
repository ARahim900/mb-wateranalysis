import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DashboardCardProps {
  title: string
  value: string | number
  unit?: string
  change?: string | number
  changeLabel?: string
  icon?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

export function DashboardCard({
  title,
  value,
  unit,
  change,
  changeLabel = "vs previous month",
  icon,
  className,
  children,
}: DashboardCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">{title}</h3>
          {icon && <span className="text-gray-400">{icon}</span>}
        </div>
        <div className="mt-2 flex items-baseline">
          <p className="text-3xl font-bold text-[#4E4456]">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {unit && <p className="ml-2 text-sm text-gray-500">{unit}</p>}
        </div>
        {change !== undefined && (
          <div className="mt-3 flex items-center">
            <span className={`text-xs font-medium ${Number(change) >= 0 ? "text-green-500" : "text-red-500"}`}>
              {Number(change) >= 0 ? "↑" : "↓"} {Math.abs(Number(change))}%
            </span>
            <span className="text-gray-400 text-xs ml-2">{changeLabel}</span>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, DropletIcon, FilterIcon, GaugeIcon, PercentIcon } from "lucide-react"
import { SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR } from "@/lib/theme-constants"

interface PerformanceScorecardProps {
  kpis: {
    totalInflow: number
    totalTreated: number
    totalIrrigation: number
    avgEfficiency: number
    treatmentRatio: number
    waterLoss: number
    tankerPercentage: number
    directPercentage: number
  }
}

export function PerformanceScorecard({ kpis }: PerformanceScorecardProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 })
  }

  const formatPercent = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 1 }) + "%"
  }

  // Determine efficiency status
  const getEfficiencyStatus = (efficiency: number) => {
    if (efficiency >= 90) return { color: SUCCESS_COLOR, icon: <ArrowUpIcon className="h-4 w-4" />, text: "Excellent" }
    if (efficiency >= 80) return { color: SUCCESS_COLOR, icon: <ArrowUpIcon className="h-4 w-4" />, text: "Good" }
    if (efficiency >= 70) return { color: WARNING_COLOR, icon: <ArrowUpIcon className="h-4 w-4" />, text: "Average" }
    return { color: DANGER_COLOR, icon: <ArrowDownIcon className="h-4 w-4" />, text: "Poor" }
  }

  const efficiencyStatus = getEfficiencyStatus(kpis.avgEfficiency)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-[#8ACCD5]/10 to-[#8ACCD5]/20 shadow-sm border border-[#8ACCD5]/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#8ACCD5]/20 rounded-full">
                <DropletIcon className="h-5 w-5 text-[#8ACCD5]" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Inflow</p>
                <h3 className="text-2xl font-bold text-[#4E4456]">{formatNumber(kpis.totalInflow)} m³</h3>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Source Split</div>
              <div className="text-sm font-medium">
                <span className="text-[#4E4456]">{formatPercent(kpis.tankerPercentage)}</span> /
                <span className="text-[#8ACCD5]">{formatPercent(kpis.directPercentage)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#4E4456]/10 to-[#4E4456]/20 shadow-sm border border-[#4E4456]/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#4E4456]/20 rounded-full">
                <FilterIcon className="h-5 w-5 text-[#4E4456]" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Treated Water</p>
                <h3 className="text-2xl font-bold text-[#4E4456]">{formatNumber(kpis.totalTreated)} m³</h3>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">For Irrigation</div>
              <div className="text-sm font-medium text-[#4E4456]">{formatNumber(kpis.totalIrrigation)} m³</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#50C878]/10 to-[#50C878]/20 shadow-sm border border-[#50C878]/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#50C878]/20 rounded-full">
                <GaugeIcon className="h-5 w-5 text-[#50C878]" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                <h3 className="text-2xl font-bold text-[#4E4456]">{formatPercent(kpis.avgEfficiency)}</h3>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Status</div>
              <div
                className={`text-sm font-medium flex items-center justify-end`}
                style={{ color: efficiencyStatus.color }}
              >
                {efficiencyStatus.text}
                {efficiencyStatus.icon}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-[#FFB347]/10 to-[#FFB347]/20 shadow-sm border border-[#FFB347]/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#FFB347]/20 rounded-full">
                <PercentIcon className="h-5 w-5 text-[#FFB347]" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Treatment Ratio</p>
                <h3 className="text-2xl font-bold text-[#4E4456]">{formatPercent(kpis.treatmentRatio)}</h3>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Water Loss</div>
              <div className="text-sm font-medium text-[#FFB347]">{formatNumber(kpis.waterLoss)} m³</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

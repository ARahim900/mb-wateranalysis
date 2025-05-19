"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStpData } from "../hooks/use-stp-data"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SectionHeader } from "@/components/ui/section-header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExportButton } from "@/components/ui/export-button"
import { exportToCSV } from "@/lib/export-utils"
import { useToast } from "@/hooks/use-toast"
import { WaterFlowSankey } from "./charts/water-flow-sankey"
import { EfficiencyTrendChart } from "./charts/efficiency-trend-chart"
import { WaterBalanceChart } from "./charts/water-balance-chart"
import { TreatmentPerformanceChart } from "./charts/treatment-performance-chart"
import { SeasonalPatternChart } from "./charts/seasonal-pattern-chart"
import { OperationalInsightsChart } from "./charts/operational-insights-chart"
import { WaterQualityMatrix } from "./charts/water-quality-matrix"
import { TreatmentEfficiencyGauge } from "./charts/treatment-efficiency-gauge"
import { SourceDistributionChart } from "./charts/source-distribution-chart"
import { AnomalyDetectionChart } from "./charts/anomaly-detection-chart"
import { PerformanceScorecard } from "./performance-scorecard"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Download, Filter, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ensureNumber } from "../hooks/use-stp-data"

export default function StpPlantDashboard() {
  const { data, isLoading, error, selectedMonth, setSelectedMonth, availableMonths, summary } = useStpData()
  const [selectedTab, setSelectedTab] = useState("overview")
  const [timeRange, setTimeRange] = useState([0, 100])
  const [showFilters, setShowFilters] = useState(false)
  const { addToast } = useToast()

  // Calculate the date range for the selected time range
  const dateRange = useMemo(() => {
    if (!data.length) return { start: "", end: "" }

    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const startIndex = Math.floor(sortedData.length * (timeRange[0] / 100))
    const endIndex = Math.floor(sortedData.length * (timeRange[1] / 100))

    const startDate = new Date(sortedData[startIndex]?.date || sortedData[0]?.date)
    const endDate = new Date(sortedData[endIndex]?.date || sortedData[sortedData.length - 1]?.date)

    return {
      start: startDate.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
      end: endDate.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
    }
  }, [data, timeRange])

  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (!data.length) return []

    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const startIndex = Math.floor(sortedData.length * (timeRange[0] / 100))
    const endIndex = Math.floor(sortedData.length * (timeRange[1] / 100))

    return sortedData.slice(startIndex, endIndex + 1)
  }, [data, timeRange])

  // Calculate KPIs
  const kpis = useMemo(() => {
    if (!filteredData.length)
      return {
        totalInflow: 0,
        totalTreated: 0,
        totalIrrigation: 0,
        avgEfficiency: 0,
        treatmentRatio: 0,
        waterLoss: 0,
        tankerPercentage: 0,
        directPercentage: 0,
      }

    const totalInflow = filteredData.reduce((sum, item) => sum + ensureNumber(item.totalInletSewage), 0)
    const totalTreated = filteredData.reduce((sum, item) => sum + ensureNumber(item.totalTreatedWater), 0)
    const totalIrrigation = filteredData.reduce((sum, item) => sum + ensureNumber(item.totalTSEWater), 0)
    const totalTanker = filteredData.reduce((sum, item) => sum + ensureNumber(item.expectedTankerVolume), 0)
    const totalDirect = filteredData.reduce((sum, item) => sum + ensureNumber(item.directInlineSewage), 0)

    const avgEfficiency = totalInflow > 0 ? (totalTreated / totalInflow) * 100 : 0
    const treatmentRatio = totalTreated > 0 ? (totalIrrigation / totalTreated) * 100 : 0
    const waterLoss = totalTreated - totalIrrigation
    const tankerPercentage = totalInflow > 0 ? (totalTanker / totalInflow) * 100 : 0
    const directPercentage = totalInflow > 0 ? (totalDirect / totalInflow) * 100 : 0

    return {
      totalInflow,
      totalTreated,
      totalIrrigation,
      avgEfficiency,
      treatmentRatio,
      waterLoss,
      tankerPercentage,
      directPercentage,
    }
  }, [filteredData])

  // Prepare data for anomaly detection
  const anomalyData = useMemo(() => {
    if (!filteredData.length) return []

    // Calculate moving average for efficiency
    const windowSize = 7
    const efficiencyData = filteredData.map((item) => ({
      date: item.date,
      efficiency: (ensureNumber(item.totalTreatedWater) / ensureNumber(item.totalInletSewage)) * 100,
    }))

    // Calculate moving average and standard deviation
    const result = efficiencyData.map((item, index) => {
      const windowStart = Math.max(0, index - windowSize + 1)
      const window = efficiencyData.slice(windowStart, index + 1)
      const avg = window.reduce((sum, w) => sum + w.efficiency, 0) / window.length
      const stdDev = Math.sqrt(window.reduce((sum, w) => sum + Math.pow(w.efficiency - avg, 2), 0) / window.length)

      // Mark as anomaly if more than 2 standard deviations from moving average
      const isAnomaly = Math.abs(item.efficiency - avg) > 2 * stdDev

      return {
        date: item.date,
        efficiency: item.efficiency,
        movingAvg: avg,
        isAnomaly,
      }
    })

    return result
  }, [filteredData])

  // Prepare data for seasonal patterns
  const seasonalData = useMemo(() => {
    if (!filteredData.length) return []

    // Group by month
    const monthlyData = filteredData.reduce((acc, item) => {
      const date = new Date(item.date)
      const month = date.toLocaleString("default", { month: "short" })

      if (!acc[month]) {
        acc[month] = {
          month,
          inflow: 0,
          treated: 0,
          irrigation: 0,
          count: 0,
        }
      }

      acc[month].inflow += ensureNumber(item.totalInletSewage)
      acc[month].treated += ensureNumber(item.totalTreatedWater)
      acc[month].irrigation += ensureNumber(item.totalTSEWater)
      acc[month].count += 1

      return acc
    }, {})

    // Convert to array and calculate averages
    return Object.values(monthlyData).map((item: any) => ({
      month: item.month,
      avgInflow: item.inflow / item.count,
      avgTreated: item.treated / item.count,
      avgIrrigation: item.irrigation / item.count,
    }))
  }, [filteredData])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading data: {error}</div>
  }

  // Export functions
  const exportFilteredData = () => {
    const exportData = filteredData.map((item) => ({
      Date: item.date,
      Tanker_Trips: item.tankerTrips,
      Tanker_Volume_m3: item.expectedTankerVolume,
      Direct_Sewage_m3: item.directInlineSewage,
      Total_Inlet_m3: item.totalInletSewage,
      Treated_Water_m3: item.totalTreatedWater,
      TSE_Output_m3: item.totalTSEWater,
      Efficiency_Pct: ((item.totalTreatedWater / item.totalInletSewage) * 100).toFixed(1),
    }))

    exportToCSV(exportData, `STP_Data_${dateRange.start}_to_${dateRange.end}`.replace(/\s/g, "_"))
    addToast("Export successful", "STP data has been exported to CSV", "success")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SectionHeader title="STP Plant Analytics" subtitle="Advanced insights into sewage treatment operations" />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <ExportButton onClick={exportFilteredData} label="Export Data" />
        </div>
      </div>

      {/* Time Range Selector */}
      <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Time Range:</span>
                <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                  {dateRange.start} - {dateRange.end}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setTimeRange([Math.max(0, timeRange[0] - 10), Math.max(timeRange[1] - 10, timeRange[0] + 10)])
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTimeRange([Math.min(90, timeRange[0] + 10), Math.min(100, timeRange[1] + 10)])}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Slider
              defaultValue={[0, 100]}
              value={timeRange}
              onValueChange={setTimeRange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Month</label>
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select month">{selectedMonth}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {availableMonths.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Data Type</label>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select data type">All Data</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Data</SelectItem>
                    <SelectItem value="inflow">Inflow Only</SelectItem>
                    <SelectItem value="treated">Treated Water Only</SelectItem>
                    <SelectItem value="irrigation">Irrigation Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">View Type</label>
                <Select defaultValue="daily">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select view type">Daily</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Scorecard */}
      <PerformanceScorecard kpis={kpis} />

      {/* Tabs for different views */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="bg-gradient-to-r from-[#4E4456]/10 to-[#8ACCD5]/10 w-full justify-start overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-md">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="waterFlow" className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white">
            Water Flow
          </TabsTrigger>
          <TabsTrigger value="efficiency" className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white">
            Efficiency
          </TabsTrigger>
          <TabsTrigger value="patterns" className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white">
            Patterns & Trends
          </TabsTrigger>
          <TabsTrigger value="anomalies" className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white">
            Anomalies
          </TabsTrigger>
          <TabsTrigger value="quality" className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white">
            Water Quality
          </TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white">
            Raw Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WaterBalanceChart data={filteredData} />
            <TreatmentEfficiencyGauge efficiency={kpis.avgEfficiency} treatmentRatio={kpis.treatmentRatio} />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <WaterFlowSankey data={filteredData} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SourceDistributionChart
              tankerPercentage={kpis.tankerPercentage}
              directPercentage={kpis.directPercentage}
            />
            <OperationalInsightsChart data={filteredData} />
          </div>
        </TabsContent>

        <TabsContent value="waterFlow" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <WaterBalanceChart data={filteredData} showDetails={true} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Daily Inflow vs Outflow</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Comparison of daily water inflow and treated outflow</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <TreatmentPerformanceChart data={filteredData} />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Source Distribution Over Time</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Trends in water sources over the selected period</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <SourceDistributionChart
                  tankerPercentage={kpis.tankerPercentage}
                  directPercentage={kpis.directPercentage}
                  showTrends={true}
                  data={filteredData}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TreatmentEfficiencyGauge
              efficiency={kpis.avgEfficiency}
              treatmentRatio={kpis.treatmentRatio}
              showDetails={true}
            />
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Efficiency Factors</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Key factors affecting treatment efficiency</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <EfficiencyTrendChart data={filteredData} />
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Efficiency Trend Analysis</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Long-term trends in treatment efficiency</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <EfficiencyTrendChart data={filteredData} showDetails={true} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Seasonal Patterns</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Monthly patterns in water flow and treatment</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <SeasonalPatternChart data={seasonalData} />
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Weekly Patterns</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Day of week patterns in water flow</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <SeasonalPatternChart data={seasonalData} type="weekly" />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Correlation Analysis</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Relationships between key metrics</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <OperationalInsightsChart data={filteredData} showCorrelation={true} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Anomaly Detection</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Detecting unusual patterns in efficiency data</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AnomalyDetectionChart data={anomalyData} />
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Outlier Analysis</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Statistical outliers in treatment data</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AnomalyDetectionChart data={anomalyData} type="boxplot" />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Anomaly Impact</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Impact of anomalies on overall performance</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <AnomalyDetectionChart data={anomalyData} type="impact" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Water Quality Matrix</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Comprehensive view of water quality parameters</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <WaterQualityMatrix data={filteredData} />
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Quality Trends</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Trends in key quality indicators</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <WaterQualityMatrix data={filteredData} type="trends" />
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[#4E4456] font-semibold">Compliance Analysis</CardTitle>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>Regulatory compliance of water quality</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <WaterQualityMatrix data={filteredData} type="compliance" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-[#4E4456] font-semibold">Raw Data</CardTitle>
                <CardDescription>Detailed view of all STP plant data</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={exportFilteredData}
                className="border-[#4E4456] text-[#4E4456] hover:bg-[#4E4456]/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <DataTable data={filteredData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

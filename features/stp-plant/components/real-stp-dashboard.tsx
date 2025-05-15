"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRealSTPData } from "../hooks/use-real-stp-data"
import { AreaChart, BarChart, PieChart } from "@/components/ui/charts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DropletIcon, 
  BarChart3Icon, 
  ActivityIcon, 
  GaugeIcon, 
  BeakerIcon,
  ArrowUp,
  ArrowDown,
  MinusIcon,
  RefreshCw
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import WaterQualityCard from "./water-quality-card"
import { EnhancedFlowSankey } from "./charts/enhanced-flow-sankey"

// Types for dashboard components
interface KPICardProps {
  title: string
  value: number
  unit: string
  change: number
  icon: "flow" | "efficiency" | "utilization" | "quality"
  colorClass?: string
}

// Helper to generate realistic water quality parameters based on the efficiency
const generateWaterQualityParams = (efficiency: number) => {
  // More efficient treatment = better water quality
  const qualityFactor = efficiency / 100
  
  // pH typically between 6-9 for treated water
  const phValue = 7.0 + (Math.random() * 1.5 - 0.75)
  
  // COD (Chemical Oxygen Demand) - lower is better, typically <100 mg/L for well-treated
  const codValue = Math.round(250 - (qualityFactor * 200) + (Math.random() * 50 - 25))
  
  // BOD (Biological Oxygen Demand) - lower is better, typically <20 mg/L for well-treated
  const bodValue = Math.round(30 - (qualityFactor * 25) + (Math.random() * 10 - 5))
  
  // TSS (Total Suspended Solids) - lower is better, typically <30 mg/L for well-treated
  const tssValue = Math.round(45 - (qualityFactor * 35) + (Math.random() * 15 - 7.5))
  
  return {
    phValue: Number(phValue.toFixed(1)),
    codValue: Math.max(5, codValue), 
    bodValue: Math.max(2, bodValue),
    tssValue: Math.max(3, tssValue)
  }
}

export default function RealSTPDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("2025-04")
  const [waterQualityParams, setWaterQualityParams] = useState({
    phValue: 7.2,
    codValue: 60,
    bodValue: 15,
    tssValue: 20
  })
  const { 
    kpiData, 
    sankeyData, 
    dailyData, 
    monthlyData, 
    rawData, 
    previousMonthRawData, 
    isLoading,
    availableMonths
  } = useRealSTPData(selectedMonth)

  // Update water quality parameters when efficiency changes
  useEffect(() => {
    if (!isLoading) {
      setWaterQualityParams(generateWaterQualityParams(kpiData.efficiency))
    }
  }, [kpiData.efficiency, isLoading])

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
  }

  // Get month name from the selectedMonth value (YYYY-MM)
  const getMonthName = () => {
    const month = availableMonths.find(m => m.value === selectedMonth)
    return month ? month.label : 'Unknown'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-500" />
          <p className="mt-4 text-lg text-gray-600">Loading STP data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header with month selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">STP Plant Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Sewage Treatment Plant performance metrics and analysis
          </p>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-64">
          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="TOTAL INFLOW"
          value={kpiData.totalInflow}
          unit="m³"
          change={kpiData.inflowChange}
          icon="flow"
          colorClass="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        />
        <KPICard
          title="TOTAL OUTFLOW"
          value={kpiData.totalOutflow}
          unit="m³"
          change={kpiData.outflowChange}
          icon="flow"
          colorClass="bg-cyan-50 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300"
        />
        <KPICard
          title="EFFICIENCY"
          value={kpiData.efficiency}
          unit="%"
          change={kpiData.efficiencyChange}
          icon="efficiency"
          colorClass="bg-emerald-50 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
        />
        <KPICard
          title="PLANT UTILIZATION"
          value={kpiData.utilization}
          unit="%"
          change={kpiData.utilizationChange}
          icon="utilization"
          colorClass="bg-amber-50 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8 w-full justify-start overflow-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Analysis</TabsTrigger>
          <TabsTrigger value="quality">Water Quality</TabsTrigger>
          <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Efficiency Gauge */}
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
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeDasharray={`${(kpiData.efficiency / 100) * 283} 283`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold text-emerald-600">{kpiData.efficiency}%</span>
                      <span className="text-gray-500 text-sm">efficiency</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 mt-1">
                      Treatment efficiency measures how effectively the plant converts raw sewage into treated water.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plant Utilization Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Plant Utilization</CardTitle>
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
                        stroke="#f59e0b"
                        strokeWidth="10"
                        strokeDasharray={`${(kpiData.utilization / 100) * 283} 283`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-4xl font-bold text-amber-600">{kpiData.utilization}%</span>
                      <span className="text-gray-500 text-sm">of capacity</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 mt-1">
                      Plant utilization shows how much of the 750 m³/day designed capacity is being used.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Flow Distribution Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Inflow Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <PieChart 
                  data={[
                    { name: "Tanker Discharge", value: sankeyData.links[1].value, color: "#3b82f6" },
                    { name: "Direct Sewage", value: sankeyData.links[2].value, color: "#0ea5e9" }
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Flow Sankey Chart */}
          <EnhancedFlowSankey data={sankeyData} />

          {/* Treatment Process Flow */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Treatment Process Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                  <h3 className="font-medium mb-2">Primary Treatment</h3>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {Math.round(sankeyData.links[3].value)} m³
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {Math.round((sankeyData.links[3].value / sankeyData.links[0].value) * 100)}% of inflow
                  </p>
                </div>
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg text-center">
                  <h3 className="font-medium mb-2">Secondary Treatment</h3>
                  <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                    {Math.round(sankeyData.links[5].value)} m³
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {Math.round((sankeyData.links[5].value / sankeyData.links[0].value) * 100)}% of inflow
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg text-center">
                  <h3 className="font-medium mb-2">TSE Output</h3>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(sankeyData.links[7].value)} m³
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {Math.round((sankeyData.links[7].value / sankeyData.links[0].value) * 100)}% of inflow
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Analysis Tab */}
        <TabsContent value="daily" className="space-y-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Daily Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <AreaChart 
                  data={dailyData.map((item: any) => ({
                    name: `Day ${item.day}`,
                    value: item.efficiency,
                  }))}
                  categories={["value"]}
                  index="name"
                  colors={["#10b981"]}
                  valueFormatter={(value: number) => `${value.toFixed(1)}%`}
                  showLegend={false}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Daily Inflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <BarChart 
                  data={dailyData.map((item: any) => ({
                    name: `Day ${item.day}`,
                    value: item.flowRate,
                  }))}
                  categories={["value"]}
                  index="name"
                  colors={["#3b82f6"]}
                  valueFormatter={(value: number) => `${value} m³`}
                  showLegend={false}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Water Quality Tab */}
        <TabsContent value="quality" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WaterQualityCard
              title="Treated Water Quality Analysis"
              phValue={waterQualityParams.phValue}
              codValue={waterQualityParams.codValue}
              bodValue={waterQualityParams.bodValue}
              tssValue={waterQualityParams.tssValue}
              month={getMonthName()}
            />

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Water Quality Standards Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Overall Compliance Score</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700 mr-2">
                        <div 
                          className="bg-emerald-500 h-6 rounded-full" 
                          style={{ width: `${kpiData.efficiency}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold">{kpiData.efficiency}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Reuse Standards</h4>
                      <p className="text-xl font-bold text-emerald-600">Compliant</p>
                      <p className="text-sm text-gray-500 mt-1">Meets irrigation requirements</p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Regulatory Status</h4>
                      <p className="text-xl font-bold text-emerald-600">Approved</p>
                      <p className="text-sm text-gray-500 mt-1">Meets local environmental regulations</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Monthly Quality Trend</h3>
                    <div className="h-40">
                      <AreaChart 
                        data={monthlyData.slice(-6).map((item: any) => ({
                          name: item.month,
                          Quality: item.efficiency * 0.1,
                        }))}
                        categories={["Quality"]}
                        index="name"
                        colors={["#0ea5e9"]}
                        valueFormatter={(value: number) => `${value.toFixed(1)}`}
                        showLegend={false}
                        startAxisAtZero={false}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Water Reuse Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Landscape Irrigation</h3>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span>Suitable</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    TSE water is suitable for irrigating gardens, parks, and golf courses
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Industrial Uses</h3>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span>Suitable</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Can be used for cooling systems and process water in industrial applications
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Groundwater Recharge</h3>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                    <span>Conditional</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Additional treatment required for groundwater recharge applications
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Trends Tab */}
        <TabsContent value="trends" className="space-y-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Monthly Efficiency Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <AreaChart 
                  data={monthlyData.map((item: any) => ({
                    name: item.month,
                    Efficiency: item.efficiency,
                    Target: item.target,
                  }))}
                  categories={["Efficiency", "Target"]}
                  index="name"
                  colors={["#10b981", "#f59e0b"]}
                  valueFormatter={(value: number) => `${value.toFixed(1)}%`}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Average Daily Flow Rate by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <BarChart 
                  data={monthlyData.map((item: any) => ({
                    name: item.month,
                    "Flow Rate": item.flowRate,
                  }))}
                  categories={["Flow Rate"]}
                  index="name"
                  colors={["#3b82f6"]}
                  valueFormatter={(value: number) => `${value} m³`}
                  showLegend={false}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raw Data Tab */}
        <TabsContent value="raw" className="space-y-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Daily Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Influent Flow (m³)</TableHead>
                      <TableHead className="text-right">Effluent Flow (m³)</TableHead>
                      <TableHead className="text-right">Efficiency (%)</TableHead>
                      <TableHead className="text-right">Energy Usage (kWh)</TableHead>
                      <TableHead className="text-right">Chemical Usage (kg)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rawData.slice(0, 20).map((record: any) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date}</TableCell>
                        <TableCell className="text-right">{record.influentFlow}</TableCell>
                        <TableCell className="text-right">{record.effluentFlow}</TableCell>
                        <TableCell className="text-right">{record.efficiency}%</TableCell>
                        <TableCell className="text-right">{record.energyUsage}</TableCell>
                        <TableCell className="text-right">{record.chemicalUsage}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {rawData.length > 20 && (
                  <div className="text-center mt-4 text-gray-500">
                    Showing 20 of {rawData.length} records
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// KPI Card Component
function KPICard({ title, value, unit, change, icon, colorClass = "bg-gray-50 text-gray-700" }: KPICardProps) {
  const formatValue = (val: number): string => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + "M";
    } else if (val >= 1000) {
      return (val / 1000).toFixed(1) + "K";
    }
    return val.toLocaleString();
  };

  const getIcon = () => {
    switch (icon) {
      case "flow":
        return <DropletIcon className="h-5 w-5" />;
      case "efficiency":
        return <ActivityIcon className="h-5 w-5" />;
      case "utilization":
        return <GaugeIcon className="h-5 w-5" />;
      case "quality":
        return <BeakerIcon className="h-5 w-5" />;
      default:
        return <BarChart3Icon className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <div className="flex items-baseline mt-1">
              <h3 className="text-2xl font-bold">{formatValue(value)}</h3>
              <span className="ml-1 text-sm">{unit}</span>
            </div>
          </div>
          <div className={`p-2 rounded-full ${colorClass}`}>
            {getIcon()}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            {change > 0 ? (
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            ) : change < 0 ? (
              <ArrowDown className="h-4 w-4 text-red-500" />
            ) : (
              <MinusIcon className="h-4 w-4 text-gray-500" />
            )}
            <span
              className={`ml-1 text-sm font-medium ${
                change > 0
                  ? "text-emerald-500"
                  : change < 0
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              {Math.abs(change)}%
            </span>
            <span className="ml-1 text-sm text-gray-500">from previous month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

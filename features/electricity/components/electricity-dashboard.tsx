"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useElectricityData } from "../hooks/use-electricity-data"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SectionHeader } from "@/components/ui/section-header"
import { Badge } from "@/components/ui/badge"
import { ExportButton } from "@/components/ui/export-button"
import { TimeSlider } from "@/components/ui/time-slider"
import { exportToCSV } from "@/lib/export-utils"
import { useToast } from "@/hooks/use-toast"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import { Zap, Building, Droplet, DollarSign } from "lucide-react"
import {
  BASE_COLOR,
  SECONDARY_COLOR,
  ACCENT_COLOR,
  SUCCESS_COLOR,
  WARNING_COLOR,
  DANGER_COLOR,
  INFO_COLOR,
} from "@/lib/theme-constants"

// Define the color palette to match the Water Dashboard
const COLORS = [ACCENT_COLOR, BASE_COLOR, SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR, INFO_COLOR, SECONDARY_COLOR]

export default function ElectricityDashboard() {
  const {
    data,
    isLoading,
    error,
    selectedMonth,
    setSelectedMonth,
    getConsumptionByType,
    getMonthlyConsumptionTrend,
    getTopConsumers,
    getDataForMonth,
    getTotalStats,
    PRICE_PER_KWH,
    months,
  } = useElectricityData()

  const [selectedTab, setSelectedTab] = useState("overview")
  const { addToast } = useToast()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading data: {error}</div>
  }

  const consumptionByType = getConsumptionByType()
  const monthlyTrend = getMonthlyConsumptionTrend()
  const topConsumers = getTopConsumers(10)
  const stats = getTotalStats()

  // Calculate month-over-month change
  const getMonthlyChange = () => {
    if (monthlyTrend.length < 2) return { percentage: 0, isIncrease: false }

    const currentMonth = monthlyTrend[monthlyTrend.length - 1].consumption
    const previousMonth = monthlyTrend[monthlyTrend.length - 2].consumption

    const difference = currentMonth - previousMonth
    const percentage = previousMonth !== 0 ? (difference / previousMonth) * 100 : 0

    return {
      percentage: Math.abs(percentage),
      isIncrease: difference > 0,
    }
  }

  const monthlyChange = getMonthlyChange()

  // Export functions
  const exportConsumptionByType = () => {
    const exportData = consumptionByType.map((item) => ({
      Type: item.type,
      Consumption_kWh: item.consumption.toFixed(2),
      Cost_OMR: item.cost.toFixed(3),
      Percentage: ((item.consumption / stats.totalConsumption) * 100).toFixed(2) + "%",
    }))

    exportToCSV(exportData, "Electricity_Consumption_By_Type")
    addToast("Export successful", "Consumption by type data has been exported to CSV", "success")
  }

  const exportMonthlyTrend = () => {
    const exportData = monthlyTrend.map((item) => ({
      Month: item.month,
      Consumption_kWh: item.consumption.toFixed(2),
      Cost_OMR: item.cost.toFixed(3),
    }))

    exportToCSV(exportData, "Electricity_Monthly_Trend")
    addToast("Export successful", "Monthly trend data has been exported to CSV", "success")
  }

  const exportTopConsumers = () => {
    const exportData = topConsumers.map((item) => ({
      Name: item.name,
      Type: item.type,
      Meter_Account_No: item.meterAccountNo,
      Total_Consumption_kWh: item.totalConsumption.toFixed(2),
      Total_Cost_OMR: item.totalCost.toFixed(3),
      Average_Monthly_kWh: item.averageConsumption.toFixed(2),
      Average_Monthly_Cost_OMR: item.averageCost.toFixed(3),
    }))

    exportToCSV(exportData, "Electricity_Top_Consumers")
    addToast("Export successful", "Top consumers data has been exported to CSV", "success")
  }

  const exportAllData = () => {
    const exportData = data.map((item) => ({
      Name: item.name,
      Type: item.type,
      Meter_Account_No: item.meterAccountNo,
      Total_Consumption_kWh: item.totalConsumption.toFixed(2),
      Total_Cost_OMR: item.totalCost.toFixed(3),
      Average_Monthly_kWh: item.averageConsumption.toFixed(2),
      Average_Monthly_Cost_OMR: item.averageCost.toFixed(3),
    }))

    exportToCSV(exportData, "Electricity_All_Data")
    addToast("Export successful", "All electricity data has been exported to CSV", "success")
  }

  const exportMonthlyData = () => {
    if (!selectedMonth) return

    const monthData = getDataForMonth(selectedMonth)
    const exportData = monthData.map((item) => ({
      Name: item.name,
      Type: item.type,
      Meter_Account_No: item.meterAccountNo,
      Consumption_kWh: item.consumption.toFixed(2),
      Cost_OMR: item.cost.toFixed(3),
    }))

    exportToCSV(exportData, `Electricity_${selectedMonth.replace("-", "_")}`)
    addToast("Export successful", `${selectedMonth} data has been exported to CSV`, "success")
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <SectionHeader title="Electricity Management" subtitle="Power consumption and distribution" />
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
            92% Efficiency
          </Badge>
          <ExportButton onClick={exportAllData} label="Export All Data" />
        </div>
      </div>

      {/* Time Slider */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <TimeSlider
          dates={months}
          currentDate={selectedMonth || months[months.length - 1]}
          onChange={setSelectedMonth}
          className="mt-2"
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">Current Usage</h3>
                <div className="mt-2 flex items-baseline">
                  <p className="text-3xl font-bold text-[#4E4456]">
                    {monthlyTrend[monthlyTrend.length - 1]?.consumption.toLocaleString()}
                  </p>
                  <p className="ml-2 text-sm text-gray-500">kWh</p>
                </div>
                <div className="mt-3 flex items-center">
                  <span
                    className={`text-xs font-medium ${monthlyChange.isIncrease ? "text-red-500" : "text-green-500"}`}
                  >
                    {monthlyChange.isIncrease ? "↑" : "↓"} {monthlyChange.percentage.toFixed(1)}%
                  </span>
                  <span className="text-gray-400 text-xs ml-2">vs last period</span>
                </div>
              </div>
              <Zap className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">Total Cost</h3>
                <div className="mt-2 flex items-baseline">
                  <p className="text-3xl font-bold text-[#4E4456]">
                    {stats.totalCost.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}
                  </p>
                  <p className="ml-2 text-sm text-gray-500">OMR</p>
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-gray-400 text-xs">Rate: {PRICE_PER_KWH.toFixed(3)} OMR/kWh</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">Highest Consumer</h3>
                <div className="mt-2 flex items-baseline">
                  <p
                    className="text-3xl font-bold text-[#4E4456] truncate max-w-[180px]"
                    title={topConsumers[0]?.name || "N/A"}
                  >
                    {topConsumers[0]?.name || "N/A"}
                  </p>
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-gray-400 text-xs">
                    {topConsumers[0]?.totalConsumption.toLocaleString()} kWh ({topConsumers[0]?.type})
                  </span>
                </div>
              </div>
              <Building className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
          <CardContent className="p-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">Peak Demand</h3>
                <div className="mt-2 flex items-baseline">
                  <p className="text-3xl font-bold text-[#4E4456]">
                    {Math.max(...monthlyTrend.map((m) => m.consumption)).toLocaleString()}
                  </p>
                  <p className="ml-2 text-sm text-gray-500">kWh</p>
                </div>
                <div className="mt-3 flex items-center">
                  <span className="text-gray-400 text-xs">Highest monthly consumption</span>
                </div>
              </div>
              <Droplet className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="bg-white border w-full justify-start rounded-md p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white rounded-md"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="byType"
            className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white rounded-md"
          >
            By Type
          </TabsTrigger>
          <TabsTrigger
            value="topConsumers"
            className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white rounded-md"
          >
            Top Consumers
          </TabsTrigger>
          <TabsTrigger
            value="monthlyTrend"
            className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white rounded-md"
          >
            Monthly Trend
          </TabsTrigger>
          <TabsTrigger
            value="monthlyData"
            className="data-[state=active]:bg-[#4E4456] data-[state=active]:text-white rounded-md"
          >
            Monthly Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Consumption by Type</CardTitle>
                <ExportButton onClick={exportConsumptionByType} />
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={consumptionByType}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="consumption"
                        nameKey="type"
                      >
                        {consumptionByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toLocaleString()} kWh`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">Monthly Consumption Trend</CardTitle>
                <ExportButton onClick={exportMonthlyTrend} />
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrend}>
                      <defs>
                        <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ACCENT_COLOR} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={ACCENT_COLOR} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value.toLocaleString()} kWh`} />
                      <Area
                        type="monotone"
                        dataKey="consumption"
                        stroke={ACCENT_COLOR}
                        fillOpacity={1}
                        fill="url(#colorConsumption)"
                        name="Consumption (kWh)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Top 5 Consumers</CardTitle>
              <ExportButton onClick={exportTopConsumers} />
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topConsumers.slice(0, 5).map((item) => ({
                      name: item.name,
                      consumption: item.totalConsumption,
                      type: item.type,
                    }))}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString()} kWh`}
                      labelFormatter={(label) => `Consumer: ${label}`}
                    />
                    <Bar dataKey="consumption" fill={BASE_COLOR} name="Consumption (kWh)" radius={[0, 4, 4, 0]}>
                      {topConsumers.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="byType" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">Consumption by Type</CardTitle>
                <CardDescription>Breakdown of electricity usage by facility type</CardDescription>
              </div>
              <ExportButton onClick={exportConsumptionByType} />
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={consumptionByType} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="type" width={120} />
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString()} kWh`}
                      labelFormatter={(label) => `Type: ${label}`}
                    />
                    <Bar dataKey="consumption" fill={ACCENT_COLOR} name="Consumption (kWh)" radius={[0, 4, 4, 0]}>
                      {consumptionByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Cost Analysis by Type</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Type</th>
                        <th className="text-right py-2 px-4">Consumption (kWh)</th>
                        <th className="text-right py-2 px-4">Cost (OMR)</th>
                        <th className="text-right py-2 px-4">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consumptionByType.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4">{item.type}</td>
                          <td className="text-right py-2 px-4">{item.consumption.toLocaleString()}</td>
                          <td className="text-right py-2 px-4">
                            {item.cost.toLocaleString(undefined, {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            })}
                          </td>
                          <td className="text-right py-2 px-4">
                            {((item.consumption / stats.totalConsumption) * 100).toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                      <tr className="font-medium bg-muted/20">
                        <td className="py-2 px-4">Total</td>
                        <td className="text-right py-2 px-4">{stats.totalConsumption.toLocaleString()}</td>
                        <td className="text-right py-2 px-4">
                          {stats.totalCost.toLocaleString(undefined, {
                            minimumFractionDigits: 3,
                            maximumFractionDigits: 3,
                          })}
                        </td>
                        <td className="text-right py-2 px-4">100.00%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topConsumers" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">Top 10 Consumers</CardTitle>
                <CardDescription>Highest electricity consuming facilities</CardDescription>
              </div>
              <ExportButton onClick={exportTopConsumers} />
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topConsumers.map((item) => ({
                      name: item.name,
                      consumption: item.totalConsumption,
                      type: item.type,
                    }))}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip
                      formatter={(value) => `${value.toLocaleString()} kWh`}
                      labelFormatter={(label) => `Consumer: ${label}`}
                    />
                    <Bar dataKey="consumption" fill={ACCENT_COLOR} name="Consumption (kWh)" radius={[0, 4, 4, 0]}>
                      {topConsumers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Top Consumers Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Name</th>
                        <th className="text-left py-2 px-4">Type</th>
                        <th className="text-left py-2 px-4">Meter Account</th>
                        <th className="text-right py-2 px-4">Total (kWh)</th>
                        <th className="text-right py-2 px-4">Cost (OMR)</th>
                        <th className="text-right py-2 px-4">Monthly Avg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topConsumers.map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4">{item.name}</td>
                          <td className="py-2 px-4">{item.type}</td>
                          <td className="py-2 px-4">{item.meterAccountNo}</td>
                          <td className="text-right py-2 px-4">{item.totalConsumption.toLocaleString()}</td>
                          <td className="text-right py-2 px-4">
                            {item.totalCost.toLocaleString(undefined, {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            })}
                          </td>
                          <td className="text-right py-2 px-4">
                            {item.averageConsumption.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthlyTrend" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">Monthly Consumption Trend</CardTitle>
                <CardDescription>Electricity usage pattern over time</CardDescription>
              </div>
              <ExportButton onClick={exportMonthlyTrend} />
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value.toLocaleString()} kWh`} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="consumption"
                      stroke={ACCENT_COLOR}
                      name="Consumption (kWh)"
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2, fill: BASE_COLOR, stroke: BASE_COLOR }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Monthly Consumption & Cost</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Month</th>
                        <th className="text-right py-2 px-4">Consumption (kWh)</th>
                        <th className="text-right py-2 px-4">Cost (OMR)</th>
                        <th className="text-right py-2 px-4">% Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyTrend.map((item, index) => {
                        const prevMonth = index > 0 ? monthlyTrend[index - 1].consumption : item.consumption
                        const percentChange = prevMonth !== 0 ? ((item.consumption - prevMonth) / prevMonth) * 100 : 0

                        return (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-4">{item.month}</td>
                            <td className="text-right py-2 px-4">{item.consumption.toLocaleString()}</td>
                            <td className="text-right py-2 px-4">
                              {item.cost.toLocaleString(undefined, {
                                minimumFractionDigits: 3,
                                maximumFractionDigits: 3,
                              })}
                            </td>
                            <td className="text-right py-2 px-4">
                              <span
                                className={
                                  percentChange > 0 ? "text-red-500" : percentChange < 0 ? "text-green-500" : ""
                                }
                              >
                                {percentChange !== 0
                                  ? (percentChange > 0 ? "+" : "") + percentChange.toFixed(2) + "%"
                                  : "-"}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthlyData" className="space-y-4">
          <Card className="bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">Monthly Detailed Data: {selectedMonth}</CardTitle>
                <CardDescription>Detailed consumption for the selected month</CardDescription>
              </div>
              <ExportButton onClick={exportMonthlyData} />
            </CardHeader>
            <CardContent>
              {selectedMonth && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-4">Name</th>
                        <th className="text-left py-2 px-4">Type</th>
                        <th className="text-left py-2 px-4">Meter Account</th>
                        <th className="text-right py-2 px-4">Consumption (kWh)</th>
                        <th className="text-right py-2 px-4">Cost (OMR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getDataForMonth(selectedMonth).map((item, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4">{item.name}</td>
                          <td className="py-2 px-4">{item.type}</td>
                          <td className="py-2 px-4">{item.meterAccountNo}</td>
                          <td className="text-right py-2 px-4">{item.consumption.toLocaleString()}</td>
                          <td className="text-right py-2 px-4">
                            {item.cost.toLocaleString(undefined, {
                              minimumFractionDigits: 3,
                              maximumFractionDigits: 3,
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { STPHeader } from "./stp-header"
import { KPICard } from "./kpi-card"
import { EnhancedEfficiencyGauge } from "./charts/enhanced-efficiency-gauge"
import { EnhancedFlowSankey } from "./charts/enhanced-flow-sankey"
import { DailyEfficiencyChart } from "./charts/daily-efficiency-chart"
import { MonthlyEfficiencyChart } from "./charts/monthly-efficiency-chart"
import { EnhancedDataTable } from "./enhanced-data-table"
import { useRandomSTPData } from "../hooks/use-random-stp-data"

export default function EnhancedSTPPlantDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("2024-04")
  const { kpiData, sankeyData, dailyData, monthlyData, rawData, previousMonthRawData, isLoading } =
    useRandomSTPData(selectedMonth)

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <STPHeader selectedMonth={selectedMonth} onMonthChange={handleMonthChange} />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <KPICard
          title="TOTAL INFLOW (m³)"
          value={kpiData.totalInflow}
          unit="m³"
          change={kpiData.inflowChange}
          icon="flow"
        />
        <KPICard
          title="TOTAL OUTFLOW (m³)"
          value={kpiData.totalOutflow}
          unit="m³"
          change={kpiData.outflowChange}
          icon="flow"
        />
        <KPICard
          title="TREATMENT EFFICIENCY"
          value={kpiData.efficiency}
          unit="%"
          change={kpiData.efficiencyChange}
          icon="efficiency"
        />
        <KPICard
          title="PLANT UTILIZATION"
          value={kpiData.utilization}
          unit="%"
          change={kpiData.utilizationChange}
          icon="utilization"
        />
        <KPICard
          title="QUALITY INDEX"
          value={kpiData.qualityIndex}
          unit=""
          change={kpiData.qualityChange}
          icon="quality"
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily">Daily Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EnhancedEfficiencyGauge efficiency={kpiData.efficiency} />
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Plant Utilization</h3>
              <div className="flex flex-col items-center">
                <div className="w-full h-64">
                  {/* Plant Utilization Chart would go here */}
                  <div className="flex items-center justify-center h-full">
                    <div className="relative w-48 h-48">
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
                        <span className="text-4xl font-bold text-amber-500">{kpiData.utilization}%</span>
                        <span className="text-gray-500 text-sm">of capacity</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-4xl font-bold text-amber-500">{kpiData.utilization}%</span>
                  <p className="text-gray-500 mt-1">Current Utilization</p>
                </div>
              </div>
            </div>
          </div>

          <EnhancedFlowSankey data={sankeyData} />
        </TabsContent>

        {/* Daily Analysis Tab */}
        <TabsContent value="daily" className="space-y-6">
          <DailyEfficiencyChart data={dailyData} />
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <MonthlyEfficiencyChart data={monthlyData} />
        </TabsContent>

        {/* Raw Data Tab */}
        <TabsContent value="raw" className="space-y-6">
          <EnhancedDataTable data={rawData} previousData={previousMonthRawData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

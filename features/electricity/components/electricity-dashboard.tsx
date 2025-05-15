"use client"

import { useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SectionHeader } from "@/components/ui/section-header"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// Define the base color and generate a color palette
const BASE_COLOR = "#4E4456"
const SECONDARY_COLOR = "#8A7A94"
const ACCENT_COLOR = "#8ACCD5"
const SUCCESS_COLOR = "#50C878"
const WARNING_COLOR = "#FFB347"
const DANGER_COLOR = "#FF6B6B"
const INFO_COLOR = "#5BC0DE"

const COLORS = [ACCENT_COLOR, BASE_COLOR, INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR]

export default function ElectricityDashboard() {
  const { data, isLoading } = useDashboardData("electricity", {
    summary: {
      totalConsumption: 0,
      peakDemand: 0,
      monthlyCost: 0,
      efficiencyScore: 0,
      consumptionChange: 0,
      costChange: 0,
      efficiencyChange: 0,
    },
    breakdown: [],
    trend: [],
    peakHours: [],
  })

  const formattedCost = useMemo(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(data.summary.monthlyCost)
  }, [data.summary.monthlyCost])

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex overflow-x-auto scrollbar-hide h-auto">
          <TabsTrigger
            value="overview"
            className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
          >
            Dashboard Overview
          </TabsTrigger>
          <TabsTrigger
            value="consumption"
            className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
          >
            Consumption Analysis
          </TabsTrigger>
          <TabsTrigger
            value="cost"
            className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
          >
            Cost Analysis
          </TabsTrigger>
          <TabsTrigger
            value="trends"
            className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
          >
            Trend Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardCard
              title="Total Consumption"
              value={data.summary.totalConsumption}
              unit="kWh"
              change={data.summary.consumptionChange}
            />
            <DashboardCard title="Peak Demand" value={data.summary.peakDemand} unit="kW" change={2.3} />
            <DashboardCard title="Monthly Cost" value={formattedCost} change={data.summary.costChange} />
            <DashboardCard
              title="Efficiency Score"
              value={data.summary.efficiencyScore}
              unit="%"
              change={data.summary.efficiencyChange}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <SectionHeader title="Consumption Trend" description="Monthly electricity consumption in kWh" />
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.trend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="consumption"
                        name="Consumption (kWh)"
                        stroke={ACCENT_COLOR}
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 2, fill: BASE_COLOR, stroke: BASE_COLOR }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <SectionHeader title="Usage Breakdown" description="Distribution of electricity consumption by area" />
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.breakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {data.breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [`${value} kWh (${props.payload.percentage}%)`, name]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Peak Hours Chart */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader title="Peak Demand Hours" description="Hourly electricity demand in kW" />
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.peakHours}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="demand" name="Demand (kW)" fill={BASE_COLOR} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumption" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <SectionHeader
                title="Consumption Analysis"
                description="Detailed analysis of electricity consumption patterns"
              />
              <p className="text-gray-600">
                This section will contain detailed consumption analysis charts and metrics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <SectionHeader title="Cost Analysis" description="Detailed analysis of electricity costs and billing" />
              <p className="text-gray-600">This section will contain detailed cost analysis charts and metrics.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <SectionHeader title="Trend Analysis" description="Long-term trends and patterns in electricity usage" />
              <p className="text-gray-600">This section will contain detailed trend analysis charts and metrics.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

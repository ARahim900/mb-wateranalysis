"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import ModernDonutChart from "@/components/modern-donut-chart"
import { DataUploader } from "@/components/data-uploader"
import { defaultWaterData, type WaterData } from "@/lib/waterDataService"

// Define the base color and generate a color palette
const BASE_COLOR = "#4E4456"
const SECONDARY_COLOR = "#8A7A94"
const ACCENT_COLOR = "#8ACCD5"
const SUCCESS_COLOR = "#50C878"
const WARNING_COLOR = "#FFB347"
const DANGER_COLOR = "#FF6B6B"
const INFO_COLOR = "#5BC0DE"
const NEUTRAL_COLOR = "#ADB5BD"

// Generate color palette
const generateColorPalette = (baseColor: string, count: number) => {
  const colors = []

  // Lighten the base color
  for (let i = 0; i < count; i++) {
    const amount = (i * (100 / count)) / 100
    colors.push(lightenColor(baseColor, amount))
  }

  return colors
}

// Function to lighten a color
const lightenColor = (color: string, amount: number) => {
  const num = Number.parseInt(color.replace("#", ""), 16)
  const r = Math.min(255, ((num >> 16) & 0xff) + 255 * amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + 255 * amount)
  const b = Math.min(255, (num & 0xff) + 255 * amount)
  return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)
}

// Generate gradient string for CSS
const generateGradient = (color1: string, color2: string, direction = "to right") => {
  return `linear-gradient(${direction}, ${color1}, ${color2})`
}

// Color palettes for charts
const ZONE_COLORS = generateColorPalette(BASE_COLOR, 6)
const LOSS_COLORS = [DANGER_COLOR, WARNING_COLOR, lightenColor(DANGER_COLOR, 0.3)]
const PIE_COLORS = [ACCENT_COLOR, INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR, SECONDARY_COLOR]

// Card component
interface AnimatedCardProps {
  title: string
  value: number
  unit: string
  change?: string | number
  changeLabel?: string
  gradient: string
  className?: string
  icon?: React.ReactNode
}

const AnimatedCard = ({ title, value, unit, change, changeLabel, gradient, className, icon }: AnimatedCardProps) => {
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
          <p className="text-3xl font-bold" style={{ color: BASE_COLOR }}>
            {value.toLocaleString()}
          </p>
          <p className="ml-2 text-sm text-gray-500">{unit}</p>
        </div>
        {change !== undefined && (
          <div className="mt-3 flex items-center">
            <span
              className={`text-xs font-medium ${Number.parseFloat(change.toString()) >= 0 ? "text-green-500" : "text-red-500"}`}
              aria-label={`${Number.parseFloat(change.toString()) >= 0 ? "Increased by" : "Decreased by"} ${Math.abs(Number.parseFloat(change.toString()))}%`}
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

// Progress bar component
interface AnimatedProgressBarProps {
  value: number
  max: number
  color: string
  label: string
  additionalInfo?: string
}

const AnimatedProgressBar = ({ value, max, color, label, additionalInfo }: AnimatedProgressBarProps) => {
  const percentage = max > 0 ? ((value / max) * 100).toFixed(1) : "0"

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium" style={{ color: BASE_COLOR }}>
          {label}
        </span>
        <span className="text-sm font-medium" style={{ color }}>
          {percentage}%
        </span>
      </div>
      <div
        className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden"
        role="progressbar"
        aria-valuenow={Number.parseFloat(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${label}: ${percentage}%`}
      >
        <div className="h-2.5 rounded-full" style={{ background: color, width: `${percentage}%` }}></div>
      </div>
      {additionalInfo && <div className="mt-1 text-xs text-gray-500">{additionalInfo}</div>}
    </div>
  )
}

// Custom Tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-[#4E4456] shadow-md rounded-md">
        <p className="font-medium mb-1 text-[#4E4456]">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toLocaleString()} m³
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Calculate efficiency percentage
const calculateEfficiency = (waterData: WaterData) => {
  return waterData.summary.map((month) => {
    const efficiency = month.L1 > 0 ? (((month.L1 - month.TotalLoss) / month.L1) * 100).toFixed(2) : "0"
    return {
      month: month.month,
      efficiency: Number.parseFloat(efficiency),
      L1: month.L1,
    }
  })
}

// Generate Flow Distribution data for the selected month
const generate3DFlowData = (waterData: WaterData, month: string) => {
  const monthData = waterData.summary.find((m) => m.month === month)

  if (!monthData) return []

  return [
    { name: "Main Supply (L1)", value: monthData.L1 },
    { name: "Zone Distribution (L2)", value: monthData.L2 },
    { name: "End User Consumption (L3)", value: monthData.L3 },
    { name: "Total Loss", value: monthData.TotalLoss },
  ]
}

// Generate Zone Performance data for the selected month
const generateZonePerformanceData = (waterData: WaterData, month: string) => {
  const zoneBulk = waterData.zones.bulkMeters.find((m) => m.month === month)
  const zoneIndiv = waterData.zones.individual.find((m) => m.month === month)
  const zoneLoss = waterData.zones.loss.find((m) => m.month === month)

  if (!zoneBulk || !zoneIndiv || !zoneLoss) return []

  return [
    {
      name: "Zone 01 FM",
      bulk: zoneBulk.Zone01FM,
      individual: zoneIndiv.Zone01FM,
      loss: zoneLoss.Zone01FM,
      efficiency: zoneBulk.Zone01FM > 0 ? ((zoneIndiv.Zone01FM / zoneBulk.Zone01FM) * 100).toFixed(1) : "0",
    },
    {
      name: "Zone 03A",
      bulk: zoneBulk.Zone03A,
      individual: zoneIndiv.Zone03A,
      loss: zoneLoss.Zone03A,
      efficiency: zoneBulk.Zone03A > 0 ? ((zoneIndiv.Zone03A / zoneBulk.Zone03A) * 100).toFixed(1) : "0",
    },
    {
      name: "Zone 03B",
      bulk: zoneBulk.Zone03B,
      individual: zoneIndiv.Zone03B,
      loss: zoneLoss.Zone03B,
      efficiency: zoneBulk.Zone03B > 0 ? ((zoneIndiv.Zone03B / zoneBulk.Zone03B) * 100).toFixed(1) : "0",
    },
    {
      name: "Zone 05",
      bulk: zoneBulk.Zone05,
      individual: zoneIndiv.Zone05,
      loss: zoneLoss.Zone05,
      efficiency: zoneBulk.Zone05 > 0 ? ((zoneIndiv.Zone05 / zoneBulk.Zone05) * 100).toFixed(1) : "0",
    },
    {
      name: "Zone 08",
      bulk: zoneBulk.Zone08,
      individual: zoneIndiv.Zone08,
      loss: zoneLoss.Zone08,
      efficiency: zoneBulk.Zone08 > 0 ? ((zoneIndiv.Zone08 / zoneBulk.Zone08) * 100).toFixed(1) : "0",
    },
    {
      name: "Zone VS",
      bulk: zoneBulk.ZoneVS > 0 ? zoneBulk.ZoneVS : 0,
      individual: zoneIndiv.ZoneVS > 0 ? zoneIndiv.ZoneVS : 0,
      loss: zoneLoss.ZoneVS,
      efficiency: zoneBulk.ZoneVS > 0 ? ((zoneIndiv.ZoneVS / zoneBulk.ZoneVS) * 100).toFixed(1) : "0",
    },
  ]
}

// Generate Radar chart data for efficiency and loss comparison by zone
const generateRadarData = (waterData: WaterData, month: string) => {
  const zonePerformance = generateZonePerformanceData(waterData, month)

  return zonePerformance.map((zone) => ({
    subject: zone.name,
    efficiency: Number.parseFloat(zone.efficiency.toString()),
    loss: zone.bulk > 0 ? Number.parseFloat(((zone.loss / zone.bulk) * 100).toFixed(1)) : 0,
    fullMark: 100,
  }))
}

// Generate Direct Connection breakdown data for the selected month
const generateDCBreakdownData = (waterData: WaterData, month: string) => {
  const dcData = waterData.directConnection.find((m) => m.month === month)

  if (!dcData) return []

  const total = dcData.DC
  const other = total - dcData.Irrigation - dcData.DBuildingCommon - dcData.MBCommon

  return [
    {
      name: "Irrigation",
      value: dcData.Irrigation,
      percentage: total > 0 ? ((dcData.Irrigation / total) * 100).toFixed(1) : "0",
    },
    {
      name: "D Building Common",
      value: dcData.DBuildingCommon,
      percentage: total > 0 ? ((dcData.DBuildingCommon / total) * 100).toFixed(1) : "0",
    },
    {
      name: "MB Common",
      value: dcData.MBCommon,
      percentage: total > 0 ? ((dcData.MBCommon / total) * 100).toFixed(1) : "0",
    },
    { name: "Other", value: other, percentage: total > 0 ? ((other / total) * 100).toFixed(1) : "0" },
  ]
}

// Generate Loss Distribution data for the selected month
const generateLossDistributionData = (waterData: WaterData, month: string) => {
  const zonePerformance = generateZonePerformanceData(waterData, month)

  return zonePerformance
    .filter((zone) => zone.loss > 0)
    .map((zone) => ({
      name: zone.name,
      value: zone.loss,
      percentage: ((zone.loss / zonePerformance.reduce((sum, z) => sum + (z.loss > 0 ? z.loss : 0), 0)) * 100).toFixed(
        1,
      ),
    }))
}

// Data Filter component
interface DataFilterProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}

const DataFilter = ({ label, options, value, onChange, className }: DataFilterProps) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <label className="text-sm font-medium text-white">{label}:</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/10 border border-white/20 text-white rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
        aria-label={`Select ${label}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// Time Range Slider component
interface TimeRangeSliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  labels: string[]
}

const TimeRangeSlider = ({ value, onChange, min, max, labels }: TimeRangeSliderProps) => {
  return (
    <div className="w-full px-4">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number.parseInt(e.target.value))}
        className="w-full h-2 bg-gradient-to-r from-[#8ACCD5] to-[#8ACCD5] rounded-lg appearance-none cursor-pointer"
        aria-label="Time range slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <div className="flex justify-between mt-2 text-xs text-white">
        {labels.map((label, index) => (
          <span key={index} className={value === index ? "font-bold text-white bg-[#4E4456] px-2 py-1 rounded" : ""}>
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function WaterDashboard() {
  // Use the dynamic data from our data service
  const [waterData, setWaterData] = useState<WaterData>(defaultWaterData)
  const [selectedMonth, setSelectedMonth] = useState("Mar-25")
  const [selectedZone, setSelectedZone] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState(14) // Default to latest month
  const [showAnimations, setShowAnimations] = useState(false)
  const isMobile = useMobile()

  // Function to handle data loaded from file upload
  const handleDataLoaded = (data: WaterData) => {
    setWaterData(data)
    // Set selected month to the latest available
    if (data.summary.length > 0) {
      setSelectedMonth(data.summary[data.summary.length - 1].month)
      setTimeRange(data.summary.length - 1)
    }
  }

  // Update selectedMonth based on the last month in the selected time range
  useEffect(() => {
    const lastMonthIndex = timeRange
    if (lastMonthIndex >= 0 && lastMonthIndex < waterData.summary.length) {
      setSelectedMonth(waterData.summary[lastMonthIndex].month)
    }
  }, [timeRange, waterData.summary])

  // Generate month options for filter
  const monthOptions = waterData.summary.map((month) => ({
    value: month.month,
    label: month.month,
  }))

  // Zone options for filter
  const zoneOptions = [
    { value: "all", label: "All Zones" },
    { value: "Zone01FM", label: "Zone 01 FM" },
    { value: "Zone03A", label: "Zone 03(A)" },
    { value: "Zone03B", label: "Zone 03(B)" },
    { value: "Zone05", label: "Zone 05" },
    { value: "Zone08", label: "Zone 08" },
    { value: "ZoneVS", label: "Zone VS" },
  ]

  // Time range labels
  const timeRangeLabels = waterData.summary.map((month) => month.month)

  // Latest month metrics for dashboard cards
  const latestData =
    waterData.summary.find((m) => m.month === selectedMonth) || waterData.summary[waterData.summary.length - 1]
  const previousMonthIndex = waterData.summary.indexOf(latestData) - 1
  const previousMonthData = previousMonthIndex >= 0 ? waterData.summary[previousMonthIndex] : latestData

  const efficiency =
    latestData.L1 > 0 ? (((latestData.L1 - latestData.TotalLoss) / latestData.L1) * 100).toFixed(1) : "0"
  const prevEfficiency =
    previousMonthData.L1 > 0 ? ((previousMonthData.L1 - previousMonthData.TotalLoss) / previousMonthData.L1) * 100 : 0
  const efficiencyChange = (Number.parseFloat(efficiency) - prevEfficiency).toFixed(1)

  // Efficiency trend data
  const efficiencyData = calculateEfficiency(waterData)

  // Filter data based on time range
  const filteredData = timeRange === waterData.summary.length - 1 ? [waterData.summary[timeRange]] : waterData.summary.slice(0, timeRange + 1)

  // 3D flow data
  const flowData = generate3DFlowData(waterData, selectedMonth)

  // Zone performance data
  const zonePerformanceData = generateZonePerformanceData(waterData, selectedMonth)

  // Direct Connection breakdown
  const dcBreakdownData = generateDCBreakdownData(waterData, selectedMonth)

  // Loss Distribution data
  const lossDistributionData = generateLossDistributionData(waterData, selectedMonth)

  // Radar chart data
  const radarData = generateRadarData(waterData, selectedMonth)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with solid background */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `#8ACCD5`,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="url(#smallGrid)" />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">Muscat Bay Water Management</h1>
              <p className="text-purple-100 mt-1">Advanced Real-time Analytics Dashboard</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
              <DataFilter
                label="Month"
                options={monthOptions}
                value={selectedMonth}
                onChange={setSelectedMonth}
                className="bg-white/10 rounded-lg px-3 py-2 text-white"
              />

              <DataFilter
                label="Zone"
                options={zoneOptions}
                value={selectedZone}
                onChange={setSelectedZone}
                className="bg-white/10 rounded-lg px-3 py-2 text-white"
              />

              <button
                onClick={() => setShowAnimations(!showAnimations)}
                className="bg-white/10 text-white rounded-lg px-3 py-2 text-sm flex items-center"
                aria-pressed={showAnimations}
              >
                {showAnimations ? "Disable Animations" : "Enable Animations"}
              </button>
            </div>
          </div>

          {/* Time Range Slider with white text */}
          <div className="mt-6">
            <TimeRangeSlider value={timeRange} onChange={setTimeRange} min={0} max={waterData.summary.length - 1} labels={timeRangeLabels} />
          </div>
        </div>
      </div>

      {/* Data Uploader Component */}
      <div className="container mx-auto px-4 pt-6">
        <DataUploader onDataLoaded={handleDataLoaded} />
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <TabsList className="flex overflow-x-auto scrollbar-hide h-auto">
              <TabsTrigger
                value="overview"
                className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
              >
                Dashboard Overview
              </TabsTrigger>
              <TabsTrigger
                value="zoneAnalysis"
                className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
              >
                Zone Analysis
              </TabsTrigger>
              <TabsTrigger
                value="lossAnalysis"
                className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
              >
                Loss Analysis
              </TabsTrigger>
              <TabsTrigger
                value="trends"
                className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
              >
                Trend Analysis
              </TabsTrigger>
              <TabsTrigger
                value="directConnection"
                className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
              >
                Direct Connection
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
              >
                Reports & Insights
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-6">
          {/* Dashboard Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnimatedCard
                title="Total Water Supply (L1)"
                value={latestData.L1}
                unit="m³"
                change={
                  previousMonthData.L1 > 0 ? ((latestData.L1 / previousMonthData.L1 - 1) * 100).toFixed(1) : "N/A"
                }
                changeLabel="vs previous month"
                gradient={generateGradient(BASE_COLOR, ACCENT_COLOR)}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />

              <AnimatedCard
                title="End User Consumption (L3)"
                value={latestData.L3}
                unit="m³"
                change={
                  previousMonthData.L3 > 0 ? ((latestData.L3 / previousMonthData.L3 - 1) * 100).toFixed(1) : "N/A"
                }
                changeLabel="vs previous month"
                gradient={generateGradient(SUCCESS_COLOR, ACCENT_COLOR)}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
              />

              <AnimatedCard
                title="Total Water Loss"
                value={latestData.TotalLoss}
                unit="m³"
                change={
                  previousMonthData.TotalLoss > 0
                    ? ((latestData.TotalLoss / previousMonthData.TotalLoss - 1) * 100).toFixed(1)
                    : "N/A"
                }
                changeLabel="vs previous month"
                gradient={generateGradient(DANGER_COLOR, WARNING_COLOR)}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                }
              />

              <AnimatedCard
                title="System Efficiency"
                value={Number.parseFloat(efficiency)}
                unit="%"
                change={
                  !isNaN(Number.parseFloat(efficiencyChange)) && isFinite(Number.parseFloat(efficiencyChange))
                    ? efficiencyChange
                    : "N/A"
                }
                changeLabel="vs previous month"
                gradient={
                  Number.parseFloat(efficiency) > 80
                    ? generateGradient(SUCCESS_COLOR, INFO_COLOR)
                    : Number.parseFloat(efficiency) > 70
                      ? generateGradient(WARNING_COLOR, INFO_COLOR)
                      : generateGradient(DANGER_COLOR, WARNING_COLOR)
                }
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                }
              />
            </div>

            {/* Main Chart and Side Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Water Flow Distribution Bar Chart */}
              <Card className="lg:col-span-2 p-5">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Water Flow Distribution - {selectedMonth}</h2>
                <div className="h-96" aria-label={`Water flow distribution chart for ${selectedMonth}`}>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={flowData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <defs>
                        <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={BASE_COLOR} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={ACCENT_COLOR} stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <Bar
                        dataKey="value"
                        name="Volume (m³)"
                        fill="url(#colorFlow)"
                        radius={[4, 4, 0, 0]}
                        activeBar={{ fill: "#4E4456", stroke: "#4E4456" }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* System Efficiency Trend Line Chart */}
              <Card className="p-5">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">System Efficiency Trend</h2>
                <div className="h-64 mb-4" aria-label="System efficiency trend chart">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={efficiencyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <defs>
                        <linearGradient id="colorEfficiency" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ACCENT_COLOR} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={ACCENT_COLOR} stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <Line
                        type="monotone"
                        dataKey="efficiency"
                        stroke={ACCENT_COLOR}
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 2, fill: "#4E4456", stroke: "#4E4456" }}
                        name="Efficiency %"
                        fill="url(#colorEfficiency)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Efficiency Progress Bars */}
                <div>
                  <AnimatedProgressBar
                    value={latestData.L3}
                    max={latestData.L1}
                    color={SUCCESS_COLOR}
                    label="Overall Efficiency"
                    additionalInfo={`${latestData.L3.toLocaleString()} of ${latestData.L1.toLocaleString()} m³ utilized`}
                  />
                  <AnimatedProgressBar
                    value={latestData.Stage01Loss}
                    max={latestData.L1}
                    color={DANGER_COLOR}
                    label="Stage 01 Loss"
                    additionalInfo={`${latestData.Stage01Loss.toLocaleString()} m³ lost before reaching zones`}
                  />
                  <AnimatedProgressBar
                    value={latestData.Stage02Loss}
                    max={latestData.L2}
                    color={WARNING_COLOR}
                    label="Stage 02 Loss"
                    additionalInfo={`${latestData.Stage02Loss.toLocaleString()} m³ lost within zones`}
                  />
                </div>
              </Card>
            </div>

            {/* Zone Performance & Direct Connection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Zone Efficiency and Loss Radar Chart */}
              <Card className="p-5">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Zone Performance Overview</h2>
                <div className="h-80" aria-label="Zone performance radar chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart outerRadius={90} data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Efficiency %"
                        dataKey="efficiency"
                        stroke={SUCCESS_COLOR}
                        fill={SUCCESS_COLOR}
                        fillOpacity={0.6}
                      />
                      <Radar name="Loss %" dataKey="loss" stroke={DANGER_COLOR} fill={DANGER_COLOR} fillOpacity={0.6} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Direct Connection Breakdown Modern Donut Chart */}
              <Card className="p-5">
                <div className="h-80" aria-label={`Direct connection components donut chart for ${selectedMonth}`}>
                  <ModernDonutChart
                    data={dcBreakdownData}
                    colors={[ACCENT_COLOR, INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR]}
                    title={`Direct Connection Breakdown - ${selectedMonth}`}
                  />
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Zone Analysis Tab */}
          <TabsContent value="zoneAnalysis" className="space-y-6">
            <Card className="p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Zone Comparison - {selectedMonth}</h2>
              <div className="h-96" aria-label={`Zone comparison chart for ${selectedMonth}`}>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={zonePerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="bulk" fill={ZONE_COLORS[0]} radius={[4, 4, 0, 0]} name="Bulk Meters" />
                    <Bar
                      dataKey="individual"
                      fill={ZONE_COLORS[1]}
                      radius={[4, 4, 0, 0]}
                      name="Individual Consumption"
                    />
                    <Line type="monotone" dataKey="loss" stroke={DANGER_COLOR} strokeWidth={2} name="Loss" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-5">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Zone Efficiency Ranking</h2>
                <div className="space-y-4">
                  {zonePerformanceData
                    .filter((zone) => zone.bulk > 0)
                    .sort(
                      (a, b) => Number.parseFloat(b.efficiency.toString()) - Number.parseFloat(a.efficiency.toString()),
                    )
                    .map((zone, index) => {
                      const efficiency = Number.parseFloat(zone.efficiency.toString())
                      let color = SUCCESS_COLOR
                      if (efficiency < 70) color = DANGER_COLOR
                      else if (efficiency < 85) color = WARNING_COLOR

                      return (
                        <div key={zone.name} className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium text-gray-700">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-gray-700">{zone.name}</span>
                              <span className="font-medium" style={{ color }}>
                                {efficiency}%
                              </span>
                            </div>
                            <div
                              className="w-full bg-gray-200 rounded-full h-2"
                              role="progressbar"
                              aria-valuenow={efficiency}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label={`${zone.name} efficiency: ${efficiency}%`}
                            >
                              <div
                                className="h-2 rounded-full"
                                style={{ background: color, width: `${efficiency}%` }}
                              ></div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {zone.individual.toLocaleString()} of {zone.bulk.toLocaleString()} m³ utilized
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </Card>

              <Card className="p-5">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Zone Loss Analysis</h2>
                <div className="h-80" aria-label="Zone loss analysis scatter chart">
                  <ResponsiveContainer width="100%" height={250}>
                    <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" dataKey="bulk" name="Total Zone Supply (m³)" />
                      <YAxis type="number" dataKey="loss" name="Zone Loss (m³)" />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                                <p className="font-medium text-gray-700">{payload[0].payload.name}</p>
                                <p className="text-sm">
                                  Supply:{" "}
                                  <span className="font-medium">{payload[0].payload.bulk.toLocaleString()} m³</span>
                                </p>
                                <p className="text-sm">
                                  Loss:{" "}
                                  <span className="font-medium">{payload[0].payload.loss.toLocaleString()} m³</span>
                                </p>
                                <p className="text-sm">
                                  Efficiency: <span className="font-medium">{payload[0].payload.efficiency}%</span>
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Scatter
                        name="Zones"
                        data={zonePerformanceData.filter((zone) => zone.bulk > 0)}
                        fill={BASE_COLOR}
                      >
                        {zonePerformanceData
                          .filter((zone) => zone.bulk > 0)
                          .map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                Number.parseFloat(entry.efficiency.toString()) > 85
                                  ? SUCCESS_COLOR
                                  : Number.parseFloat(entry.efficiency.toString()) > 70
                                    ? WARNING_COLOR
                                    : DANGER_COLOR
                              }
                            />
                          ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Loss Analysis Tab */}
          <TabsContent value="lossAnalysis" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AnimatedCard
                title="Stage 01 Loss"
                value={latestData.Stage01Loss}
                unit="m³"
                change={
                  previousMonthData.Stage01Loss > 0
                    ? ((latestData.Stage01Loss / previousMonthData.Stage01Loss - 1) * 100).toFixed(1)
                    : "N/A"
                }
                changeLabel="vs previous month"
                gradient={generateGradient(DANGER_COLOR, WARNING_COLOR)}
              />

              <AnimatedCard
                title="Stage 02 Loss"
                value={latestData.Stage02Loss}
                unit="m³"
                change={
                  previousMonthData.Stage02Loss > 0
                    ? ((latestData.Stage02Loss / previousMonthData.Stage02Loss - 1) * 100).toFixed(1)
                    : "N/A"
                }
                changeLabel="vs previous month"
                gradient={generateGradient(WARNING_COLOR, ACCENT_COLOR)}
              />

              <AnimatedCard
                title="Total System Loss"
                value={latestData.TotalLoss}
                unit="m³"
                change={
                  previousMonthData.TotalLoss > 0
                    ? ((latestData.TotalLoss / previousMonthData.TotalLoss - 1) * 100).toFixed(1)
                    : "N/A"
                }
                changeLabel="vs previous month"
                gradient={generateGradient(DANGER_COLOR, ACCENT_COLOR)}
              />
            </div>

            <Card className="p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Loss Trends Over Time</h2>
              <div className="h-96" aria-label="Loss trends over time chart">
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <defs>
                      <linearGradient id="colorStage01" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={DANGER_COLOR} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={DANGER_COLOR} stopOpacity={0.3} />
                      </linearGradient>
                      <linearGradient id="colorStage02" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={WARNING_COLOR} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={WARNING_COLOR} stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="Stage01Loss"
                      name="Stage 01 Loss"
                      fill="url(#colorStage01)"
                      stroke={DANGER_COLOR}
                      stackId="1"
                    />
                    <Area
                      type="monotone"
                      dataKey="Stage02Loss"
                      name="Stage 02 Loss"
                      fill="url(#colorStage02)"
                      stroke={WARNING_COLOR}
                      stackId="1"
                    />
                    <Line type="monotone" dataKey="TotalLoss" name="Total Loss" stroke={BASE_COLOR} strokeWidth={3} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-5">
                <div className="h-80" aria-label="Loss distribution by zone pie chart">
                  <ModernDonutChart
                    data={lossDistributionData}
                    colors={ZONE_COLORS}
                    title={`Loss Distribution by Zone - ${selectedMonth}`}
                  />
                </div>
              </Card>

              {/* Zone Loss Radial Bar Chart */}
              <Card className="p-5">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Loss to Supply Ratio</h2>
                <div className="h-80" aria-label="Loss to supply ratio radial bar chart">
                  <ResponsiveContainer width="100%" height={350}>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={140}
                      barSize={10}
                      data={zonePerformanceData}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" type="category" />
                      <PolarRadiusAxis angle={0} domain={[0, "auto"]} />
                      <RadialBar minAngle={1.5} label={{ position: "insideStart", fill: "#fff" }} dataKey="loss">
                        {zonePerformanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={ZONE_COLORS[index % ZONE_COLORS.length]} />
                        ))}
                      </RadialBar>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Trend Analysis Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Water Supply & Consumption Trends</h2>
              <div className="h-96" aria-label="Water supply and consumption trends chart">
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <defs>
                      <linearGradient id="colorL1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BASE_COLOR} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={BASE_COLOR} stopOpacity={0.3} />
                      </linearGradient>
                      <linearGradient id="colorL3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={SUCCESS_COLOR} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={SUCCESS_COLOR} stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="L1"
                      name="Main Supply (L1)"
                      fill="url(#colorL1)"
                      stroke={BASE_COLOR}
                    />
                    <Area
                      type="monotone"
                      dataKey="L3"
                      name="End User Consumption (L3)"
                      fill="url(#colorL3)"
                      stroke={SUCCESS_COLOR}
                    />
                    <Line
                      type="monotone"
                      dataKey="L2"
                      name="Zone Distribution (L2)"
                      stroke={ACCENT_COLOR}
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-5">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Zone Consumption Trends</h2>
                <div className="h-80" aria-label="Zone consumption trends chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" allowDuplicatedCategory={false} />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {zoneOptions
                        .filter((zone) => zone.value !== "all")
                        .map((zone, index) => (
                          <Line
                            key={zone.value}
                            data={waterData.zones.bulkMeters.map((item) => ({
                              month: item.month,
                              [zone.value]: item[zone.value],
                            }))}
                            dataKey={zone.value}
                            name={zone.label}
                            stroke={ZONE_COLORS[index % ZONE_COLORS.length]}
                            strokeWidth={2}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                          />
                        ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-5">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Zone Efficiency Trends</h2>
                <div className="h-80" aria-label="Zone efficiency trends chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" allowDuplicatedCategory={false} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend />
                      {zoneOptions
                        .filter((zone) => zone.value !== "all")
                        .map((zone, index) => {
                          const zoneData = waterData.zones.bulkMeters.map((bulk, i) => {
                            const indiv = waterData.zones.individual[i]
                            return {
                              month: bulk.month,
                              [zone.value]:
                                bulk[zone.value] > 0 ? ((indiv[zone.value] / bulk[zone.value]) * 100).toFixed(1) : 0,
                            }
                          })

                          return (
                            <Line
                              key={zone.value}
                              data={zoneData}
                              dataKey={zone.value}
                              name={zone.label}
                              stroke={ZONE_COLORS[index % ZONE_COLORS.length]}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          )
                        })}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Direct Connection Tab */}
          <TabsContent value="directConnection" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AnimatedCard
                title="Total Direct Connection"
                value={waterData.directConnection.find((m) => m.month === selectedMonth)?.DC || 0}
                unit="m³"
                gradient={generateGradient(BASE_COLOR, ACCENT_COLOR)}
              />

              <AnimatedCard
                title="Irrigation"
                value={waterData.directConnection.find((m) => m.month === selectedMonth)?.Irrigation || 0}
                unit="m³"
                gradient={generateGradient(SUCCESS_COLOR, INFO_COLOR)}
              />

              <AnimatedCard
                title="Building Commons"
                value={
                  (waterData.directConnection.find((m) => m.month === selectedMonth)?.DBuildingCommon || 0) +
                  (waterData.directConnection.find((m) => m.month === selectedMonth)?.MBCommon || 0)
                }
                unit="m³"
                gradient={generateGradient(INFO_COLOR, ACCENT_COLOR)}
              />
            </div>

            <Card className="p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Direct Connection Trend Analysis</h2>
              <div className="h-96" aria-label="Direct connection trend analysis chart">
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={waterData.directConnection}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <defs>
                      <linearGradient id="colorDC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={BASE_COLOR} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={BASE_COLOR} stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="DC"
                      name="Total Direct Connection"
                      fill="url(#colorDC)"
                      stroke={BASE_COLOR}
                    />
                    <Bar dataKey="Irrigation" name="Irrigation" fill={SUCCESS_COLOR} />
                    <Bar dataKey="DBuildingCommon" name="D Building Common" fill={INFO_COLOR} />
                    <Bar dataKey="MBCommon" name="MB Common" fill={ACCENT_COLOR} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-5">
                <div className="h-80" aria-label={`Direct connection components pie chart for ${selectedMonth}`}>
                  <ModernDonutChart
                    data={dcBreakdownData}
                    colors={[ACCENT_COLOR, INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR]}
                    title={`Direct Connection Components - ${selectedMonth}`}
                  />
                </div>
              </Card>

              <Card className="p-5">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Total MB to Pay Trend</h2>
                <div className="h-80" aria-label="Total MB to pay trend bar chart">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={waterData.totalMBToPay}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value.toLocaleString()} m³`} />
                      <Legend />
                      <defs>
                        <linearGradient id="colorMBToPay" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ACCENT_COLOR} stopOpacity={0.8} />
                          <stop offset="95%" stopColor={ACCENT_COLOR} stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="value" name="Total MB to Pay" fill="url(#colorMBToPay)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Reports & Insights Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card className="p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">System Performance Report - {selectedMonth}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Performance Metrics</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 text-gray-600">Total Supply (L1)</td>
                        <td className="py-2 font-medium text-right">{latestData.L1.toLocaleString()} m³</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 text-gray-600">Zone Distribution (L2)</td>
                        <td className="py-2 font-medium text-right">{latestData.L2.toLocaleString()} m³</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 text-gray-600">End User Consumption (L3)</td>
                        <td className="py-2 font-medium text-right">{latestData.L3.toLocaleString()} m³</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 text-gray-600">Stage 01 Loss</td>
                        <td className="py-2 font-medium text-right">{latestData.Stage01Loss.toLocaleString()} m³</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 text-gray-600">Stage 02 Loss</td>
                        <td className="py-2 font-medium text-right">{latestData.Stage02Loss.toLocaleString()} m³</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 text-gray-600">Total Loss</td>
                        <td className="py-2 font-medium text-right">{latestData.TotalLoss.toLocaleString()} m³</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 text-gray-600">System Efficiency</td>
                        <td className="py-2 font-medium text-right">{efficiency}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-3">Zone Performance</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-2 text-left text-gray-600">Zone</th>
                        <th className="py-2 text-right text-gray-600">Efficiency</th>
                        <th className="py-2 text-right text-gray-600">Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {zonePerformanceData.map((zone) => (
                        <tr key={zone.name} className="border-b border-gray-200">
                          <td className="py-2 text-gray-700">{zone.name}</td>
                          <td className="py-2 font-medium text-right">
                            {Number.parseFloat(zone.efficiency.toString()) > 85 ? (
                              <span className="text-green-500">{zone.efficiency}%</span>
                            ) : Number.parseFloat(zone.efficiency.toString()) > 70 ? (
                              <span className="text-yellow-500">{zone.efficiency}%</span>
                            ) : (
                              <span className="text-red-500">{zone.efficiency}%</span>
                            )}
                          </td>
                          <td className="py-2 font-medium text-right">{zone.loss.toLocaleString()} m³</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-3">Performance Insights</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-3">
                    <span className="font-medium">System Efficiency:</span> The water system is currently operating at{" "}
                    <span className="font-medium">{efficiency}%</span> efficiency, which is{" "}
                    {Number.parseFloat(efficiency) > 85
                      ? "excellent"
                      : Number.parseFloat(efficiency) > 70
                        ? "acceptable"
                        : "below target"}
                    .
                  </p>
                  <p className="text-gray-700 mb-3">
                    <span className="font-medium">Key Observations:</span>
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>
                      Stage 01 Loss: {Math.abs(latestData.Stage01Loss)} m³{" "}
                      {latestData.Stage01Loss > 0 ? "lost" : "gained"} in main distribution lines
                    </li>
                    <li>
                      Zone 03A has the highest loss at{" "}
                      {zonePerformanceData.find((z) => z.name === "Zone 03A")?.loss.toLocaleString()} m³
                    </li>
                    <li>
                      Direct Connection usage:{" "}
                      {waterData.directConnection.find((m) => m.month === selectedMonth)?.DC.toLocaleString()} m³
                    </li>
                    <li>
                      Irrigation accounts for {dcBreakdownData.find((d) => d.name === "Irrigation")?.percentage}% of
                      Direct Connection usage
                    </li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    <span className="font-medium">Recommendations:</span>
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Investigate Zone 03A for potential leaks or metering issues</li>
                    <li>Review Stage 01 distribution lines for maintenance needs</li>
                    <li>Optimize irrigation schedules to reduce consumption</li>
                    <li>Consider implementing real-time monitoring for high-loss zones</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className="bg-[#8ACCD5] text-white px-4 py-2 rounded-lg shadow hover:bg-[#7BBBC4] transition-colors"
                  aria-label="Export report"
                >
                  Export Report
                </button>
              </div>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <div className="bg-white border-t mt-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">Muscat Bay Water Management System © 2025</p>
            <div className="text-sm font-medium" style={{ color: "#4E4456" }}>
              <span className="mr-2">Selected Period:</span> {selectedMonth}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

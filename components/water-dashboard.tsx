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
  ReferenceLine,
} from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import ModernDonutChart from "@/components/modern-donut-chart"

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
const ZONE_COLORS = [
  "#8ACCD5", // Teal/Light Blue (primary accent)
  "#4E4456", // Dark Purple/Aubergine
  "#5BC0DE", // Info Blue
  "#50C878", // Success Green
  "#FFB347", // Warning Orange
  "#FF6B6B", // Danger Red
]
const LOSS_COLORS = [DANGER_COLOR, WARNING_COLOR, lightenColor(DANGER_COLOR, 0.3)]
const PIE_COLORS = [ACCENT_COLOR, INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR, SECONDARY_COLOR]

// Water distribution data
const waterData = {
  summary: [
    { month: "Jan-24", L1: 32803, L2: 28689, L3: 25680, Stage01Loss: 4114, Stage02Loss: 3009, TotalLoss: 7123 },
    { month: "Feb-24", L1: 27996, L2: 25073, L3: 21908, Stage01Loss: 2923, Stage02Loss: 3165, TotalLoss: 6088 },
    { month: "Mar-24", L1: 23860, L2: 24007, L3: 19626, Stage01Loss: -147, Stage02Loss: 4381, TotalLoss: 4234 },
    { month: "Apr-24", L1: 31869, L2: 28713, L3: 23584, Stage01Loss: 3156, Stage02Loss: 5129, TotalLoss: 8285 },
    { month: "May-24", L1: 30737, L2: 28089, L3: 23692, Stage01Loss: 2648, Stage02Loss: 4397, TotalLoss: 7045 },
    { month: "Jun-24", L1: 41953, L2: 34626, L3: 27865, Stage01Loss: 7327, Stage02Loss: 6761, TotalLoss: 14088 },
    { month: "Jul-24", L1: 35166, L2: 34689, L3: 25961, Stage01Loss: 477, Stage02Loss: 8728, TotalLoss: 9205 },
    { month: "Aug-24", L1: 35420, L2: 32753, L3: 25246, Stage01Loss: 2667, Stage02Loss: 7507, TotalLoss: 10174 },
    { month: "Sep-24", L1: 41341, L2: 30892, L3: 23744, Stage01Loss: 10449, Stage02Loss: 7148, TotalLoss: 17597 },
    { month: "Oct-24", L1: 31519, L2: 39285, L3: 30881, Stage01Loss: -7766, Stage02Loss: 8404, TotalLoss: 637 },
    { month: "Nov-24", L1: 35290, L2: 29913, L3: 24719, Stage01Loss: 5377, Stage02Loss: 5194, TotalLoss: 10571 },
    { month: "Dec-24", L1: 36733, L2: 32492, L3: 24545, Stage01Loss: 4241, Stage02Loss: 7947, TotalLoss: 12188 },
    { month: "Jan-25", L1: 32580, L2: 35325, L3: 27898, Stage01Loss: -2745, Stage02Loss: 7427, TotalLoss: 4682 },
    { month: "Feb-25", L1: 44043, L2: 35811, L3: 28369, Stage01Loss: 8232, Stage02Loss: 7442, TotalLoss: 15674 },
    { month: "Mar-25", L1: 34915, L2: 39565, L3: 32264, Stage01Loss: -4650, Stage02Loss: 7301, TotalLoss: 2651 },
    { month: "Apr-25", L1: 46039, L2: 45868, L3: 37192, Stage01Loss: 171, Stage02Loss: 8676, TotalLoss: 8847 },
  ],
  zones: {
    bulkMeters: [
      { month: "Jan-24", Zone01FM: 1595, Zone03A: 1234, Zone03B: 2653, Zone05: 4286, Zone08: 2170, ZoneVS: 26 },
      { month: "Feb-24", Zone01FM: 1283, Zone03A: 1099, Zone03B: 2169, Zone05: 3897, Zone08: 1825, ZoneVS: 19 },
      { month: "Mar-24", Zone01FM: 1255, Zone03A: 1297, Zone03B: 2315, Zone05: 4127, Zone08: 2021, ZoneVS: 72 },
      { month: "Apr-24", Zone01FM: 1383, Zone03A: 1892, Zone03B: 2381, Zone05: 4911, Zone08: 2753, ZoneVS: 60 },
      { month: "May-24", Zone01FM: 1411, Zone03A: 2254, Zone03B: 2634, Zone05: 2639, Zone08: 2722, ZoneVS: 125 },
      { month: "Jun-24", Zone01FM: 2078, Zone03A: 2227, Zone03B: 2932, Zone05: 4992, Zone08: 3193, ZoneVS: 277 },
      { month: "Jul-24", Zone01FM: 2601, Zone03A: 3313, Zone03B: 3369, Zone05: 5305, Zone08: 3639, ZoneVS: 143 },
      { month: "Aug-24", Zone01FM: 1638, Zone03A: 3172, Zone03B: 3458, Zone05: 4039, Zone08: 3957, ZoneVS: 137 },
      { month: "Sep-24", Zone01FM: 1550, Zone03A: 2698, Zone03B: 3742, Zone05: 2736, Zone08: 3947, ZoneVS: 145 },
      { month: "Oct-24", Zone01FM: 2098, Zone03A: 3715, Zone03B: 2906, Zone05: 3383, Zone08: 4296, ZoneVS: 63 },
      { month: "Nov-24", Zone01FM: 1808, Zone03A: 3501, Zone03B: 2695, Zone05: 1438, Zone08: 3569, ZoneVS: 34 },
      { month: "Dec-24", Zone01FM: 1946, Zone03A: 3796, Zone03B: 3583, Zone05: 3788, Zone08: 3018, ZoneVS: 17 },
      { month: "Jan-25", Zone01FM: 2008, Zone03A: 4235, Zone03B: 3256, Zone05: 4267, Zone08: 1547, ZoneVS: 14 },
      { month: "Feb-25", Zone01FM: 1740, Zone03A: 4273, Zone03B: 2962, Zone05: 4231, Zone08: 1498, ZoneVS: 12 },
      { month: "Mar-25", Zone01FM: 1880, Zone03A: 3591, Zone03B: 3331, Zone05: 3862, Zone08: 2605, ZoneVS: 21 },
      { month: "Apr-25", Zone01FM: 1880, Zone03A: 4041, Zone03B: 2157, Zone05: 3737, Zone08: 3203, ZoneVS: 13 },
    ],
    individual: [
      { month: "Jan-24", Zone01FM: 1746, Zone03A: 1387, Zone03B: 1664, Zone05: 2172, Zone08: 1986, ZoneVS: 0 },
      { month: "Feb-24", Zone01FM: 1225, Zone03A: 1268, Zone03B: 1443, Zone05: 1623, Zone08: 1560, ZoneVS: 11 },
      { month: "Mar-24", Zone01FM: 1194, Zone03A: 1179, Zone03B: 1536, Zone05: 1032, Zone08: 1749, ZoneVS: 65 },
      { month: "Apr-24", Zone01FM: 1316, Zone03A: 1179, Zone03B: 1555, Zone05: 1553, Zone08: 2597, ZoneVS: 32 },
      { month: "May-24", Zone01FM: 1295, Zone03A: 1348, Zone03B: 1552, Zone05: 788, Zone08: 2372, ZoneVS: 19 },
      { month: "Jun-24", Zone01FM: 1909, Zone03A: 1177, Zone03B: 1669, Zone05: 1274, Zone08: 2718, ZoneVS: 148 },
      { month: "Jul-24", Zone01FM: 2369, Zone03A: 1172, Zone03B: 1781, Zone05: 1861, Zone08: 2311, ZoneVS: 119 },
      { month: "Aug-24", Zone01FM: 1619, Zone03A: 1473, Zone03B: 1643, Zone05: 1137, Zone08: 2896, ZoneVS: 134 },
      { month: "Sep-24", Zone01FM: 1425, Zone03A: 1264, Zone03B: 1496, Zone05: 858, Zone08: 2493, ZoneVS: 46 },
      { month: "Oct-24", Zone01FM: 1485, Zone03A: 1657, Zone03B: 1789, Zone05: 1100, Zone08: 1977, ZoneVS: 54 },
      { month: "Nov-24", Zone01FM: 1756, Zone03A: 1560, Zone03B: 1423, Zone05: 1057, Zone08: 2070, ZoneVS: 34 },
      { month: "Dec-24", Zone01FM: 1975, Zone03A: 1475, Zone03B: 1883, Zone05: 1154, Zone08: 1680, ZoneVS: 35 },
      { month: "Jan-25", Zone01FM: 2062, Zone03A: 1359, Zone03B: 1713, Zone05: 1254, Zone08: 1477, ZoneVS: 25 },
      { month: "Feb-25", Zone01FM: 1832, Zone03A: 1349, Zone03B: 1451, Zone05: 1233, Zone08: 1379, ZoneVS: 30 },
      { month: "Mar-25", Zone01FM: 1817, Zone03A: 1129, Zone03B: 1470, Zone05: 1184, Zone08: 2356, ZoneVS: 0 },
      { month: "Apr-25", Zone01FM: 1629, Zone03A: 1247, Zone03B: 940, Zone05: 1480, Zone08: 1057, ZoneVS: 2 },
    ],
    loss: [
      { month: "Jan-24", Zone01FM: -151, Zone03A: -153, Zone03B: 989, Zone05: 2114, Zone08: 184, ZoneVS: 26 },
      { month: "Feb-24", Zone01FM: 58, Zone03A: -169, Zone03B: 726, Zone05: 2274, Zone08: 265, ZoneVS: 8 },
      { month: "Mar-24", Zone01FM: 61, Zone03A: 118, Zone03B: 779, Zone05: 3095, Zone08: 272, ZoneVS: 7 },
      { month: "Apr-24", Zone01FM: 67, Zone03A: 713, Zone03B: 826, Zone05: 3358, Zone08: 156, ZoneVS: 28 },
      { month: "May-24", Zone01FM: 116, Zone03A: 906, Zone03B: 1082, Zone05: 1851, Zone08: 350, ZoneVS: 106 },
      { month: "Jun-24", Zone01FM: 169, Zone03A: 1050, Zone03B: 1263, Zone05: 3718, Zone08: 475, ZoneVS: 129 },
      { month: "Jul-24", Zone01FM: 232, Zone03A: 2141, Zone03B: 1588, Zone05: 3444, Zone08: 1328, ZoneVS: 24 },
      { month: "Aug-24", Zone01FM: 19, Zone03A: 1699, Zone03B: 1815, Zone05: 2902, Zone08: 1061, ZoneVS: 3 },
      { month: "Sep-24", Zone01FM: 125, Zone03A: 1434, Zone03B: 2246, Zone05: 1878, Zone08: 1454, ZoneVS: 99 },
      { month: "Oct-24", Zone01FM: 613, Zone03A: 2058, Zone03B: 1117, Zone05: 2283, Zone08: 2319, ZoneVS: 9 },
      { month: "Nov-24", Zone01FM: 52, Zone03A: 1941, Zone03B: 1272, Zone05: 381, Zone08: 1499, ZoneVS: 0 },
      { month: "Dec-24", Zone01FM: -29, Zone03A: 2321, Zone03B: 1700, Zone05: 2634, Zone08: 1338, ZoneVS: -18 },
      { month: "Jan-25", Zone01FM: -54, Zone03A: 2876, Zone03B: 1543, Zone05: 3013, Zone08: 70, ZoneVS: -11 },
      { month: "Feb-25", Zone01FM: -92, Zone03A: 2924, Zone03B: 1511, Zone05: 2998, Zone08: 119, ZoneVS: -18 },
      { month: "Mar-25", Zone01FM: 63, Zone03A: 2462, Zone03B: 1861, Zone05: 2678, Zone08: 249, ZoneVS: 21 },
      { month: "Apr-25", Zone01FM: 251, Zone03A: 2794, Zone03B: 1217, Zone05: 2257, Zone08: 2146, ZoneVS: 11 },
    ],
  },
  directConnection: [
    { month: "Jan-24", DC: 16725, Irrigation: 3800, DBuildingCommon: 78, MBCommon: 312 },
    { month: "Feb-24", DC: 14718, Irrigation: 2765, DBuildingCommon: 69, MBCommon: 330 },
    { month: "Mar-24", DC: 12920, Irrigation: 2157, DBuildingCommon: 343, MBCommon: 260 },
    { month: "Apr-24", DC: 15333, Irrigation: 2798, DBuildingCommon: 266, MBCommon: 240 },
    { month: "May-24", DC: 16304, Irrigation: 2211, DBuildingCommon: 162, MBCommon: 197 },
    { month: "Jun-24", DC: 18927, Irrigation: 4463, DBuildingCommon: 419, MBCommon: 259 },
    { month: "Jul-24", DC: 16319, Irrigation: 5225, DBuildingCommon: 123, MBCommon: 213 },
    { month: "Aug-24", DC: 16352, Irrigation: 2632, DBuildingCommon: 722, MBCommon: 146 },
    { month: "Sep-24", DC: 16074, Irrigation: 3024, DBuildingCommon: 0, MBCommon: 147 },
    { month: "Oct-24", DC: 22824, Irrigation: 2793, DBuildingCommon: 217, MBCommon: 169 },
    { month: "Nov-24", DC: 16868, Irrigation: 3326, DBuildingCommon: 183, MBCommon: 188 },
    { month: "Dec-24", DC: 16344, Irrigation: 2950, DBuildingCommon: 6, MBCommon: 325 },
    { month: "Jan-25", DC: 19998, Irrigation: 5208, DBuildingCommon: 17, MBCommon: 341 },
    { month: "Feb-25", DC: 21095, Irrigation: 5863, DBuildingCommon: 252, MBCommon: 202 },
    { month: "Mar-25", DC: 24275, Irrigation: 6326, DBuildingCommon: 36, MBCommon: 202 },
    { month: "Apr-25", DC: 30837, Irrigation: 1411, DBuildingCommon: 0, MBCommon: 78 },
  ],
  totalMBToPay: [
    { month: "Jan-24", value: 4190 },
    { month: "Feb-24", value: 3164 },
    { month: "Mar-24", value: 2760 },
    { month: "Apr-24", value: 3304 },
    { month: "May-24", value: 2570 },
    { month: "Jun-24", value: 5141 },
    { month: "Jul-24", value: 5561 },
    { month: "Aug-24", value: 3500 },
    { month: "Sep-24", value: 3171 },
    { month: "Oct-24", value: 3179 },
    { month: "Nov-24", value: 3697 },
    { month: "Dec-24", value: 3281 },
    { month: "Jan-25", value: 5566 },
    { month: "Feb-25", value: 6317 },
    { month: "Mar-25", value: 6564 },
    { month: "Apr-25", value: 1724 },
  ],
}

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
const calculateEfficiency = (waterData: any) => {
  return waterData.summary.map((month: any) => {
    const efficiency = month.L1 > 0 ? (((month.L1 - month.TotalLoss) / month.L1) * 100).toFixed(2) : "0"
    return {
      month: month.month,
      efficiency: Number.parseFloat(efficiency),
      L1: month.L1,
    }
  })
}

// Generate Flow Distribution data for the selected month
const generate3DFlowData = (month: string) => {
  const monthData = waterData.summary.find((m: any) => m.month === month)

  if (!monthData) return []

  return [
    { name: "Main Supply (L1)", value: monthData.L1 },
    { name: "Zone Distribution (L2)", value: monthData.L2 },
    { name: "End User Consumption (L3)", value: monthData.L3 },
    { name: "Total Loss", value: monthData.TotalLoss },
  ]
}

// Generate Zone Performance data for the selected month
const generateZonePerformanceData = (month: string) => {
  const zoneBulk = waterData.zones.bulkMeters.find((m: any) => m.month === month)
  const zoneIndiv = waterData.zones.individual.find((m: any) => m.month === month)
  const zoneLoss = waterData.zones.loss.find((m: any) => m.month === month)

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
const generateRadarData = (month: string) => {
  const zonePerformance = generateZonePerformanceData(month)

  return zonePerformance.map((zone) => ({
    subject: zone.name,
    efficiency: Number.parseFloat(zone.efficiency.toString()),
    loss: zone.bulk > 0 ? Number.parseFloat(((zone.loss / zone.bulk) * 100).toFixed(1)) : 0,
    fullMark: 100,
  }))
}

// Generate Direct Connection breakdown data for the selected month
const generateDCBreakdownData = (month: string) => {
  const dcData = waterData.directConnection.find((m: any) => m.month === month)

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
const generateLossDistributionData = (month: string) => {
  const zonePerformance = generateZonePerformanceData(month)

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
  const [selectedMonth, setSelectedMonth] = useState("Apr-25")
  const [selectedZone, setSelectedZone] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState(15) // Default to latest month (Apr-25)
  const [showAnimations, setShowAnimations] = useState(false)
  const isMobile = useMobile()

  // Update selectedMonth based on the last month in the selected time range
  useEffect(() => {
    const lastMonthIndex = timeRange
    if (lastMonthIndex >= 0 && lastMonthIndex < waterData.summary.length) {
      setSelectedMonth(waterData.summary[lastMonthIndex].month)
    }
  }, [timeRange])

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
  const timeRangeLabels = [
    "Jan-24",
    "Feb-24",
    "Mar-24",
    "Apr-24",
    "May-24",
    "Jun-24",
    "Jul-24",
    "Aug-24",
    "Sep-24",
    "Oct-24",
    "Nov-24",
    "Dec-24",
    "Jan-25",
    "Feb-25",
    "Mar-25",
    "Apr-25",
  ]

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
  const filteredData = timeRange === 15 ? [waterData.summary[timeRange]] : waterData.summary.slice(0, timeRange + 1)

  // 3D flow data
  const flowData = generate3DFlowData(selectedMonth)

  // Zone performance data
  const zonePerformanceData = generateZonePerformanceData(selectedMonth)

  // Direct Connection breakdown
  const dcBreakdownData = generateDCBreakdownData(selectedMonth)

  // Loss Distribution data
  const lossDistributionData = generateLossDistributionData(selectedMonth)

  // Radar chart data
  const radarData = generateRadarData(selectedMonth)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with solid background */}
      <div
        className="relative overflow-hidden"
        style={{
          background: `#4E4456`,
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
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Muscat Bay Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-3xl font-bold text-white">Muscat Bay Water Management</h1>
                <p className="text-purple-100 mt-1">Advanced Real-time Analytics Dashboard</p>
              </div>
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
            <TimeRangeSlider value={timeRange} onChange={setTimeRange} min={0} max={15} labels={timeRangeLabels} />
          </div>
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                title="Zone Distribution (L2)"
                value={latestData.L2}
                unit="m³"
                change={
                  previousMonthData.L2 > 0 ? ((latestData.L2 / previousMonthData.L2 - 1) * 100).toFixed(1) : "N/A"
                }
                changeLabel="vs previous month"
                gradient={generateGradient(ACCENT_COLOR, INFO_COLOR)}
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
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
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
                <div className="h-96" aria-label="Loss distribution by zone pie chart">
                  <ModernDonutChart
                    data={lossDistributionData}
                    colors={ZONE_COLORS}
                    title={`Loss Distribution by Zone - ${selectedMonth}`}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                  />
                </div>
              </Card>

              {/* Zone Loss Radial Bar Chart */}
              <Card className="p-5">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Loss to Supply Ratio</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={160}
                    barSize={20}
                    data={zonePerformanceData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <PolarGrid gridType="circle" />
                    <PolarAngleAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#4E4456", fontSize: 12 }}
                      tickLine={{ stroke: "#4E4456" }}
                    />
                    <PolarRadiusAxis angle={90} domain={[0, "auto"]} />
                    <RadialBar
                      minAngle={15}
                      background={{ fill: "#f8f9fa" }}
                      dataKey="loss"
                      cornerRadius={8}
                      label={{
                        position: "insideStart",
                        fill: "#fff",
                        fontSize: 12,
                        fontWeight: "bold",
                        formatter: (value) => `${value.toFixed(0)}m³`,
                      }}
                    >
                      {zonePerformanceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={ZONE_COLORS[index % ZONE_COLORS.length]}
                          stroke={ZONE_COLORS[index % ZONE_COLORS.length]}
                          strokeWidth={1}
                        />
                      ))}
                    </RadialBar>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                              <p className="font-medium text-gray-700">{data.name}</p>
                              <p className="text-sm">
                                Loss: <span className="font-medium">{data.loss.toLocaleString()} m³</span>
                              </p>
                              <p className="text-sm">
                                Supply: <span className="font-medium">{data.bulk.toLocaleString()} m³</span>
                              </p>
                              <p className="text-sm">
                                Loss Ratio:{" "}
                                <span className="font-medium">{((data.loss / data.bulk) * 100).toFixed(1)}%</span>
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend
                      iconSize={10}
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                      wrapperStyle={{ paddingLeft: "10px" }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
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
                    <BarChart
                      layout="vertical"
                      data={zoneOptions
                        .filter((zone) => zone.value !== "all")
                        .map((zone) => {
                          // Calculate average, min, max for each zone
                          const zoneData = waterData.zones.bulkMeters.map((item) => item[zone.value])
                          const avg = zoneData.reduce((sum, val) => sum + val, 0) / zoneData.length
                          const latest = waterData.zones.bulkMeters[waterData.zones.bulkMeters.length - 1][zone.value]
                          const max = Math.max(...zoneData)

                          // Calculate trend (last 3 months)
                          const last3Months = waterData.zones.bulkMeters.slice(-3).map((item) => item[zone.value])
                          const trend = last3Months[2] - last3Months[0]

                          return {
                            name: zone.label,
                            average: avg,
                            latest: latest,
                            maximum: max,
                            trend: trend > 0 ? "increasing" : trend < 0 ? "decreasing" : "stable",
                          }
                        })}
                      margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload
                            return (
                              <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                                <p className="font-medium text-gray-700">{data.name}</p>
                                <p className="text-sm">
                                  Latest: <span className="font-medium">{data.latest.toLocaleString()} m³</span>
                                </p>
                                <p className="text-sm">
                                  Average:{" "}
                                  <span className="font-medium">{Math.round(data.average).toLocaleString()} m³</span>
                                </p>
                                <p className="text-sm">
                                  Maximum: <span className="font-medium">{data.maximum.toLocaleString()} m³</span>
                                </p>
                                <p className="text-sm">
                                  Trend:{" "}
                                  <span
                                    className={`font-medium ${data.trend === "increasing" ? "text-red-500" : data.trend === "decreasing" ? "text-green-500" : "text-gray-500"}`}
                                  >
                                    {data.trend === "increasing"
                                      ? "↑ Increasing"
                                      : data.trend === "decreasing"
                                        ? "↓ Decreasing"
                                        : "→ Stable"}
                                  </span>
                                </p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend />
                      <Bar dataKey="latest" name="Latest Consumption" fill={ACCENT_COLOR} radius={[0, 4, 4, 0]}>
                        {zoneOptions
                          .filter((zone) => zone.value !== "all")
                          .map((zone, index) => {
                            const zoneData = waterData.zones.bulkMeters.map((item) => item[zone.value])
                            const latest = waterData.zones.bulkMeters[waterData.zones.bulkMeters.length - 1][zone.value]
                            const avg = zoneData.reduce((sum, val) => sum + val, 0) / zoneData.length

                            // Color based on comparison to average
                            let fillColor = SUCCESS_COLOR // below average
                            if (latest > avg * 1.2)
                              fillColor = DANGER_COLOR // 20% above average
                            else if (latest > avg) fillColor = WARNING_COLOR // above average

                            return <Cell key={`cell-${index}`} fill={fillColor} />
                          })}
                      </Bar>
                      <Bar
                        dataKey="average"
                        name="Average Consumption"
                        fill={BASE_COLOR}
                        fillOpacity={0.3}
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: SUCCESS_COLOR }}
                    ></span>
                    <span>Good (&gt;85%)</span>
                    <span
                      className="inline-block w-3 h-3 rounded-full ml-3"
                      style={{ backgroundColor: WARNING_COLOR }}
                    ></span>
                    <span>Average (70-85%)</span>
                    <span
                      className="inline-block w-3 h-3 rounded-full ml-3"
                      style={{ backgroundColor: DANGER_COLOR }}
                    ></span>
                    <span>Significantly above average</span>
                  </div>
                </div>
              </Card>

              <Card className="p-5">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Zone Efficiency Heatmap</h2>
                <div className="h-80" aria-label="Zone efficiency heatmap">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart
                      data={waterData.summary.map((month, idx) => {
                        // Calculate efficiency for each zone in this month
                        const zoneEfficiencies = {}
                        const bulk = waterData.zones.bulkMeters[idx]
                        const indiv = waterData.zones.individual[idx]

                        zoneOptions
                          .filter((zone) => zone.value !== "all")
                          .forEach((zone) => {
                            zoneEfficiencies[zone.value] =
                              bulk[zone.value] > 0
                                ? Number(((indiv[zone.value] / bulk[zone.value]) * 100).toFixed(1))
                                : 0
                          })

                        return {
                          month: month.month,
                          ...zoneEfficiencies,
                          systemEfficiency: month.L1 > 0 ? (month.L3 / month.L1) * 100 : 0,
                        }
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 10 }} />
                      <YAxis
                        label={{
                          value: "Efficiency %",
                          angle: -90,
                          position: "insideLeft",
                          style: { textAnchor: "middle" },
                        }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                                <p className="font-medium text-gray-700 mb-2">{label}</p>
                                {payload
                                  .filter((entry) => entry.dataKey !== "month")
                                  .sort((a, b) => b.value - a.value)
                                  .map((entry, index) => {
                                    let color = SUCCESS_COLOR
                                    if (entry.value < 70) color = DANGER_COLOR
                                    else if (entry.value < 85) color = WARNING_COLOR

                                    return (
                                      <p
                                        key={`item-${index}`}
                                        className="text-sm flex justify-between items-center gap-3"
                                      >
                                        <span>
                                          {entry.name === "systemEfficiency" ? "System Efficiency" : entry.name}:
                                        </span>
                                        <span className="font-medium" style={{ color }}>
                                          {entry.value.toFixed(1)}%
                                        </span>
                                      </p>
                                    )
                                  })}
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />

                      {/* System efficiency line */}
                      <Line
                        type="monotone"
                        dataKey="systemEfficiency"
                        name="System Efficiency"
                        stroke={BASE_COLOR}
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 2, fill: "#4E4456", stroke: "#4E4456" }}
                      />

                      {/* Zone efficiency bars */}
                      {zoneOptions
                        .filter((zone) => zone.value !== "all")
                        .map((zone, index) => (
                          <Bar
                            key={zone.value}
                            dataKey={zone.value}
                            name={zone.label}
                            fill={ZONE_COLORS[index % ZONE_COLORS.length]}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={20}
                            stackId="stack"
                          >
                            {waterData.summary.map((_, monthIndex) => {
                              const bulk = waterData.zones.bulkMeters[monthIndex]
                              const indiv = waterData.zones.individual[monthIndex]
                              const efficiency = bulk[zone.value] > 0 ? (indiv[zone.value] / bulk[zone.value]) * 100 : 0

                              let color = SUCCESS_COLOR
                              if (efficiency < 70) color = DANGER_COLOR
                              else if (efficiency < 85) color = WARNING_COLOR

                              return <Cell key={`cell-${monthIndex}`} fill={color} fillOpacity={0.7} />
                            })}
                          </Bar>
                        ))}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{ backgroundColor: SUCCESS_COLOR }}
                    ></span>
                    <span>Good (&gt;85%)</span>
                    <span
                      className="inline-block w-3 h-3 rounded-full ml-3"
                      style={{ backgroundColor: WARNING_COLOR }}
                    ></span>
                    <span>Average (70-85%)</span>
                    <span
                      className="inline-block w-3 h-3 rounded-full ml-3"
                      style={{ backgroundColor: DANGER_COLOR }}
                    ></span>
                    <span>Poor (&lt;70%)</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Add a new row with additional trend insights */}
            <Card className="p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Consumption vs. Efficiency Analysis</h2>
              <div className="h-96" aria-label="Consumption vs efficiency scatter plot">
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="consumption"
                      name="Consumption (m³)"
                      domain={["auto", "auto"]}
                      label={{ value: "Consumption (m³)", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="efficiency"
                      name="Efficiency (%)"
                      domain={[0, 100]}
                      label={{ value: "Efficiency (%)", angle: -90, position: "insideLeft" }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
                              <p className="font-medium text-gray-700">{data.name}</p>
                              <p className="text-sm">
                                Month: <span className="font-medium">{data.month}</span>
                              </p>
                              <p className="text-sm">
                                Consumption: <span className="font-medium">{data.consumption.toLocaleString()} m³</span>
                              </p>
                              <p className="text-sm">
                                Efficiency: <span className="font-medium">{data.efficiency.toFixed(1)}%</span>
                              </p>
                              <p className="text-sm">
                                Loss: <span className="font-medium">{data.loss.toLocaleString()} m³</span>
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Legend />

                    {zoneOptions
                      .filter((zone) => zone.value !== "all")
                      .map((zone, zoneIndex) => {
                        // Create data points for each month for this zone
                        const data = waterData.zones.bulkMeters.map((bulk, monthIndex) => {
                          const indiv = waterData.zones.individual[monthIndex]
                          const loss = waterData.zones.loss[monthIndex]
                          const month = waterData.summary[monthIndex].month

                          return {
                            name: zone.label,
                            month: month,
                            consumption: bulk[zone.value],
                            efficiency: bulk[zone.value] > 0 ? (indiv[zone.value] / bulk[zone.value]) * 100 : 0,
                            loss: loss[zone.value],
                          }
                        })

                        return (
                          <Scatter
                            key={zone.value}
                            name={zone.label}
                            data={data}
                            fill={ZONE_COLORS[zoneIndex % ZONE_COLORS.length]}
                            shape="circle"
                          />
                        )
                      })}

                    {/* Add reference lines */}
                    <ReferenceLine
                      y={85}
                      stroke={SUCCESS_COLOR}
                      strokeDasharray="3 3"
                      label={{ value: "Good (85%)", position: "right", fill: SUCCESS_COLOR }}
                    />
                    <ReferenceLine
                      y={70}
                      stroke={WARNING_COLOR}
                      strokeDasharray="3 3"
                      label={{ value: "Average (70%)", position: "right", fill: WARNING_COLOR }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">High Consumption, High Efficiency</h3>
                  <p className="text-gray-600">
                    Zones in this quadrant have optimal performance with high water utilization and minimal losses.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">High Consumption, Low Efficiency</h3>
                  <p className="text-gray-600">
                    Priority areas for improvement - these zones consume large volumes but have significant losses.
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">Low Consumption, Low Efficiency</h3>
                  <p className="text-gray-600">
                    These zones may have infrastructure issues like leaks or metering problems that need investigation.
                  </p>
                </div>
              </div>
            </Card>
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
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Key Performance Indicators (KPIs)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* KPI Card: Water Loss Percentage */}
                <Card className="p-4">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Water Loss Percentage</h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {latestData.L1 > 0 ? ((latestData.TotalLoss / latestData.L1) * 100).toFixed(1) : "0"}%
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {latestData.TotalLoss.toLocaleString()} m³ lost out of {latestData.L1.toLocaleString()} m³ supplied.
                  </p>
                  <div className="mt-3">
                    <AnimatedProgressBar
                      value={latestData.TotalLoss}
                      max={latestData.L1}
                      color={DANGER_COLOR}
                      label="Loss Percentage"
                      additionalInfo="Compared to total water supply"
                    />
                  </div>
                </Card>

                {/* KPI Card: System Efficiency */}
                <Card className="p-4">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">System Efficiency</h3>
                  <p className="text-3xl font-bold text-gray-800">{efficiency}%</p>
                  <p className="text-sm text-gray-500 mt-1">Percentage of water supplied that reaches end-users.</p>
                  <div className="mt-3">
                    <AnimatedProgressBar
                      value={Number.parseFloat(efficiency)}
                      max={100}
                      color={SUCCESS_COLOR}
                      label="Efficiency"
                      additionalInfo="Compared to total water supply"
                    />
                  </div>
                </Card>

                {/* KPI Card: Direct Connection Usage */}
                <Card className="p-4">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Direct Connection Usage</h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {waterData.directConnection.find((m) => m.month === selectedMonth)?.DC?.toLocaleString() || "0"} m³
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Total water supplied through direct connections.</p>
                  <div className="mt-3">
                    <AnimatedProgressBar
                      value={waterData.directConnection.find((m) => m.month === selectedMonth)?.DC || 0}
                      max={latestData.L1}
                      color={INFO_COLOR}
                      label="Direct Connection"
                      additionalInfo="Compared to total water supply"
                    />
                  </div>
                </Card>
              </div>
            </Card>

            {/* Insights Section */}
            <Card className="p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Actionable Insights & Recommendations</h2>
              <div className="space-y-4">
                {/* Insight: High Water Loss */}
                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <h3 className="font-medium text-gray-700 mb-2">High Water Loss Detected</h3>
                  <p className="text-sm text-gray-600">
                    The system is experiencing a significant water loss of {latestData.TotalLoss.toLocaleString()} m³ in{" "}
                    {selectedMonth}.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                    <li>
                      <strong>Recommendation:</strong> Conduct a thorough leak detection survey, focusing on zones with
                      the highest loss ratios.
                    </li>
                    <li>
                      <strong>Recommendation:</strong> Review and optimize pressure management strategies to reduce pipe
                      bursts and leaks.
                    </li>
                  </ul>
                </div>

                {/* Insight: Low System Efficiency */}
                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <h3 className="font-medium text-gray-700 mb-2">Low System Efficiency</h3>
                  <p className="text-sm text-gray-600">
                    The system efficiency is at {efficiency}% for {selectedMonth}, indicating potential inefficiencies
                    in water distribution.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                    <li>
                      <strong>Recommendation:</strong> Implement a water audit to identify areas of unauthorized
                      consumption or metering inaccuracies.
                    </li>
                    <li>
                      <strong>Recommendation:</strong> Evaluate and upgrade aging infrastructure to minimize water loss
                      due to pipe corrosion and leaks.
                    </li>
                  </ul>
                </div>

                {/* Insight: Imbalance in Direct Connection Usage */}
                <div className="bg-gray-50 p-4 rounded-md shadow-sm">
                  <h3 className="font-medium text-gray-700 mb-2">Direct Connection Usage Imbalance</h3>
                  <p className="text-sm text-gray-600">
                    There is a notable imbalance in direct connection usage, with Irrigation accounting for a
                    significant portion.
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                    <li>
                      <strong>Recommendation:</strong> Review irrigation schedules and promote water-efficient
                      irrigation practices.
                    </li>
                    <li>
                      <strong>Recommendation:</strong> Explore opportunities to diversify direct connection usage and
                      reduce reliance on irrigation.
                    </li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Report Generation Section */}
            <Card className="p-5">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Generate Custom Reports</h2>
              <p className="text-sm text-gray-600">Create detailed reports tailored to your specific needs.</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
                    Report Type
                  </label>
                  <select
                    id="reportType"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option>Water Loss Analysis</option>
                    <option>System Efficiency Overview</option>
                    <option>Direct Connection Usage</option>
                    <option>Zone Performance Comparison</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="reportPeriod" className="block text-sm font-medium text-gray-700">
                    Report Period
                  </label>
                  <select
                    id="reportPeriod"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option>Last Month</option>
                    <option>Last Quarter</option>
                    <option>Last Year</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>
              <button className="mt-4 bg-[#4E4456] hover:bg-[#8A7A94] text-white font-bold py-2 px-4 rounded">
                Generate Report
              </button>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRealSTPData } from "../hooks/use-real-stp-data"
import { AreaChart, BarChart, PieChart, LineChart, DonutChart } from "@/components/ui/charts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  DropletIcon, 
  BarChart3Icon, 
  ActivityIcon, 
  GaugeIcon, 
  BeakerIcon,
  ArrowUp,
  ArrowDown,
  MinusIcon,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileText,
  Microscope,
  FlaskConical,
  FileBarChart,
  BarChart4,
  TreeDeciduous,
  Droplets,
  ThermometerIcon
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import WaterQualityCard from "./water-quality-card"
import { EnhancedFlowSankey } from "./charts/enhanced-flow-sankey"
import { EnhancedEfficiencyGauge } from "./charts/enhanced-efficiency-gauge"
import { DailyEfficiencyChart } from "./charts/daily-efficiency-chart"
import { MonthlyEfficiencyChart } from "./charts/monthly-efficiency-chart"
import { EnhancedDataTable } from "./enhanced-data-table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

// Types for dashboard components
interface KPICardProps {
  title: string
  value: number
  unit: string
  change: number
  icon: "flow" | "efficiency" | "utilization" | "quality" | "energy" | "chemical" | "biosolids" | "temperature"
  colorClass?: string
}

interface ComplianceCardProps {
  title: string
  value: number
  parameter: string
  status: "compliant" | "warning" | "violation"
  regulation: string
  limit: string
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

  // Total Nitrogen and Total Phosphorus
  const tnValue = Math.round(20 - (qualityFactor * 15) + (Math.random() * 8 - 4))
  const tpValue = Math.round(5 - (qualityFactor * 4) + (Math.random() * 2 - 1))

  // Fecal Coliform (CFU/100ml)
  const fecalValue = Math.round(1000 - (qualityFactor * 950) + (Math.random() * 100 - 50))
  
  return {
    phValue: Number(phValue.toFixed(1)),
    codValue: Math.max(5, codValue), 
    bodValue: Math.max(2, bodValue),
    tssValue: Math.max(3, tssValue),
    tnValue: Math.max(1, tnValue),
    tpValue: Number(Math.max(0.1, tpValue).toFixed(1)),
    fecalValue: Math.max(10, fecalValue),
    turbidity: Number((5 - (qualityFactor * 4) + (Math.random() * 1.5 - 0.75)).toFixed(1)),
    dissolvedOxygen: Number((4 + (qualityFactor * 3) + (Math.random() * 1 - 0.5)).toFixed(1))
  }
}

// Generate additional operational data for STP
const generateOperationalData = (flowRate: number, efficiency: number) => {
  const capacityFactor = flowRate / 750 // relative to design capacity
  const efficiencyFactor = efficiency / 100

  return {
    energyConsumption: Math.round(2500 + (capacityFactor * 1500) - (efficiencyFactor * 500)),
    chemicalUsage: Math.round(120 + (capacityFactor * 80) - (efficiencyFactor * 30)),
    biosolidsProduction: Number((2.5 + (capacityFactor * 2) - (efficiencyFactor * 0.5)).toFixed(1)),
    operatingCost: Math.round(350 + (capacityFactor * 250) - (efficiencyFactor * 100)),
    aerationRate: Number((75 + (capacityFactor * 25) - (efficiencyFactor * 10)).toFixed(1)),
    sludgeProcessed: Math.round(flowRate * 0.02),
    retentionTime: Number((12 + (efficiencyFactor * 8) - (capacityFactor * 4)).toFixed(1)),
    temperature: Number((25 + (Math.random() * 3 - 1.5)).toFixed(1))
  }
}

// Generate compliance data based on water quality
const generateComplianceData = (waterQuality: any) => {
  const { bodValue, codValue, tssValue, phValue, tnValue, tpValue, fecalValue } = waterQuality
  
  return [
    {
      parameter: "BOD5",
      value: bodValue,
      unit: "mg/L",
      limit: "≤ 20 mg/L",
      status: bodValue <= 20 ? "compliant" : bodValue <= 25 ? "warning" : "violation",
      regulation: "Oman Standard 115/2001"
    },
    {
      parameter: "COD",
      value: codValue,
      unit: "mg/L",
      limit: "≤ 100 mg/L",
      status: codValue <= 100 ? "compliant" : codValue <= 120 ? "warning" : "violation",
      regulation: "Oman Standard 115/2001"
    },
    {
      parameter: "TSS",
      value: tssValue,
      unit: "mg/L",
      limit: "≤ 30 mg/L",
      status: tssValue <= 30 ? "compliant" : tssValue <= 40 ? "warning" : "violation",
      regulation: "Oman Standard 115/2001"
    },
    {
      parameter: "pH",
      value: phValue,
      unit: "",
      limit: "6.0 - 9.0",
      status: (phValue >= 6.0 && phValue <= 9.0) ? "compliant" : 
              (phValue >= 5.5 && phValue <= 9.5) ? "warning" : "violation",
      regulation: "Oman Standard 115/2001"
    },
    {
      parameter: "Total Nitrogen",
      value: tnValue,
      unit: "mg/L",
      limit: "≤ 15 mg/L",
      status: tnValue <= 15 ? "compliant" : tnValue <= 20 ? "warning" : "violation",
      regulation: "Oman Standard 115/2001"
    },
    {
      parameter: "Total Phosphorus",
      value: tpValue,
      unit: "mg/L",
      limit: "≤ 2 mg/L",
      status: tpValue <= 2 ? "compliant" : tpValue <= 3 ? "warning" : "violation",
      regulation: "Oman Standard 115/2001"
    },
    {
      parameter: "Fecal Coliform",
      value: fecalValue,
      unit: "CFU/100ml",
      limit: "≤ 1000 CFU/100ml",
      status: fecalValue <= 1000 ? "compliant" : fecalValue <= 1500 ? "warning" : "violation",
      regulation: "Oman Standard 115/2001"
    }
  ]
}

export default function EnhancedSTPDashboard() {
  const [selectedMonth, setSelectedMonth] = useState("2025-04")
  const [waterQualityParams, setWaterQualityParams] = useState({
    phValue: 7.2,
    codValue: 60,
    bodValue: 15,
    tssValue: 20,
    tnValue: 10,
    tpValue: 1.2,
    fecalValue: 800,
    turbidity: 2.5,
    dissolvedOxygen: 6.2
  })
  const [operationalData, setOperationalData] = useState({
    energyConsumption: 3200,
    chemicalUsage: 150,
    biosolidsProduction: 3.5,
    operatingCost: 450,
    aerationRate: 85,
    sludgeProcessed: 12,
    retentionTime: 14.5,
    temperature: 25.8
  })
  const [complianceData, setComplianceData] = useState<any[]>([])
  
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
      const newWaterQualityParams = generateWaterQualityParams(kpiData.efficiency)
      setWaterQualityParams(newWaterQualityParams)
      
      // Calculate average daily flow
      const avgDailyFlow = kpiData.totalInflow / dailyData.length

      // Generate operational data
      setOperationalData(generateOperationalData(avgDailyFlow, kpiData.efficiency))
      
      // Generate compliance data
      setComplianceData(generateComplianceData(newWaterQualityParams))
    }
  }, [kpiData.efficiency, kpiData.totalInflow, dailyData.length, isLoading])

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
  }

  // Get month name from the selectedMonth value (YYYY-MM)
  const getMonthName = () => {
    const month = availableMonths.find(m => m.value === selectedMonth)
    return month ? month.label : 'Unknown'
  }

  // Calculate overall compliance percentage
  const calculateCompliancePercentage = () => {
    if (complianceData.length === 0) return 0
    const compliantCount = complianceData.filter(item => item.status === "compliant").length
    return Math.round((compliantCount / complianceData.length) * 100)
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
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">STP Plant Dashboard</h1>
            <Badge variant="outline" className="ml-2 py-1">750 m³/d Capacity</Badge>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Advanced monitoring and analytics for Sewage Treatment operations
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
          title="TREATMENT EFFICIENCY"
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

      {/* STP-specific KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="ENERGY CONSUMPTION"
          value={operationalData.energyConsumption}
          unit="kWh"
          change={-2.4} // Placeholder
          icon="energy"
          colorClass="bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
        />
        <KPICard
          title="CHEMICAL USAGE"
          value={operationalData.chemicalUsage}
          unit="kg"
          change={1.5} // Placeholder
          icon="chemical"
          colorClass="bg-pink-50 text-pink-700 dark:bg-pink-900 dark:text-pink-300"
        />
        <KPICard
          title="BIOSOLIDS PRODUCTION"
          value={operationalData.biosolidsProduction}
          unit="tons"
          change={-0.8} // Placeholder
          icon="biosolids"
          colorClass="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300"
        />
        <KPICard
          title="AERATION TEMPERATURE"
          value={operationalData.temperature}
          unit="°C"
          change={0.5} // Placeholder
          icon="temperature"
          colorClass="bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-8 w-full justify-start overflow-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quality">Water Quality</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Efficiency Gauge */}
            <EnhancedEfficiencyGauge efficiency={kpiData.efficiency} />

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
                    { name: "Tanker Discharge", value: sankeyData.links[1]?.value || 0, color: "#3b82f6" },
                    { name: "Direct Sewage", value: sankeyData.links[2]?.value || 0, color: "#0ea5e9" }
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
                    {Math.round(sankeyData.links[3]?.value || 0)} m³
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {Math.round(((sankeyData.links[3]?.value || 0) / (sankeyData.links[0]?.value || 1)) * 100)}% of inflow
                  </p>
                </div>
                <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg text-center">
                  <h3 className="font-medium mb-2">Secondary Treatment</h3>
                  <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                    {Math.round(sankeyData.links[5]?.value || 0)} m³
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {Math.round(((sankeyData.links[5]?.value || 0) / (sankeyData.links[0]?.value || 1)) * 100)}% of inflow
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg text-center">
                  <h3 className="font-medium mb-2">TSE Output</h3>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(sankeyData.links[7]?.value || 0)} m³
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {Math.round(((sankeyData.links[7]?.value || 0) / (sankeyData.links[0]?.value || 1)) * 100)}% of inflow
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Water Quality Tab */}
        <TabsContent value="quality" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Treatment Output Quality Parameters</CardTitle>
                <CardDescription>TSE Water Quality - {getMonthName()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Biochemical Oxygen Demand (BOD₅)</span>
                          <span className="text-sm font-medium">{waterQualityParams.bodValue} mg/L</span>
                        </div>
                        <Progress value={(1 - waterQualityParams.bodValue/40) * 100} className="h-2" />
                        <span className="text-xs text-gray-500">Standard: ≤20 mg/L</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Chemical Oxygen Demand (COD)</span>
                          <span className="text-sm font-medium">{waterQualityParams.codValue} mg/L</span>
                        </div>
                        <Progress value={(1 - waterQualityParams.codValue/200) * 100} className="h-2" />
                        <span className="text-xs text-gray-500">Standard: ≤100 mg/L</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Total Suspended Solids (TSS)</span>
                          <span className="text-sm font-medium">{waterQualityParams.tssValue} mg/L</span>
                        </div>
                        <Progress value={(1 - waterQualityParams.tssValue/60) * 100} className="h-2" />
                        <span className="text-xs text-gray-500">Standard: ≤30 mg/L</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">pH</span>
                          <span className="text-sm font-medium">{waterQualityParams.phValue}</span>
                        </div>
                        <Progress 
                          value={waterQualityParams.phValue < 7 ? 
                            ((waterQualityParams.phValue - 4) / 3) * 100 : 
                            (1 - ((waterQualityParams.phValue - 7) / 3)) * 100} 
                          className="h-2" 
                        />
                        <span className="text-xs text-gray-500">Standard: 6.0-9.0</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Total Nitrogen (TN)</span>
                          <span className="text-sm font-medium">{waterQualityParams.tnValue} mg/L</span>
                        </div>
                        <Progress value={(1 - waterQualityParams.tnValue/30) * 100} className="h-2" />
                        <span className="text-xs text-gray-500">Standard: ≤15 mg/L</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Total Phosphorus (TP)</span>
                          <span className="text-sm font-medium">{waterQualityParams.tpValue} mg/L</span>
                        </div>
                        <Progress value={(1 - waterQualityParams.tpValue/4) * 100} className="h-2" />
                        <span className="text-xs text-gray-500">Standard: ≤2 mg/L</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Turbidity</span>
                          <span className="text-sm font-medium">{waterQualityParams.turbidity} NTU</span>
                        </div>
                        <Progress value={(1 - waterQualityParams.turbidity/10) * 100} className="h-2" />
                        <span className="text-xs text-gray-500">Standard: ≤5 NTU</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Dissolved Oxygen</span>
                          <span className="text-sm font-medium">{waterQualityParams.dissolvedOxygen} mg/L</span>
                        </div>
                        <Progress value={(waterQualityParams.dissolvedOxygen/10) * 100} className="h-2" />
                        <span className="text-xs text-gray-500">Standard: ≥4 mg/L</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Water Quality Standards Compliance</CardTitle>
                <CardDescription>Regulatory Compliance Status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Overall Compliance Score</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700 mr-2">
                        <div 
                          className={`h-6 rounded-full ${
                            calculateCompliancePercentage() > 90 ? "bg-emerald-500" : 
                            calculateCompliancePercentage() > 70 ? "bg-amber-500" : "bg-red-500"
                          }`}
                          style={{ width: `${calculateCompliancePercentage()}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-bold">{calculateCompliancePercentage()}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Reuse Standards</h4>
                      <p className={`text-xl font-bold ${calculateCompliancePercentage() > 80 ? "text-emerald-600" : "text-amber-600"}`}>
                        {calculateCompliancePercentage() > 80 ? "Compliant" : "Conditional"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {calculateCompliancePercentage() > 80 ? "Meets irrigation requirements" : "Some parameters need monitoring"}
                      </p>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Regulatory Status</h4>
                      <p className={`text-xl font-bold ${
                        calculateCompliancePercentage() > 90 ? "text-emerald-600" : 
                        calculateCompliancePercentage() > 70 ? "text-amber-600" : "text-red-600"
                      }`}>
                        {calculateCompliancePercentage() > 90 ? "Approved" : 
                         calculateCompliancePercentage() > 70 ? "Conditional" : "Non-compliant"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {calculateCompliancePercentage() > 90 ? "Meets all regulations" : 
                         calculateCompliancePercentage() > 70 ? "Remediation plan required" : "Immediate action needed"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <h3 className="font-medium">Monitoring Parameters Status</h3>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Parameter</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Limit</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {complianceData.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.parameter}</TableCell>
                            <TableCell>{item.value} {item.unit}</TableCell>
                            <TableCell>{item.limit}</TableCell>
                            <TableCell>
                              <Badge variant={
                                item.status === "compliant" ? "success" : 
                                item.status === "warning" ? "warning" : "destructive"
                              }>
                                {item.status === "compliant" ? "Compliant" : 
                                 item.status === "warning" ? "Warning" : "Violation"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Water Reuse Applications</CardTitle>
              <CardDescription>TSE Water Reuse Potential Based on Quality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Landscape Irrigation</h3>
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      waterQualityParams.bodValue <= 20 && waterQualityParams.tssValue <= 30 ? 
                      "bg-emerald-500" : "bg-amber-500"
                    } mr-2`}></div>
                    <span>{waterQualityParams.bodValue <= 20 && waterQualityParams.tssValue <= 30 ? "Suitable" : "Conditional"}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    TSE water is suitable for irrigating gardens, parks, and golf courses
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Industrial Uses</h3>
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      waterQualityParams.bodValue <= 30 && waterQualityParams.tssValue <= 40 ? 
                      "bg-emerald-500" : "bg-amber-500"
                    } mr-2`}></div>
                    <span>{waterQualityParams.bodValue <= 30 && waterQualityParams.tssValue <= 40 ? "Suitable" : "Conditional"}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Can be used for cooling systems and process water in industrial applications
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Groundwater Recharge</h3>
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${
                      waterQualityParams.bodValue <= 10 && waterQualityParams.fecalValue <= 200 ? 
                      "bg-emerald-500" : "bg-amber-500"
                    } mr-2`}></div>
                    <span>{waterQualityParams.bodValue <= 10 && waterQualityParams.fecalValue <= 200 ? "Suitable" : "Conditional"}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {waterQualityParams.bodValue <= 10 && waterQualityParams.fecalValue <= 200 ? 
                     "Meets requirements for groundwater recharge" : 
                     "Additional treatment required for groundwater recharge"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Operational Parameters</CardTitle>
                <CardDescription>Key Process Parameters - {getMonthName()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium flex items-center">
                            <GaugeIcon className="h-4 w-4 mr-1 text-blue-500" />
                            Aeration Rate
                          </span>
                          <span className="text-sm font-medium">{operationalData.aerationRate} m³/hr</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${(operationalData.aerationRate / 100) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium flex items-center">
                            <BeakerIcon className="h-4 w-4 mr-1 text-purple-500" />
                            Sludge Volume Index
                          </span>
                          <span className="text-sm font-medium">{Math.round(110 + Math.random() * 40)} mL/g</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div 
                            className="h-2 bg-purple-500 rounded-full" 
                            style={{ width: `${((110 + Math.random() * 40) / 200) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium flex items-center">
                            <DropletIcon className="h-4 w-4 mr-1 text-teal-500" />
                            MLSS Concentration
                          </span>
                          <span className="text-sm font-medium">{Math.round(2500 + Math.random() * 1000)} mg/L</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div 
                            className="h-2 bg-teal-500 rounded-full" 
                            style={{ width: `${((2500 + Math.random() * 1000) / 4000) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium flex items-center">
                            <ThermometerIcon className="h-4 w-4 mr-1 text-red-500" />
                            Process Temperature
                          </span>
                          <span className="text-sm font-medium">{operationalData.temperature} °C</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div 
                            className="h-2 bg-red-500 rounded-full" 
                            style={{ width: `${((operationalData.temperature - 20) / 15) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium flex items-center">
                            <DropletIcon className="h-4 w-4 mr-1 text-blue-500" />
                            Hydraulic Retention Time
                          </span>
                          <span className="text-sm font-medium">{operationalData.retentionTime} hours</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{ width: `${(operationalData.retentionTime / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium flex items-center">
                            <ActivityIcon className="h-4 w-4 mr-1 text-green-500" />
                            F/M Ratio
                          </span>
                          <span className="text-sm font-medium">{(0.1 + Math.random() * 0.2).toFixed(2)} kg BOD/kg MLSS</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div 
                            className="h-2 bg-green-500 rounded-full" 
                            style={{ width: `${((0.1 + Math.random() * 0.2) / 0.5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium flex items-center">
                            <FlaskConical className="h-4 w-4 mr-1 text-amber-500" />
                            Chemical Dosing Rate
                          </span>
                          <span className="text-sm font-medium">{Math.round(15 + Math.random() * 10)} mg/L</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div 
                            className="h-2 bg-amber-500 rounded-full" 
                            style={{ width: `${((15 + Math.random() * 10) / 30) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium flex items-center">
                            <Droplets className="h-4 w-4 mr-1 text-cyan-500" />
                            Sludge Age (SRT)
                          </span>
                          <span className="text-sm font-medium">{Math.round(8 + Math.random() * 7)} days</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full mt-1">
                          <div 
                            className="h-2 bg-cyan-500 rounded-full" 
                            style={{ width: `${((8 + Math.random() * 7) / 20) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Resource Consumption</CardTitle>
                <CardDescription>Energy and Chemical Usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Energy Consumption</h3>
                      <div className="text-2xl font-bold text-purple-600">{operationalData.energyConsumption} kWh</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <ArrowDown className="h-3 w-3 text-emerald-500 mr-1" />
                        <span>2.4% from previous month</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {(operationalData.energyConsumption / (kpiData.totalInflow / 30)).toFixed(1)} kWh/m³ treated
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Chemical Usage</h3>
                      <div className="text-2xl font-bold text-pink-600">{operationalData.chemicalUsage} kg</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <ArrowUp className="h-3 w-3 text-red-500 mr-1" />
                        <span>1.5% from previous month</span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {((operationalData.chemicalUsage * 1000) / kpiData.totalInflow).toFixed(1)} g/m³ treated
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-3">Energy Usage Breakdown</h3>
                    <DonutChart 
                      data={[
                        { name: "Aeration", value: 45 },
                        { name: "Pumping", value: 25 },
                        { name: "Mixing", value: 15 },
                        { name: "Sludge Treatment", value: 10 },
                        { name: "Other", value: 5 }
                      ]}
                      category="value"
                      index="name"
                      colors={["#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", "#ede9fe"]}
                      valueFormatter={(value) => `${value}%`}
                      className="h-60"
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">Chemical Usage Breakdown</h3>
                    <DonutChart 
                      data={[
                        { name: "Coagulants", value: 35 },
                        { name: "Polymers", value: 25 },
                        { name: "Disinfectants", value: 20 },
                        { name: "pH Adjustment", value: 15 },
                        { name: "Other", value: 5 }
                      ]}
                      category="value"
                      index="name"
                      colors={["#ec4899", "#f472b6", "#f9a8d4", "#fbcfe8", "#fce7f3"]}
                      valueFormatter={(value) => `${value}%`}
                      className="h-60"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Process Efficiency</CardTitle>
                <CardDescription>Treatment Stage Performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Primary Treatment Efficiency</span>
                        <span className="text-sm font-medium">{Math.round(35 + Math.random() * 10)}%</span>
                      </div>
                      <Progress value={35 + Math.random() * 10} className="h-2" />
                      <span className="text-xs text-gray-500">BOD & TSS Removal</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Secondary Treatment Efficiency</span>
                        <span className="text-sm font-medium">{Math.round(80 + Math.random() * 15)}%</span>
                      </div>
                      <Progress value={80 + Math.random() * 15} className="h-2" />
                      <span className="text-xs text-gray-500">Biological Treatment</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Tertiary Treatment Efficiency</span>
                        <span className="text-sm font-medium">{Math.round(70 + Math.random() * 20)}%</span>
                      </div>
                      <Progress value={70 + Math.random() * 20} className="h-2" />
                      <span className="text-xs text-gray-500">Nutrient & Pathogen Removal</span>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Overall Process Efficiency</span>
                        <span className="text-sm font-medium">{kpiData.efficiency}%</span>
                      </div>
                      <Progress value={kpiData.efficiency} className="h-2" />
                      <span className="text-xs text-gray-500">Total Treatment Performance</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-3">Performance by Contaminant Type</h3>
                    <BarChart 
                      data={[
                        { parameter: "BOD", removal: 91 + Math.random() * 5 },
                        { parameter: "COD", removal: 85 + Math.random() * 7 },
                        { parameter: "TSS", removal: 94 + Math.random() * 3 },
                        { parameter: "Nitrogen", removal: 75 + Math.random() * 10 },
                        { parameter: "Phosphorus", removal: 80 + Math.random() * 8 },
                        { parameter: "Pathogens", removal: 99 + Math.random() * 0.9 }
                      ]}
                      categories={["removal"]}
                      index="parameter"
                      colors={["#10b981"]}
                      valueFormatter={(value) => `${value.toFixed(1)}%`}
                      startAxisAtZero={true}
                      className="h-60"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Biosolids Management</CardTitle>
                <CardDescription>Sludge Processing and Disposal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Sludge Production</h3>
                      <div className="text-2xl font-bold text-green-600">{operationalData.biosolidsProduction} tons</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <ArrowDown className="h-3 w-3 text-emerald-500 mr-1" />
                        <span>0.8% from previous month</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Sludge Processed</h3>
                      <div className="text-2xl font-bold text-green-600">{operationalData.sludgeProcessed} m³</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {(operationalData.sludgeProcessed / kpiData.totalInflow * 100).toFixed(1)}% of total inflow
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-3">Biosolids Disposal Distribution</h3>
                    <DonutChart 
                      data={[
                        { name: "Land Application", value: 55 },
                        { name: "Composting", value: 25 },
                        { name: "Landfill", value: 15 },
                        { name: "Other", value: 5 }
                      ]}
                      category="value"
                      index="name"
                      colors={["#059669", "#34d399", "#6ee7b7", "#a7f3d0"]}
                      valueFormatter={(value) => `${value}%`}
                      className="h-60"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between items-center p-2 border rounded-md">
                      <span className="flex items-center">
                        <TreeDeciduous className="h-4 w-4 mr-2 text-green-500" />
                        <span className="font-medium">Biosolids Quality</span>
                      </span>
                      <Badge variant="outline" className="bg-green-50">Class B</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 border rounded-md">
                      <span className="flex items-center">
                        <GaugeIcon className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-medium">Sludge Density</span>
                      </span>
                      <span>{(1.02 + Math.random() * 0.03).toFixed(2)} kg/L</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-2 border rounded-md">
                      <span className="flex items-center">
                        <DropletIcon className="h-4 w-4 mr-2 text-cyan-500" />
                        <span className="font-medium">Moisture Content</span>
                      </span>
                      <span>{Math.round(75 + Math.random() * 10)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Compliance Dashboard</CardTitle>
                <CardDescription>Regulatory Requirements Status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="mb-4 text-center">
                      <div className="inline-flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                        {calculateCompliancePercentage() > 90 ? (
                          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                        ) : calculateCompliancePercentage() > 70 ? (
                          <AlertCircle className="h-12 w-12 text-amber-500" />
                        ) : (
                          <AlertCircle className="h-12 w-12 text-red-500" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mt-2">
                        {calculateCompliancePercentage()}% Compliant
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {getMonthName()} Compliance Rate
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Regulatory Compliance</span>
                        <Badge variant={calculateCompliancePercentage() > 90 ? "success" : "warning"}>
                          {calculateCompliancePercentage() > 90 ? "Compliant" : "Action Required"}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Permit Status</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Last Inspection</span>
                        <span className="text-sm">{new Date().toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Next Report Due</span>
                        <span className="text-sm">{new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-3">Parameter Compliance</h3>
                    <div className="space-y-3">
                      {complianceData.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${
                            item.status === "compliant" ? "bg-emerald-500" : 
                            item.status === "warning" ? "bg-amber-500" : "bg-red-500"
                          } mr-2`}></div>
                          <span className="text-sm flex-1">{item.parameter}</span>
                          <span className="text-sm font-medium">{item.value} {item.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Compliance Trend Analysis</CardTitle>
                <CardDescription>6-Month Historical Compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Overall Compliance Trend</h3>
                    <LineChart 
                      data={[
                        { month: "Nov", compliance: 88 + Math.random() * 5 },
                        { month: "Dec", compliance: 91 + Math.random() * 5 },
                        { month: "Jan", compliance: 89 + Math.random() * 6 },
                        { month: "Feb", compliance: 93 + Math.random() * 4 },
                        { month: "Mar", compliance: 92 + Math.random() * 5 },
                        { month: "Apr", compliance: calculateCompliancePercentage() }
                      ]}
                      categories={["compliance"]}
                      index="month"
                      colors={["#10b981"]}
                      valueFormatter={(value) => `${value.toFixed(1)}%`}
                      startAxisAtZero={false}
                      className="h-60"
                    />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-3">Water Quality Violations</h3>
                    <BarChart 
                      data={[
                        { month: "Nov", violations: Math.round(Math.random() * 2) },
                        { month: "Dec", violations: Math.round(Math.random() * 1) },
                        { month: "Jan", violations: Math.round(Math.random() * 2) },
                        { month: "Feb", violations: Math.round(Math.random() * 1) },
                        { month: "Mar", violations: Math.round(Math.random() * 1) },
                        { month: "Apr", violations: complianceData.filter(item => item.status === "violation").length }
                      ]}
                      categories={["violations"]}
                      index="month"
                      colors={["#ef4444"]}
                      valueFormatter={(value) => `${value}`}
                      startAxisAtZero={true}
                      className="h-60"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Detailed Compliance Records</CardTitle>
                <CardDescription>Parameter-by-Parameter Analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parameter</TableHead>
                        <TableHead>Current Value</TableHead>
                        <TableHead>Regulatory Limit</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Action Required</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {complianceData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.parameter}</TableCell>
                          <TableCell>{item.value} {item.unit}</TableCell>
                          <TableCell>{item.limit}</TableCell>
                          <TableCell>
                            <Badge variant={
                              item.status === "compliant" ? "success" : 
                              item.status === "warning" ? "warning" : "destructive"
                            }>
                              {item.status === "compliant" ? "Compliant" : 
                              item.status === "warning" ? "Warning" : "Violation"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="w-16 h-6">
                              <LineChart 
                                data={[
                                  { day: "1", value: Math.random() * 10 + (item.status === "compliant" ? 85 : 60) },
                                  { day: "2", value: Math.random() * 10 + (item.status === "compliant" ? 87 : 65) },
                                  { day: "3", value: Math.random() * 10 + (item.status === "compliant" ? 90 : 70) },
                                  { day: "4", value: Math.random() * 10 + (item.status === "compliant" ? 88 : 75) },
                                  { day: "5", value: Math.random() * 10 + (item.status === "compliant" ? 92 : 80) }
                                ]}
                                categories={["value"]}
                                index="day"
                                colors={[
                                  item.status === "compliant" ? "#10b981" : 
                                  item.status === "warning" ? "#f59e0b" : "#ef4444"
                                ]}
                                showLegend={false}
                                showXAxis={false}
                                showYAxis={false}
                                showGridLines={false}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            {item.status === "compliant" ? 
                              "No action needed" : 
                              item.status === "warning" ? 
                              "Monitor closely" : 
                              "Implement remediation plan"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Reporting Status</CardTitle>
                <CardDescription>Regulatory Documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Monthly Operations Report</span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Submitted</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center">
                      <FileBarChart className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Quarterly Compliance Report</span>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">In Progress</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center">
                      <Microscope className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Laboratory Analysis Results</span>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Submitted</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                    <div className="flex items-center">
                      <BarChart4 className="h-5 w-5 text-blue-500 mr-2" />
                      <span>Annual Performance Report</span>
                    </div>
                    <Badge variant="outline" className="bg-gray-50 text-gray-700">Due in 3 months</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Compliance Recommendations</CardTitle>
                <CardDescription>Action Items to Improve Compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceData.filter(item => item.status !== "compliant").length > 0 ? (
                    complianceData.filter(item => item.status !== "compliant").map((item, index) => (
                      <div key={index} className="border rounded-md p-4">
                        <div className="flex items-center mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            item.status === "warning" ? "bg-amber-500" : "bg-red-500"
                          } mr-2`}></div>
                          <h3 className="font-medium">{item.parameter} {item.status === "warning" ? "Warning" : "Violation"}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          Current value: <span className="font-medium">{item.value} {item.unit}</span> | 
                          Limit: <span className="font-medium">{item.limit}</span>
                        </p>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <h4 className="text-sm font-medium mb-1">Recommended Actions:</h4>
                          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                            {item.parameter === "BOD5" && (
                              <>
                                <li>Increase aeration in biological treatment process</li>
                                <li>Check for organic overloading in influent</li>
                                <li>Optimize sludge return rate from secondary clarifiers</li>
                              </>
                            )}
                            {item.parameter === "COD" && (
                              <>
                                <li>Increase hydraulic retention time in aeration tanks</li>
                                <li>Check for industrial discharges in influent</li>
                                <li>Consider adding chemical coagulants to enhance removal</li>
                              </>
                            )}
                            {item.parameter === "TSS" && (
                              <>
                                <li>Check clarifier operation and sludge blanket depth</li>
                                <li>Optimize polymer dosing in tertiary treatment</li>
                                <li>Inspect filters for potential breakthrough</li>
                              </>
                            )}
                            {item.parameter === "Total Nitrogen" && (
                              <>
                                <li>Verify anoxic zone functioning properly</li>
                                <li>Increase internal recycle rates</li>
                                <li>Check dissolved oxygen levels in biological systems</li>
                              </>
                            )}
                            {item.parameter === "Total Phosphorus" && (
                              <>
                                <li>Increase chemical dosing for phosphorus precipitation</li>
                                <li>Check mixing in chemical addition points</li>
                                <li>Optimize biological phosphorus removal process</li>
                              </>
                            )}
                            {item.parameter === "Fecal Coliform" && (
                              <>
                                <li>Check disinfection system operation</li>
                                <li>Increase chlorine dosage or UV intensity</li>
                                <li>Ensure adequate contact time in disinfection tank</li>
                              </>
                            )}
                            {item.parameter === "pH" && (
                              <>
                                <li>Adjust chemical dosing for pH neutralization</li>
                                <li>Check alkalinity of incoming wastewater</li>
                                <li>Monitor biological processes for acid production</li>
                              </>
                            )}
                          </ul>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="border rounded-md p-4 text-center">
                      <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                      <h3 className="font-medium mb-1">All Parameters Compliant</h3>
                      <p className="text-sm text-gray-500">
                        All monitored parameters are currently within regulatory limits. Continue with current operations.
                      </p>
                    </div>
                  )}

                  {complianceData.filter(item => item.status !== "compliant").length > 0 && (
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" className="mr-2">
                        Generate Report
                      </Button>
                      <Button>
                        Implement Action Plan
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-8">
          <MonthlyEfficiencyChart data={monthlyData} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Energy Consumption Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart 
                    data={monthlyData.map((item: any, index: number) => ({
                      month: item.month,
                      "Energy Usage": 2800 + Math.random() * 700 + (index * 50),
                      "Target": 3000,
                    }))}
                    categories={["Energy Usage", "Target"]}
                    index="month"
                    colors={["#8b5cf6", "#94a3b8"]}
                    valueFormatter={(value: number) => `${Math.round(value)} kWh`}
                    showLegend={true}
                    yAxisWidth={60}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Water Quality Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart 
                    data={monthlyData.map((item: any, index: number) => ({
                      month: item.month,
                      "BOD": Math.max(5, 20 - (item.efficiency * 0.15)),
                      "TSS": Math.max(7, 25 - (item.efficiency * 0.2)),
                      "Nitrogen": Math.max(3, 15 - (item.efficiency * 0.1)),
                    }))}
                    categories={["BOD", "TSS", "Nitrogen"]}
                    index="month"
                    colors={["#10b981", "#0ea5e9", "#8b5cf6"]}
                    valueFormatter={(value: number) => `${value.toFixed(1)} mg/L`}
                    showLegend={true}
                    yAxisWidth={60}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Operational Performance Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart 
                  data={[
                    { 
                      indicator: "Treatment Efficiency",
                      "Current Month": kpiData.efficiency,
                      "Previous Month": kpiData.efficiency - kpiData.efficiencyChange,
                      "Target": 90,
                    },
                    { 
                      indicator: "Energy Efficiency",
                      "Current Month": 85 + Math.random() * 5,
                      "Previous Month": 82 + Math.random() * 5,
                      "Target": 90,
                    },
                    { 
                      indicator: "Chemical Efficiency",
                      "Current Month": 78 + Math.random() * 10,
                      "Previous Month": 75 + Math.random() * 10,
                      "Target": 85,
                    },
                    { 
                      indicator: "Labor Efficiency",
                      "Current Month": 88 + Math.random() * 7,
                      "Previous Month": 85 + Math.random() * 7,
                      "Target": 90,
                    },
                    { 
                      indicator: "Overall Cost Efficiency",
                      "Current Month": 82 + Math.random() * 8,
                      "Previous Month": 80 + Math.random() * 8,
                      "Target": 85,
                    },
                  ]}
                  categories={["Current Month", "Previous Month", "Target"]}
                  index="indicator"
                  colors={["#10b981", "#94a3b8", "#f97316"]}
                  valueFormatter={(value: number) => `${value.toFixed(1)}%`}
                  yAxisWidth={60}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raw Data Tab */}
        <TabsContent value="raw" className="space-y-8">
          <EnhancedDataTable data={rawData} previousData={previousMonthRawData} />
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
      case "energy":
        return <BarChart3Icon className="h-5 w-5" />;
      case "chemical":
        return <FlaskConical className="h-5 w-5" />;
      case "biosolids":
        return <TreeDeciduous className="h-5 w-5" />;
      case "temperature":
        return <ThermometerIcon className="h-5 w-5" />;
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

// Compliance Card Component
function ComplianceCard({ title, value, parameter, status, regulation, limit }: ComplianceCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <div className="flex items-baseline mt-1">
              <h3 className="text-2xl font-bold">{value}</h3>
              <span className="ml-1 text-sm">{parameter}</span>
            </div>
          </div>
          <div className={`p-2 rounded-full ${
            status === "compliant" ? "bg-emerald-50 text-emerald-700" : 
            status === "warning" ? "bg-amber-50 text-amber-700" : 
            "bg-red-50 text-red-700"
          }`}>
            {status === "compliant" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Status:</span>
            <Badge variant={
              status === "compliant" ? "success" : 
              status === "warning" ? "warning" : 
              "destructive"
            }>
              {status === "compliant" ? "Compliant" : 
               status === "warning" ? "Warning" : 
               "Violation"}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Regulation:</span>
            <span>{regulation}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Limit:</span>
            <span>{limit}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

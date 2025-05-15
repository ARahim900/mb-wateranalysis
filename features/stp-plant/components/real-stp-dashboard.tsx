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
  ThermometerIcon,
  AlertTriangle,
  ZapIcon,
  ListFilter,
  Download,
  EyeIcon,
  HeartPulse,
  ClipboardCheck,
  WrenchIcon,
  ScrollText,
  BrainCircuit,
  ArrowRight
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
import AnomalyAlert from "./anomaly-alert"
import PredictiveCard from "./predictive-card"
import TreatmentQualityMetrics from "./treatment-quality-metrics"
import OperationalAnalytics from "./operational-analytics"
import MaintenanceSchedule from "./maintenance-schedule"

// Types for dashboard components
interface KPICardProps {
  title: string
  value: number
  unit: string
  change: number
  icon: "flow" | "efficiency" | "utilization" | "quality" | "energy" | "chemical" | "biosolids" | "temperature" | "sludge" | "oxygen" | "pressure"
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
    temperature: Number((25 + (Math.random() * 3 - 1.5)).toFixed(1)),
    dissolvedOxygen: Number((3.5 + (efficiencyFactor * 2.5) - (capacityFactor * 1)).toFixed(1)),
    sludgeReturnRate: Math.round(30 + (capacityFactor * 15)),
    mlssConcentration: Math.round(2500 + (capacityFactor * 500) + (efficiencyFactor * 500)),
    fmRatio: Number((0.15 + (capacityFactor * 0.15) - (efficiencyFactor * 0.1)).toFixed(2)),
    svi: Math.round(120 + (capacityFactor * 30) - (efficiencyFactor * 20)),
    pressure: Number((1.8 + (capacityFactor * 0.4)).toFixed(1))
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

// Generate anomaly alerts based on operational data and compliance
const generateAnomalyAlerts = (operationalData: any, complianceData: any) => {
  const alerts = []
  
  // Check for non-compliant parameters
  complianceData.forEach((item: any) => {
    if (item.status === "violation") {
      alerts.push({
        title: `${item.parameter} Exceeds Limit`,
        description: `${item.parameter} value (${item.value} ${item.unit}) exceeds regulatory limit of ${item.limit}`,
        severity: "high",
        timestamp: new Date().toISOString(),
        status: "active"
      })
    }
  })
  
  // Check for operational anomalies
  if (operationalData.dissolvedOxygen < 2) {
    alerts.push({
      title: "Low Dissolved Oxygen",
      description: `Dissolved oxygen level (${operationalData.dissolvedOxygen} mg/L) is below optimal range`,
      severity: "medium",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: "investigating"
    })
  }
  
  if (operationalData.mlssConcentration > 3500) {
    alerts.push({
      title: "High MLSS Concentration",
      description: `MLSS concentration (${operationalData.mlssConcentration} mg/L) exceeds optimal range`,
      severity: "medium",
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      status: "investigating"
    })
  }
  
  if (operationalData.energyConsumption > 3500) {
    alerts.push({
      title: "Energy Consumption Spike",
      description: `Energy consumption (${operationalData.energyConsumption} kWh) is above expected range`,
      severity: "low",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      status: "resolved"
    })
  }
  
  return alerts
}

// Generate predictive analytics data
const generatePredictiveData = (kpiData: any, operationalData: any) => {
  return [
    {
      title: "Projected Efficiency",
      current: kpiData.efficiency,
      predicted: Math.min(100, kpiData.efficiency + 2.5),
      unit: "%",
      description: "Based on recent operational improvements",
      trend: "up",
      timeframe: "7 days"
    },
    {
      title: "Energy Consumption",
      current: operationalData.energyConsumption,
      predicted: operationalData.energyConsumption * 0.95,
      unit: "kWh",
      description: "Forecasted based on planned optimization",
      trend: "down",
      timeframe: "30 days"
    },
    {
      title: "Chemical Usage",
      current: operationalData.chemicalUsage,
      predicted: operationalData.chemicalUsage * 0.97,
      unit: "kg",
      description: "Projected after dosing adjustments",
      trend: "down",
      timeframe: "14 days"
    },
    {
      title: "Equipment Maintenance",
      current: 85,
      predicted: 95,
      unit: "%",
      description: "Reliability after scheduled maintenance",
      trend: "up",
      timeframe: "60 days"
    }
  ]
}

// Generate maintenance schedule data
const generateMaintenanceData = () => {
  return [
    {
      equipment: "Aeration Blowers",
      lastService: new Date(Date.now() - 45 * 86400000).toLocaleDateString(),
      nextService: new Date(Date.now() + 45 * 86400000).toLocaleDateString(),
      status: "Operational",
      priority: "medium"
    },
    {
      equipment: "Clarifier Drive",
      lastService: new Date(Date.now() - 30 * 86400000).toLocaleDateString(),
      nextService: new Date(Date.now() + 60 * 86400000).toLocaleDateString(),
      status: "Operational",
      priority: "low"
    },
    {
      equipment: "Chemical Dosing Pumps",
      lastService: new Date(Date.now() - 60 * 86400000).toLocaleDateString(),
      nextService: new Date(Date.now() + 30 * 86400000).toLocaleDateString(),
      status: "Needs Attention",
      priority: "high"
    },
    {
      equipment: "UV Disinfection System",
      lastService: new Date(Date.now() - 90 * 86400000).toLocaleDateString(),
      nextService: new Date(Date.now() + 10 * 86400000).toLocaleDateString(),
      status: "Operational",
      priority: "medium"
    },
    {
      equipment: "Sludge Dewatering Unit",
      lastService: new Date(Date.now() - 15 * 86400000).toLocaleDateString(),
      nextService: new Date(Date.now() + 75 * 86400000).toLocaleDateString(),
      status: "Operational",
      priority: "low"
    }
  ]
}

export default function RealSTPDashboard() {
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
    temperature: 25.8,
    dissolvedOxygen: 4.5,
    sludgeReturnRate: 35,
    mlssConcentration: 2800,
    fmRatio: 0.18,
    svi: 130,
    pressure: 2.1
  })
  const [complianceData, setComplianceData] = useState<any[]>([])
  const [anomalyAlerts, setAnomalyAlerts] = useState<any[]>([])
  const [predictiveData, setPredictiveData] = useState<any[]>([])
  const [maintenanceData, setMaintenanceData] = useState<any[]>([])
  
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
      const newOperationalData = generateOperationalData(avgDailyFlow, kpiData.efficiency)
      setOperationalData(newOperationalData)
      
      // Generate compliance data
      const newComplianceData = generateComplianceData(newWaterQualityParams)
      setComplianceData(newComplianceData)
      
      // Generate anomaly alerts
      setAnomalyAlerts(generateAnomalyAlerts(newOperationalData, newComplianceData))
      
      // Generate predictive analytics data
      setPredictiveData(generatePredictiveData(kpiData, newOperationalData))
      
      // Generate maintenance schedule data
      setMaintenanceData(generateMaintenanceData())
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

      {/* Alerts Section */}
      {anomalyAlerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            System Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {anomalyAlerts.map((alert, index) => (
              <AnomalyAlert 
                key={index}
                title={alert.title}
                description={alert.description}
                severity={alert.severity}
                timestamp={alert.timestamp}
                status={alert.status}
              />
            ))}
          </div>
        </div>
      )}

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
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="daily">Daily Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
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
        <TabsContent value="quality">
          <TreatmentQualityMetrics 
            waterQualityParams={waterQualityParams}
            dailyData={dailyData}
            monthlyData={monthlyData}
          />
        </TabsContent>

        {/* Operations Tab */}
        <TabsContent value="operations">
          <OperationalAnalytics 
            operationalData={operationalData}
            dailyData={dailyData}
            monthlyData={monthlyData}
          />
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <MaintenanceSchedule maintenanceData={maintenanceData} />
        </TabsContent>

        {/* Daily Analysis Tab */}
        <TabsContent value="daily" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Daily Inflow & Outflow</CardTitle>
                <CardDescription>
                  Daily STP flows for {getMonthName()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart
                    data={dailyData.map(day => ({
                      day: day.day,
                      inflow: day.flowRate,
                      outflow: day.flowRate * (day.efficiency / 100),
                    }))}
                    index="day"
                    categories={["inflow", "outflow"]}
                    colors={["blue", "green"]}
                    valueFormatter={(value) => `${Math.round(value)} m³`}
                    showLegend={true}
                    yAxisWidth={60}
                  />
                </div>
              </CardContent>
            </Card>

            <DailyEfficiencyChart data={dailyData} />
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Monthly Flow Trend</CardTitle>
                <CardDescription>Average daily flow by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart
                    data={monthlyData}
                    index="month"
                    categories={["flowRate"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${Math.round(value)} m³`}
                    showLegend={false}
                    yAxisWidth={60}
                  />
                </div>
              </CardContent>
            </Card>

            <MonthlyEfficiencyChart data={monthlyData} />
          </div>
        </TabsContent>

        {/* Predictive Analytics Tab */}
        <TabsContent value="predictive" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {predictiveData.map((prediction, index) => (
              <PredictiveCard
                key={index}
                title={prediction.title}
                current={prediction.current}
                predicted={prediction.predicted}
                unit={prediction.unit}
                description={prediction.description}
                trend={prediction.trend}
                timeframe={prediction.timeframe}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Predictive Maintenance Recommendations</CardTitle>
                <CardDescription>AI-Driven Equipment Health Insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center">
                      <BrainCircuit className="h-10 w-10 text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-medium">AI-Powered Prediction Model</h3>
                        <p className="text-sm text-gray-500">Using machine learning to predict equipment failures and optimize maintenance</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">Active</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                          Aeration Blower #2 
                        </h3>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700">Attention Needed</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Vibration analysis indicates potential bearing wear. Recommended maintenance within 15 days to prevent unexpected failure.</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Failure probability:</span>
                        <span className="font-medium text-amber-600">32% within 30 days</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                          UV Disinfection System
                        </h3>
                        <Badge variant="outline" className="bg-red-50 text-red-700">Urgent</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">UV intensity trending downward. Lamp replacement required within 7 days to maintain disinfection efficacy.</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Failure probability:</span>
                        <span className="font-medium text-red-600">68% within 14 days</span>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                          Clarifier Drive Motors
                        </h3>
                        <Badge variant="outline" className="bg-green-50 text-green-700">Healthy</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">All parameters within normal operating ranges. No maintenance required at this time.</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Failure probability:</span>
                        <span className="font-medium text-green-600">&lt;5% within 90 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Efficiency Optimization Forecast</CardTitle>
                <CardDescription>Projected Performance Improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Treatment Efficiency Projection</h3>
                    <LineChart 
                      data={[
                        { month: "Current", efficiency: kpiData.efficiency },
                        { month: "+1 Month", efficiency: Math.min(98, kpiData.efficiency + 1.5) },
                        { month: "+2 Months", efficiency: Math.min(98, kpiData.efficiency + 2.5) },
                        { month: "+3 Months", efficiency: Math.min(98, kpiData.efficiency + 3) },
                      ]}
                      categories={["efficiency"]}
                      index="month"
                      colors={["#10b981"]}
                      valueFormatter={(value) => `${value.toFixed(1)}%`}
                      className="h-60"
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Resource Optimization Potential</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Energy Savings</span>
                            <span className="font-medium">7-10%</span>
                          </div>
                          <Progress value={8.5} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Chemical Reduction</span>
                            <span className="font-medium">5-8%</span>
                          </div>
                          <Progress value={6.5} className="h-1.5" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Maintenance Cost Savings</span>
                            <span className="font-medium">10-15%</span>
                          </div>
                          <Progress value={12.5} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-2">Recommended Process Adjustments</h3>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <div className="mt-0.5 mr-2 h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs text-blue-700">1</span>
                          </div>
                          <span>Optimize MLSS concentration in aeration basins to 3,200 mg/L</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mt-0.5 mr-2 h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs text-blue-700">2</span>
                          </div>
                          <span>Adjust RAS rate to 40% of influent flow during peak periods</span>
                        </li>
                        <li className="flex items-start">
                          <div className="mt-0.5 mr-2 h-4 w-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-xs text-blue-700">3</span>
                          </div>
                          <span>Implement time-based chemical dosing strategy based on influent patterns</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Overall Compliance</CardTitle>
                <CardDescription>Regulatory standards adherence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-36 h-36 mb-3">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={calculateCompliancePercentage() >= 90 ? "#10b981" : calculateCompliancePercentage() >= 75 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="10"
                        strokeDasharray={`${(calculateCompliancePercentage() / 100) * 283} 283`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-3xl font-bold">{calculateCompliancePercentage()}%</span>
                      <span className="text-xs text-gray-500">Compliant</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      Based on Oman Standard 115/2001 for treated wastewater
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Compliance Distribution</CardTitle>
                <CardDescription>Parameter status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-44">
                  <BarChart
                    data={[
                      { 
                        status: "Compliant", 
                        count: complianceData.filter(item => item.status === "compliant").length,
                        color: "#10b981"
                      },
                      { 
                        status: "Warning", 
                        count: complianceData.filter(item => item.status === "warning").length,
                        color: "#f59e0b"
                      },
                      { 
                        status: "Violation", 
                        count: complianceData.filter(item => item.status === "violation").length,
                        color: "#ef4444"
                      }
                    ]}
                    index="status"
                    categories={["count"]}
                    colors={["emerald", "amber", "red"]}
                    valueFormatter={(value) => `${value} parameter${value !== 1 ? 's' : ''}`}
                    layout="vertical"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Parameter Compliance Status</CardTitle>
              <CardDescription>Detailed regulatory compliance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Regulatory Limit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Regulation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complianceData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.parameter}</TableCell>
                        <TableCell>{item.value} {item.unit}</TableCell>
                        <TableCell>{item.limit}</TableCell>
                        <TableCell>
                          {item.status === "compliant" ? (
                            <Badge className="bg-emerald-50 text-emerald-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Compliant
                            </Badge>
                          ) : item.status === "warning" ? (
                            <Badge className="bg-amber-50 text-amber-700">
                              <AlertTriangle className="h-3 w-3 mr-1" /> Warning
                            </Badge>
                          ) : (
                            <Badge className="bg-red-50 text-red-700">
                              <AlertCircle className="h-3 w-3 mr-1" /> Violation
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{item.regulation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
      case "sludge":
        return <Droplets className="h-5 w-5" />;
      case "oxygen":
        return <DropletIcon className="h-5 w-5" />;
      case "pressure":
        return <GaugeIcon className="h-5 w-5" />;
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
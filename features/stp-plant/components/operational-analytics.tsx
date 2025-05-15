"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, LineChart } from "@/components/ui/charts"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  CheckCircle2, 
  LineChart as LineChartIcon, 
  ZapIcon, 
  FlaskConical, 
  Gauge, 
  BarChart4,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface OperationalAnalyticsProps {
  operationalData: {
    energyConsumption: number
    chemicalUsage: number
    biosolidsProduction: number
    operatingCost: number
    aerationRate: number
    sludgeProcessed: number
    retentionTime: number
    temperature: number
    dissolvedOxygen: number
    sludgeReturnRate: number
    mlssConcentration: number
    fmRatio: number
    svi: number
    pressure: number
  }
  dailyData: any[]
  monthlyData: any[]
}

export function OperationalAnalytics({ 
  operationalData, 
  dailyData,
  monthlyData
}: OperationalAnalyticsProps) {
  const [selectedResourceMetric, setSelectedResourceMetric] = useState("energy")
  
  // Calculate energy efficiency (kWh per m³ of treated water)
  // Assuming 500 m³ per day as average treated volume
  const energyEfficiency = operationalData.energyConsumption / 500
  
  // Calculate chemical efficiency (kg per m³ of treated water)
  const chemicalEfficiency = operationalData.chemicalUsage / 500
  
  // Generate daily resource usage data (for demonstration)
  const generateResourceData = () => {
    const baseValue = selectedResourceMetric === "energy" 
      ? operationalData.energyConsumption 
      : selectedResourceMetric === "chemical" 
        ? operationalData.chemicalUsage 
        : operationalData.biosolidsProduction * 1000 // convert to kg
    
    return Array.from({ length: 14 }, (_, i) => {
      // Random variation within ±10%
      const dailyValue = baseValue * (0.9 + Math.random() * 0.2)
      
      return {
        day: `Day ${i + 1}`,
        usage: Number(dailyValue.toFixed(0)),
        target: selectedResourceMetric === "energy" 
          ? 3000 
          : selectedResourceMetric === "chemical" 
            ? 140 
            : 3000 // biosolids target in kg
      }
    })
  }
  
  // Process performance indicators
  const processPerformance = [
    {
      name: "MLSS Concentration",
      value: operationalData.mlssConcentration,
      unit: "mg/L",
      target: "2,500-3,500 mg/L",
      status: operationalData.mlssConcentration >= 2500 && operationalData.mlssConcentration <= 3500 
        ? "optimal" 
        : "suboptimal"
    },
    {
      name: "F/M Ratio",
      value: operationalData.fmRatio,
      unit: "d⁻¹",
      target: "0.15-0.25 d⁻¹",
      status: operationalData.fmRatio >= 0.15 && operationalData.fmRatio <= 0.25 
        ? "optimal" 
        : "suboptimal"
    },
    {
      name: "Sludge Volume Index",
      value: operationalData.svi,
      unit: "mL/g",
      target: "100-150 mL/g",
      status: operationalData.svi >= 100 && operationalData.svi <= 150 
        ? "optimal" 
        : "suboptimal"
    },
    {
      name: "Dissolved Oxygen",
      value: operationalData.dissolvedOxygen,
      unit: "mg/L",
      target: "2.0-4.0 mg/L",
      status: operationalData.dissolvedOxygen >= 2.0 && operationalData.dissolvedOxygen <= 4.0 
        ? "optimal" 
        : "suboptimal"
    },
    {
      name: "Retention Time",
      value: operationalData.retentionTime,
      unit: "hours",
      target: "12-24 hours",
      status: operationalData.retentionTime >= 12 && operationalData.retentionTime <= 24 
        ? "optimal" 
        : "suboptimal"
    },
    {
      name: "Return Activated Sludge Rate",
      value: operationalData.sludgeReturnRate,
      unit: "%",
      target: "25-50%",
      status: operationalData.sludgeReturnRate >= 25 && operationalData.sludgeReturnRate <= 50 
        ? "optimal" 
        : "suboptimal"
    }
  ]
  
  // Operational KPIs
  const operationalKPIs = [
    {
      name: "Energy Efficiency",
      value: energyEfficiency.toFixed(2),
      unit: "kWh/m³",
      target: "< 0.7 kWh/m³",
      status: energyEfficiency < 0.7 ? "good" : energyEfficiency < 0.9 ? "average" : "poor",
      change: -5.3,
      icon: <ZapIcon className="h-5 w-5 text-purple-500" />
    },
    {
      name: "Chemical Efficiency",
      value: chemicalEfficiency.toFixed(2),
      unit: "kg/m³",
      target: "< 0.35 kg/m³",
      status: chemicalEfficiency < 0.35 ? "good" : chemicalEfficiency < 0.5 ? "average" : "poor",
      change: -2.1,
      icon: <FlaskConical className="h-5 w-5 text-pink-500" />
    },
    {
      name: "Operational Uptime",
      value: "99.4",
      unit: "%",
      target: "> 98%",
      status: "good",
      change: 0.7,
      icon: <Gauge className="h-5 w-5 text-emerald-500" />
    },
    {
      name: "Cost Efficiency",
      value: (operationalData.operatingCost / 500).toFixed(2),
      unit: "OMR/m³",
      target: "< 1.0 OMR/m³",
      status: (operationalData.operatingCost / 500) < 1.0 ? "good" : "average",
      change: -3.8,
      icon: <BarChart4 className="h-5 w-5 text-blue-500" />
    }
  ]
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {operationalKPIs.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{kpi.name}</p>
                  <div className="flex items-baseline mt-1">
                    <h3 className="text-2xl font-bold">{kpi.value}</h3>
                    <span className="ml-1 text-sm">{kpi.unit}</span>
                  </div>
                </div>
                <div className={`p-2 rounded-full bg-opacity-10 ${
                  kpi.status === "good" ? "bg-emerald-100" : 
                  kpi.status === "average" ? "bg-amber-100" : 
                  "bg-red-100"
                }`}>
                  {kpi.icon}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {kpi.change > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-emerald-500" />
                    )}
                    <span className={`ml-1 text-sm font-medium ${
                      (kpi.name === "Energy Efficiency" || kpi.name === "Chemical Efficiency" || kpi.name === "Cost Efficiency") 
                        ? (kpi.change < 0 ? "text-emerald-500" : "text-red-500")
                        : (kpi.change > 0 ? "text-emerald-500" : "text-red-500")
                    }`}>
                      {Math.abs(kpi.change)}%
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">Target: {kpi.target}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Tabs defaultValue="operational">
        <TabsList className="mb-4">
          <TabsTrigger value="operational">Process Parameters</TabsTrigger>
          <TabsTrigger value="resource">Resource Usage</TabsTrigger>
          <TabsTrigger value="process">Process Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="operational" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Key Process Parameters</CardTitle>
              <CardDescription>Current operational conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Target Range</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processPerformance.map((param, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{param.name}</TableCell>
                        <TableCell>{param.value} {param.unit}</TableCell>
                        <TableCell>{param.target}</TableCell>
                        <TableCell>
                          {param.status === "optimal" ? (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" /> Optimal
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                              <AlertTriangle className="h-3 w-3 mr-1" /> Needs Adjustment
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Aeration Parameters</CardTitle>
                <CardDescription>Critical process control factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Aeration Rate</span>
                      <span className="text-sm font-medium">
                        {operationalData.aerationRate} m³/hr
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={(operationalData.aerationRate / 100) * 100} 
                        className="h-2" 
                      />
                      <div 
                        className="absolute top-0 h-2 border-r border-emerald-500" 
                        style={{ left: `${80}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Min: 60 m³/hr</span>
                      <span className="text-xs text-gray-500">Optimal: 80 m³/hr</span>
                      <span className="text-xs text-gray-500">Max: 100 m³/hr</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Dissolved Oxygen</span>
                      <span className="text-sm font-medium">
                        {operationalData.dissolvedOxygen} mg/L
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={(operationalData.dissolvedOxygen / 5) * 100} 
                        className="h-2" 
                      />
                      <div 
                        className="absolute top-0 h-2 border-r border-emerald-500" 
                        style={{ left: `${40}%` }}
                      ></div>
                      <div 
                        className="absolute top-0 h-2 border-r border-emerald-500" 
                        style={{ left: `${80}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Low: 2 mg/L</span>
                      <span className="text-xs text-gray-500">Optimal: 2-4 mg/L</span>
                      <span className="text-xs text-gray-500">High: >4 mg/L</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Temperature</span>
                      <span className="text-sm font-medium">
                        {operationalData.temperature}°C
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={((operationalData.temperature - 15) / 20) * 100} 
                        className="h-2" 
                      />
                      <div 
                        className="absolute top-0 h-2 border-r border-emerald-500" 
                        style={{ left: `${25}%` }}
                      ></div>
                      <div 
                        className="absolute top-0 h-2 border-r border-emerald-500" 
                        style={{ left: `${75}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Low: 15°C</span>
                      <span className="text-xs text-gray-500">Optimal: 20-30°C</span>
                      <span className="text-xs text-gray-500">High: 35°C</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Sludge Management</CardTitle>
                <CardDescription>Activated sludge process metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">MLSS Concentration</span>
                      <span className="text-sm font-medium">
                        {operationalData.mlssConcentration} mg/L
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={(operationalData.mlssConcentration / 4000) * 100} 
                        className="h-2" 
                      />
                      <div 
                        className="absolute top-0 h-2 border-r border-emerald-500" 
                        style={{ left: `${62.5}%` }}
                      ></div>
                      <div 
                        className="absolute top-0 h-2 border-r border-emerald-500" 
                        style={{ left: `${87.5}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Low: <2,000 mg/L</span>
                      <span className="text-xs text-gray-500">Optimal: 2,500-3,500 mg/L</span>
                      <span className="text-xs text-gray-500">High: >4,000 mg/L</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Sludge Return Rate</span>
                      <span className="text-sm font-medium">
                        {operationalData.sludgeReturnRate}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={(operationalData.sludgeReturnRate / 60) * 100} 
                        className="h-2" 
                      />
                      <div 
                        className="absolute top-0 h-2 border-r border-emerald-500" 
                        style={{ left: `${41.7}%` }}
                      ></div>
                      <div 
                        className="absolute top-0 h-2 border-r border-emerald-500" 
                        style={{ left: `${83.3}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Low: <25%</span>
                      <span className="text-xs text-gray-500">Optimal: 25-50%</span>
                      <span className="text-xs text-gray-500">High: >50%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">F/M Ratio</span>
                      <span className="text-sm font-medium">
                        {operationalData.fmRatio} d⁻¹
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={(operationalData.fmRatio / 0.4) * 100} 
                        className="h-2" 
                      />
                      <div 
                        className="absolute top-0 h-2 border-r border-emerald-500" 
                        style={{ left: `${37.5}%` }}
                      ></div>
                      <div 
                        className="absolute top-0 h-2 border-r border-emerald-500" 
                        style={{ left: `${62.5}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Low: <0.15 d⁻¹</span>
                      <span className="text-xs text-gray-500">Optimal: 0.15-0.25 d⁻¹</span>
                      <span className="text-xs text-gray-500">High: >0.3 d⁻¹</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="resource" className="space-y-4">
          <div className="flex items-center justify-end mb-4">
            <div className="flex gap-2">
              <Badge 
                variant="outline" 
                className={selectedResourceMetric === "energy" ? "bg-blue-50 text-blue-700" : ""}
                onClick={() => setSelectedResourceMetric("energy")}
              >
                <ZapIcon className="h-3 w-3 mr-1" /> Energy
              </Badge>
              <Badge 
                variant="outline" 
                className={selectedResourceMetric === "chemical" ? "bg-blue-50 text-blue-700" : ""}
                onClick={() => setSelectedResourceMetric("chemical")}
              >
                <FlaskConical className="h-3 w-3 mr-1" /> Chemicals
              </Badge>
              <Badge 
                variant="outline" 
                className={selectedResourceMetric === "biosolids" ? "bg-blue-50 text-blue-700" : ""}
                onClick={() => setSelectedResourceMetric("biosolids")}
              >
                <ZapIcon className="h-3 w-3 mr-1" /> Biosolids
              </Badge>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">
                {selectedResourceMetric === "energy" 
                  ? "Energy Consumption Trend" 
                  : selectedResourceMetric === "chemical" 
                    ? "Chemical Usage Trend" 
                    : "Biosolids Production Trend"}
              </CardTitle>
              <CardDescription>
                {selectedResourceMetric === "energy" 
                  ? "Daily power consumption (kWh)" 
                  : selectedResourceMetric === "chemical" 
                    ? "Daily chemical consumption (kg)" 
                    : "Daily biosolids production (kg)"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart
                  data={generateResourceData()}
                  index="day"
                  categories={["usage", "target"]}
                  colors={["blue", "red"]}
                  valueFormatter={(value) => 
                    `${value} ${
                      selectedResourceMetric === "energy" 
                        ? "kWh" 
                        : selectedResourceMetric === "chemical" 
                          ? "kg" 
                          : "kg"
                    }`
                  }
                  showLegend={true}
                  showXAxis={true}
                  showYAxis={true}
                  yAxisWidth={60}
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                  <span>Actual Usage</span>
                </div>
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                  <span>Target Threshold</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Energy Profile</CardTitle>
                <CardDescription>Distribution by usage area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <BarChart
                    data={[
                      { category: "Aeration", value: 45 },
                      { category: "Pumping", value: 20 },
                      { category: "UV Disinfection", value: 15 },
                      { category: "Sludge Treatment", value: 12 },
                      { category: "Other", value: 8 }
                    ]}
                    index="category"
                    categories={["value"]}
                    colors={["blue"]}
                    valueFormatter={(value) => `${value}%`}
                    stack={true}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Chemical Usage</CardTitle>
                <CardDescription>Distribution by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <BarChart
                    data={[
                      { category: "Coagulants", value: 35 },
                      { category: "pH Adjusters", value: 25 },
                      { category: "Disinfectants", value: 20 },
                      { category: "Polymers", value: 15 },
                      { category: "Other", value: 5 }
                    ]}
                    index="category"
                    categories={["value"]}
                    colors={["emerald"]}
                    valueFormatter={(value) => `${value}%`}
                    stack={true}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Operating Costs</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <BarChart
                    data={[
                      { category: "Energy", value: 35 },
                      { category: "Chemicals", value: 22 },
                      { category: "Labor", value: 25 },
                      { category: "Maintenance", value: 12 },
                      { category: "Other", value: 6 }
                    ]}
                    index="category"
                    categories={["value"]}
                    colors={["amber"]}
                    valueFormatter={(value) => `${value}%`}
                    stack={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="process" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Process Efficiency Analysis</CardTitle>
              <CardDescription>Treatment process performance trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart
                  data={[
                    { month: "Jan", organic: 85, removal: 92, settlability: 88 },
                    { month: "Feb", organic: 87, removal: 93, settlability: 89 },
                    { month: "Mar", organic: 89, removal: 94, settlability: 90 },
                    { month: "Apr", organic: 91, removal: 95, settlability: 92 },
                    { month: "May", organic: 92, removal: 94, settlability: 91 }
                  ]}
                  index="month"
                  categories={["organic", "removal", "settlability"]}
                  colors={["blue", "green", "amber"]}
                  valueFormatter={(value) => `${value}%`}
                  showLegend={true}
                  showXAxis={true}
                  showYAxis={true}
                  yAxisWidth={48}
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-500">
                <div className="flex items-center mr-4 mb-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
                  <span>Organic Removal Efficiency</span>
                </div>
                <div className="flex items-center mr-4 mb-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                  <span>Solids Removal Efficiency</span>
                </div>
                <div className="flex items-center mb-2">
                  <div className="h-3 w-3 rounded-full bg-amber-500 mr-1"></div>
                  <span>Sludge Settlability Index</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Process Control Recommendations</CardTitle>
                <CardDescription>Optimization suggestions based on current parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                        1
                      </div>
                      <h3 className="font-medium">Adjust MLSS Concentration</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {operationalData.mlssConcentration > 3500 
                        ? "Current MLSS concentration is above optimal range. Consider increasing wasting rate to reduce MLSS to 3,000-3,200 mg/L for better settleability and oxygen transfer efficiency."
                        : operationalData.mlssConcentration < 2500
                          ? "Current MLSS concentration is below optimal range. Consider decreasing wasting rate to increase MLSS to 2,800-3,000 mg/L for better treatment performance."
                          : "MLSS concentration is within optimal range. Maintain current wasting rate to sustain good process performance."}
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                        2
                      </div>
                      <h3 className="font-medium">Optimize Aeration Rate</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {operationalData.dissolvedOxygen > 4.0 
                        ? "Dissolved oxygen levels are higher than necessary. Consider reducing aeration rate to save energy while maintaining DO between 2.0-3.0 mg/L in aeration basins."
                        : operationalData.dissolvedOxygen < 2.0
                          ? "Dissolved oxygen levels are below optimal range. Increase aeration rate to maintain DO between 2.0-3.0 mg/L to ensure sufficient biological activity."
                          : "Dissolved oxygen levels are within optimal range. Continue monitoring to maintain sufficient biological activity while minimizing energy consumption."}
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-2">
                        3
                      </div>
                      <h3 className="font-medium">Adjust Return Sludge Flow</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {operationalData.sludgeReturnRate > 50 
                        ? "Return activated sludge (RAS) flow rate is higher than optimal. Consider reducing RAS rate to 30-40% of influent flow to improve settling in the clarifiers."
                        : operationalData.sludgeReturnRate < 25
                          ? "Return activated sludge (RAS) flow rate is lower than optimal. Consider increasing RAS rate to 30-40% of influent flow to maintain adequate MLSS in aeration basins."
                          : "Return activated sludge (RAS) flow rate is within optimal range. Maintain current rate to ensure proper operation of the activated sludge process."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Process Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators for biological treatment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">BOD Removal Efficiency</span>
                      <span className="text-sm font-medium">94.5%</span>
                    </div>
                    <Progress value={94.5} className="h-2" />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Target: >90%</span>
                      <span className={`text-xs ${94.5 >= 90 ? "text-emerald-500" : "text-amber-500"}`}>
                        {94.5 >= 90 ? "Meeting Target" : "Below Target"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">TSS Removal Efficiency</span>
                      <span className="text-sm font-medium">96.2%</span>
                    </div>
                    <Progress value={96.2} className="h-2" />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Target: >92%</span>
                      <span className={`text-xs ${96.2 >= 92 ? "text-emerald-500" : "text-amber-500"}`}>
                        {96.2 >= 92 ? "Meeting Target" : "Below Target"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Nitrogen Removal Efficiency</span>
                      <span className="text-sm font-medium">86.8%</span>
                    </div>
                    <Progress value={86.8} className="h-2" />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Target: >80%</span>
                      <span className={`text-xs ${86.8 >= 80 ? "text-emerald-500" : "text-amber-500"}`}>
                        {86.8 >= 80 ? "Meeting Target" : "Below Target"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Phosphorus Removal Efficiency</span>
                      <span className="text-sm font-medium">83.5%</span>
                    </div>
                    <Progress value={83.5} className="h-2" />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Target: >75%</span>
                      <span className={`text-xs ${83.5 >= 75 ? "text-emerald-500" : "text-amber-500"}`}>
                        {83.5 >= 75 ? "Meeting Target" : "Below Target"}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Hydraulic Retention Time</span>
                      <span className="text-sm font-medium">{operationalData.retentionTime} hrs</span>
                    </div>
                    <Progress 
                      value={(operationalData.retentionTime / 24) * 100} 
                      className="h-2" 
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Target: 12-24 hrs</span>
                      <span className={`text-xs ${
                        operationalData.retentionTime >= 12 && operationalData.retentionTime <= 24 
                          ? "text-emerald-500" 
                          : "text-amber-500"
                      }`}>
                        {operationalData.retentionTime >= 12 && operationalData.retentionTime <= 24 
                          ? "Optimal Range" 
                          : operationalData.retentionTime < 12 
                            ? "Too Short" 
                            : "Too Long"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default OperationalAnalytics
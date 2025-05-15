"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, DonutChart, LineChart } from "@/components/ui/charts"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, Droplets, LineChart as LineChartIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface TreatmentQualityMetricsProps {
  waterQualityParams: {
    phValue: number
    codValue: number
    bodValue: number
    tssValue: number
    tnValue: number
    tpValue: number
    fecalValue: number
    turbidity: number
    dissolvedOxygen: number
  }
  dailyData: any[]
  monthlyData: any[]
}

export function TreatmentQualityMetrics({ 
  waterQualityParams, 
  dailyData,
  monthlyData
}: TreatmentQualityMetricsProps) {
  const [selectedParameter, setSelectedParameter] = useState("bod")
  
  // Define parameter limits for quality assessment
  const parameterLimits = {
    bod: { target: 20, warning: 25, unit: "mg/L", name: "BOD" },
    cod: { target: 100, warning: 120, unit: "mg/L", name: "COD" },
    tss: { target: 30, warning: 40, unit: "mg/L", name: "TSS" },
    tn: { target: 15, warning: 20, unit: "mg/L", name: "Total Nitrogen" },
    tp: { target: 2, warning: 3, unit: "mg/L", name: "Total Phosphorus" },
    fecal: { target: 1000, warning: 1500, unit: "CFU/100ml", name: "Fecal Coliform" },
  }

  const getStatusColor = (value: number, parameter: string) => {
    const limits = parameterLimits[parameter as keyof typeof parameterLimits]
    if (!limits) return "text-gray-500"
    
    if (value <= limits.target) return "text-emerald-500"
    if (value <= limits.warning) return "text-amber-500"
    return "text-red-500"
  }

  const getCompliancePercentage = () => {
    let compliantCount = 0
    let totalParams = 0
    
    if (waterQualityParams.bodValue <= parameterLimits.bod.target) compliantCount++
    totalParams++
    
    if (waterQualityParams.codValue <= parameterLimits.cod.target) compliantCount++
    totalParams++
    
    if (waterQualityParams.tssValue <= parameterLimits.tss.target) compliantCount++
    totalParams++
    
    if (waterQualityParams.tnValue <= parameterLimits.tn.target) compliantCount++
    totalParams++
    
    if (waterQualityParams.tpValue <= parameterLimits.tp.target) compliantCount++
    totalParams++
    
    if (waterQualityParams.fecalValue <= parameterLimits.fecal.target) compliantCount++
    totalParams++
    
    return Math.round((compliantCount / totalParams) * 100)
  }

  const getStatusBadge = (value: number, parameter: string) => {
    const limits = parameterLimits[parameter as keyof typeof parameterLimits]
    if (!limits) return <Badge>N/A</Badge>
    
    if (value <= limits.target) return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Compliant</Badge>
    if (value <= limits.warning) return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Warning</Badge>
    return <Badge className="bg-red-50 text-red-700 border-red-200">Violation</Badge>
  }

  // Prepare chart data for parameter trends
  const prepareParameterTrendData = () => {
    // Create simulated data for visualization based on the selected parameter
    // In a real implementation, this would use historical data from an API or database
    const baseValue = waterQualityParams[`${selectedParameter}Value` as keyof typeof waterQualityParams] || 0
    
    return Array.from({ length: 30 }, (_, i) => {
      const dayOffset = i - 29 // Days from today (-29 to 0)
      // Create a small random variation around the current value
      const randomFactor = 0.15 // 15% random variation
      const randomValue = baseValue * (1 + (Math.random() * randomFactor * 2 - randomFactor))
      
      return {
        day: `Day ${30 + dayOffset}`,
        value: Number(randomValue.toFixed(1)),
        limit: parameterLimits[selectedParameter as keyof typeof parameterLimits]?.target || 0
      }
    })
  }

  const compliancePercentage = getCompliancePercentage()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Water Quality Compliance</CardTitle>
            <CardDescription>Overall regulatory compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
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
                    stroke={compliancePercentage >= 90 ? "#10b981" : compliancePercentage >= 75 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray={`${(compliancePercentage / 100) * 283} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold">{compliancePercentage}%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {compliancePercentage >= 90 ? (
                    <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                  )}
                  <span className={compliancePercentage >= 90 ? "text-emerald-600" : "text-amber-600"}>
                    {compliancePercentage >= 90 ? "Fully Compliant" : "Partially Compliant"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Based on Oman Standard 115/2001</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Key Water Quality Parameters</CardTitle>
            <CardDescription>Current treatment performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">BOD₅</span>
                  <span className={`text-sm font-medium ${getStatusColor(waterQualityParams.bodValue, 'bod')}`}>
                    {waterQualityParams.bodValue} mg/L
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={Math.min(100, (waterQualityParams.bodValue / parameterLimits.bod.warning) * 100)} 
                    className="h-2" 
                  />
                  <div 
                    className="absolute top-0 h-2 border-r border-emerald-500" 
                    style={{ left: `${(parameterLimits.bod.target / parameterLimits.bod.warning) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">COD</span>
                  <span className={`text-sm font-medium ${getStatusColor(waterQualityParams.codValue, 'cod')}`}>
                    {waterQualityParams.codValue} mg/L
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={Math.min(100, (waterQualityParams.codValue / parameterLimits.cod.warning) * 100)} 
                    className="h-2" 
                  />
                  <div 
                    className="absolute top-0 h-2 border-r border-emerald-500" 
                    style={{ left: `${(parameterLimits.cod.target / parameterLimits.cod.warning) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">TSS</span>
                  <span className={`text-sm font-medium ${getStatusColor(waterQualityParams.tssValue, 'tss')}`}>
                    {waterQualityParams.tssValue} mg/L
                  </span>
                </div>
                <div className="relative">
                  <Progress 
                    value={Math.min(100, (waterQualityParams.tssValue / parameterLimits.tss.warning) * 100)}
                    className="h-2" 
                  />
                  <div 
                    className="absolute top-0 h-2 border-r border-emerald-500" 
                    style={{ left: `${(parameterLimits.tss.target / parameterLimits.tss.warning) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Physical Quality</CardTitle>
            <CardDescription>Key physical indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-sm font-medium">pH</span>
                  </div>
                  <div className="text-lg font-semibold">{waterQualityParams.phValue}</div>
                  <div className="text-xs text-gray-500">Target: 6.0-9.0</div>
                </div>
                
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center mb-1">
                    <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-sm font-medium">Turbidity</span>
                  </div>
                  <div className="text-lg font-semibold">{waterQualityParams.turbidity} NTU</div>
                  <div className="text-xs text-gray-500">Target: ≤ 5 NTU</div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center mb-1">
                  <Droplets className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="text-sm font-medium">Dissolved Oxygen</span>
                </div>
                <div className="flex justify-between">
                  <div className="text-lg font-semibold">{waterQualityParams.dissolvedOxygen} mg/L</div>
                  <Badge 
                    className={waterQualityParams.dissolvedOxygen >= 4 ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}
                  >
                    {waterQualityParams.dissolvedOxygen >= 4 ? "Optimal" : "Low"}
                  </Badge>
                </div>
                <div className="text-xs text-gray-500">Target: ≥ 4.0 mg/L</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-medium">Water Quality Parameter Trends</CardTitle>
              <CardDescription>30-day parameter analysis</CardDescription>
            </div>
            <Select value={selectedParameter} onValueChange={setSelectedParameter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select parameter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bod">BOD₅</SelectItem>
                <SelectItem value="cod">COD</SelectItem>
                <SelectItem value="tss">TSS</SelectItem>
                <SelectItem value="tn">Total Nitrogen</SelectItem>
                <SelectItem value="tp">Total Phosphorus</SelectItem>
                <SelectItem value="fecal">Fecal Coliform</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <LineChart
              data={prepareParameterTrendData()}
              index="day"
              categories={["value", "limit"]}
              colors={["blue", "red"]}
              valueFormatter={(value) => `${value} ${parameterLimits[selectedParameter as keyof typeof parameterLimits]?.unit || ''}`}
              showLegend={true}
              showXAxis={true}
              showYAxis={true}
              yAxisWidth={60}
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
              <span>Actual {parameterLimits[selectedParameter as keyof typeof parameterLimits]?.name || selectedParameter}</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
              <span>Regulatory Limit</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="parameters">
        <TabsList className="mb-4">
          <TabsTrigger value="parameters">Detailed Parameters</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Monthly Comparison</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parameters" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Biochemical Oxygen Demand (BOD₅)</h3>
                {getStatusBadge(waterQualityParams.bodValue, 'bod')}
              </div>
              <div className="flex items-center mb-2">
                <LineChartIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-2xl font-bold">{waterQualityParams.bodValue}</span>
                <span className="ml-1 text-gray-500">mg/L</span>
              </div>
              <p className="text-sm text-gray-500">
                Measures the amount of dissolved oxygen microorganisms need to break down organic material.
                Lower values indicate cleaner water.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Chemical Oxygen Demand (COD)</h3>
                {getStatusBadge(waterQualityParams.codValue, 'cod')}
              </div>
              <div className="flex items-center mb-2">
                <LineChartIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-2xl font-bold">{waterQualityParams.codValue}</span>
                <span className="ml-1 text-gray-500">mg/L</span>
              </div>
              <p className="text-sm text-gray-500">
                Measures all chemicals in the water that can be oxidized. 
                A wider indicator of water quality than BOD.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Total Suspended Solids (TSS)</h3>
                {getStatusBadge(waterQualityParams.tssValue, 'tss')}
              </div>
              <div className="flex items-center mb-2">
                <LineChartIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-2xl font-bold">{waterQualityParams.tssValue}</span>
                <span className="ml-1 text-gray-500">mg/L</span>
              </div>
              <p className="text-sm text-gray-500">
                Measures particles suspended in water that won't pass through a filter.
                Affects water clarity and treatability.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Total Nitrogen (TN)</h3>
                {getStatusBadge(waterQualityParams.tnValue, 'tn')}
              </div>
              <div className="flex items-center mb-2">
                <LineChartIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-2xl font-bold">{waterQualityParams.tnValue}</span>
                <span className="ml-1 text-gray-500">mg/L</span>
              </div>
              <p className="text-sm text-gray-500">
                Sum of all nitrogen forms in water. High levels can cause algal blooms
                when discharged into natural waterways.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Total Phosphorus (TP)</h3>
                {getStatusBadge(waterQualityParams.tpValue, 'tp')}
              </div>
              <div className="flex items-center mb-2">
                <LineChartIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-2xl font-bold">{waterQualityParams.tpValue}</span>
                <span className="ml-1 text-gray-500">mg/L</span>
              </div>
              <p className="text-sm text-gray-500">
                Measures all forms of phosphorus in water. Along with nitrogen,
                contributes to eutrophication when in excess.
              </p>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Fecal Coliform</h3>
                {getStatusBadge(waterQualityParams.fecalValue, 'fecal')}
              </div>
              <div className="flex items-center mb-2">
                <LineChartIcon className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-2xl font-bold">{waterQualityParams.fecalValue}</span>
                <span className="ml-1 text-gray-500">CFU/100ml</span>
              </div>
              <p className="text-sm text-gray-500">
                Indicator of potential pathogens in water. Critical for determining
                if treated water is safe for designated reuse applications.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Compliance Distribution</CardTitle>
              <CardDescription>Parameter compliance with Oman Standard 115/2001</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <DonutChart
                  data={[
                    {
                      name: "Compliant",
                      value: Object.keys(parameterLimits).filter(param => 
                        waterQualityParams[`${param}Value` as keyof typeof waterQualityParams] <= 
                        parameterLimits[param as keyof typeof parameterLimits].target
                      ).length,
                      color: "#10b981"
                    },
                    {
                      name: "Warning",
                      value: Object.keys(parameterLimits).filter(param => {
                        const value = waterQualityParams[`${param}Value` as keyof typeof waterQualityParams]
                        const limits = parameterLimits[param as keyof typeof parameterLimits]
                        return value > limits.target && value <= limits.warning
                      }).length,
                      color: "#f59e0b"
                    },
                    {
                      name: "Violation",
                      value: Object.keys(parameterLimits).filter(param => 
                        waterQualityParams[`${param}Value` as keyof typeof waterQualityParams] > 
                        parameterLimits[param as keyof typeof parameterLimits].warning
                      ).length,
                      color: "#ef4444"
                    }
                  ]}
                  category="value"
                  index="name"
                  valueFormatter={(value) => `${value} parameters`}
                  showAnimation={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Parameter Evolution Over Time</CardTitle>
              <CardDescription>Monthly averages based on regulatory limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <BarChart
                  data={[
                    { month: "Jan", bod: 85, cod: 78, tss: 82 },
                    { month: "Feb", bod: 87, cod: 82, tss: 85 },
                    { month: "Mar", bod: 90, cod: 85, tss: 89 },
                    { month: "Apr", bod: 92, cod: 88, tss: 91 },
                    { month: "May", bod: 94, cod: 92, tss: 93 }
                  ]}
                  index="month"
                  categories={["bod", "cod", "tss"]}
                  colors={["blue", "emerald", "amber"]}
                  valueFormatter={(value) => `${value}%`}
                  yAxisWidth={48}
                  showLegend={true}
                />
              </div>
              <div className="mt-2 text-sm text-gray-500 text-center">
                Values shown as percentage of compliance with regulatory limits (higher is better)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TreatmentQualityMetrics
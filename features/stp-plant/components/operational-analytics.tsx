import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, BarChart, DonutChart, PieChart } from "@/components/ui/charts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  BarChart3Icon,
  Zap,
  FlaskConical,
  TreeDeciduous,
  ThermometerIcon,
  Droplets,
  GaugeIcon,
  Timer,
  Wind,
  CircleDollarSign,
  RefreshCw,
  AlertTriangle,
  Download,
  ArrowUpDown
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface OperationalData {
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

interface DailyData {
  day: string
  flowRate: number
  efficiency: number
  utilization: number
}

interface MonthlyData {
  month: string
  flowRate: number
  efficiency: number
  utilization: number
}

interface OperationalAnalyticsProps {
  operationalData: OperationalData
  dailyData: DailyData[]
  monthlyData: MonthlyData[]
}

export default function OperationalAnalytics({
  operationalData,
  dailyData,
  monthlyData
}: OperationalAnalyticsProps) {
  
  // Calculate key operational metrics
  const calculateOperationalMetrics = () => {
    // Generate synthetic data for energy efficiency
    const energyEfficiency = Math.round((operationalData.energyConsumption / dailyData.reduce((sum, day) => sum + day.flowRate, 0) / dailyData.length) * 100) / 100
    
    // Generate synthetic data for chemical dosing rate
    const chemicalDosingRate = Math.round((operationalData.chemicalUsage / dailyData.reduce((sum, day) => sum + day.flowRate, 0) / dailyData.length) * 1000) / 10
    
    // Generate synthetic data for biosolids yield
    const biosolidsYield = operationalData.biosolidsProduction / operationalData.sludgeProcessed
    
    // Average plant utilization
    const averageUtilization = Math.round(dailyData.reduce((sum, day) => sum + day.utilization, 0) / dailyData.length)
    
    // Average treatment efficiency
    const averageEfficiency = Math.round(dailyData.reduce((sum, day) => sum + day.efficiency, 0) / dailyData.length)
    
    return {
      energyEfficiency,
      chemicalDosingRate,
      biosolidsYield,
      averageUtilization,
      averageEfficiency
    }
  }
  
  const operationalMetrics = calculateOperationalMetrics()
  
  // Generate synthetic time series data for energy consumption
  const generateEnergyTimeSeriesData = () => {
    // Use daily data time points but generate synthetic energy data
    return dailyData.map((day, index) => {
      // Base the energy consumption partly on the flow rate and efficiency
      const flowFactor = day.flowRate / 500 // Normalized to typical flow
      const efficiencyFactor = day.efficiency / 100
      
      // Add some random variation
      const randomVariation = (Math.random() * 0.2) - 0.1 // -10% to +10%
      
      const energyConsumption = Math.round(3000 * flowFactor * (1 - (efficiencyFactor * 0.2)) * (1 + randomVariation))
      
      return {
        day: day.day,
        energy: energyConsumption,
        trend: index > 0 ? 3000 + (index * 20) - (index * index * 0.5) : 3000, // A curved trend line
      }
    })
  }
  
  const energyTimeSeriesData = generateEnergyTimeSeriesData()
  
  // Generate resource distribution data
  const resourceDistribution = [
    { name: "Aeration", value: Math.round(operationalData.energyConsumption * 0.65), color: "#3b82f6" },
    { name: "Pumping", value: Math.round(operationalData.energyConsumption * 0.20), color: "#10b981" },
    { name: "Mixing", value: Math.round(operationalData.energyConsumption * 0.08), color: "#f59e0b" },
    { name: "Other", value: Math.round(operationalData.energyConsumption * 0.07), color: "#8b5cf6" }
  ]
  
  // Generate cost distribution data
  const costDistribution = [
    { name: "Energy", value: operationalData.operatingCost * 0.4, color: "#3b82f6" },
    { name: "Chemicals", value: operationalData.operatingCost * 0.2, color: "#10b981" },
    { name: "Labor", value: operationalData.operatingCost * 0.25, color: "#f59e0b" },
    { name: "Maintenance", value: operationalData.operatingCost * 0.15, color: "#8b5cf6" }
  ]
  
  // Function to get status badge for operational parameters
  const getParameterStatus = (parameter: string, value: number) => {
    switch(parameter) {
      case "DO":
        if (value >= 2 && value <= 4) return "Optimal"
        if ((value > 4 && value <= 6) || (value >= 1.5 && value < 2)) return "Acceptable"
        return "Suboptimal"
      case "MLSS":
        if (value >= 2500 && value <= 3500) return "Optimal"
        if ((value > 3500 && value <= 4500) || (value >= 1500 && value < 2500)) return "Acceptable"
        return "Suboptimal"
      case "F/M":
        if (value >= 0.05 && value <= 0.15) return "Optimal"
        if ((value > 0.15 && value <= 0.3) || (value >= 0.03 && value < 0.05)) return "Acceptable"
        return "Suboptimal"
      case "SVI":
        if (value >= 80 && value <= 150) return "Optimal"
        if ((value > 150 && value <= 200) || (value >= 50 && value < 80)) return "Acceptable"
        return "Suboptimal"
      case "SRT":
        if (value >= 8 && value <= 20) return "Optimal"
        if ((value > 20 && value <= 30) || (value >= 5 && value < 8)) return "Acceptable"
        return "Suboptimal"
      default:
        return "Unknown"
    }
  }
  
  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Optimal":
        return <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          Optimal
        </Badge>
      case "Acceptable":
        return <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
          Acceptable
        </Badge>
      case "Suboptimal":
        return <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          Suboptimal
        </Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {/* Resource Consumption Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">ENERGY CONSUMPTION</p>
                <div className="flex items-baseline mt-1">
                  <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300">{operationalData.energyConsumption}</h3>
                  <span className="ml-1 text-sm text-blue-600 dark:text-blue-400">kWh/day</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-800">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {operationalMetrics.energyEfficiency.toFixed(2)} kWh/m³
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">CHEMICAL USAGE</p>
                <div className="flex items-baseline mt-1">
                  <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{operationalData.chemicalUsage}</h3>
                  <span className="ml-1 text-sm text-emerald-600 dark:text-emerald-400">kg/day</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-800">
                <FlaskConical className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-sm text-emerald-600 dark:text-emerald-400">
                  {operationalMetrics.chemicalDosingRate.toFixed(1)} g/m³
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">BIOSOLIDS PRODUCTION</p>
                <div className="flex items-baseline mt-1">
                  <h3 className="text-2xl font-bold text-amber-700 dark:text-amber-300">{operationalData.biosolidsProduction}</h3>
                  <span className="ml-1 text-sm text-amber-600 dark:text-amber-400">tons/day</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-800">
                <TreeDeciduous className="h-5 w-5 text-amber-600 dark:text-amber-300" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-sm text-amber-600 dark:text-amber-400">
                  {operationalMetrics.biosolidsYield.toFixed(2)} kg/kg BOD
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">OPERATING COST</p>
                <div className="flex items-baseline mt-1">
                  <h3 className="text-2xl font-bold text-red-700 dark:text-red-300">{operationalData.operatingCost}</h3>
                  <span className="ml-1 text-sm text-red-600 dark:text-red-400">$/day</span>
                </div>
              </div>
              <div className="p-2 rounded-full bg-red-100 dark:bg-red-800">
                <CircleDollarSign className="h-5 w-5 text-red-600 dark:text-red-300" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center">
                <span className="text-sm text-red-600 dark:text-red-400">
                  {(operationalData.operatingCost / (dailyData.reduce((sum, day) => sum + day.flowRate, 0) / dailyData.length)).toFixed(2)} $/m³
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Energy Consumption Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center">
                <BarChart3Icon className="h-5 w-5 mr-2 text-blue-600" />
                Energy Consumption Trends
              </CardTitle>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
            <CardDescription>
              Daily energy usage patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <LineChart 
                data={energyTimeSeriesData}
                index="day"
                categories={["energy", "trend"]}
                colors={["blue", "red"]}
                valueFormatter={(value) => `${value.toLocaleString()} kWh`}
                showLegend={true}
                yAxisWidth={60}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Zap className="h-5 w-5 mr-2 text-blue-600" />
              Energy Distribution
            </CardTitle>
            <CardDescription>
              Breakdown by process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              <PieChart 
                data={resourceDistribution}
                category="value"
                index="name"
                valueFormatter={(value) => `${value.toLocaleString()} kWh`}
                className="h-60"
              />
            </div>
            <div className="mt-4 space-y-3">
              {resourceDistribution.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span>{item.name}</span>
                  </div>
                  <div className="font-medium">
                    <span>{Math.round((item.value / operationalData.energyConsumption) * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Parameters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <GaugeIcon className="h-5 w-5 mr-2 text-blue-600" />
            Biological Process Parameters
          </CardTitle>
          <CardDescription>
            Current operational parameters and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Optimal Range</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Dissolved Oxygen (DO)</TableCell>
                  <TableCell>{operationalData.dissolvedOxygen.toFixed(1)}</TableCell>
                  <TableCell>mg/L</TableCell>
                  <TableCell>2.0 - 4.0 mg/L</TableCell>
                  <TableCell>
                    {getStatusBadge(getParameterStatus("DO", operationalData.dissolvedOxygen))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">MLSS Concentration</TableCell>
                  <TableCell>{operationalData.mlssConcentration}</TableCell>
                  <TableCell>mg/L</TableCell>
                  <TableCell>2,500 - 3,500 mg/L</TableCell>
                  <TableCell>
                    {getStatusBadge(getParameterStatus("MLSS", operationalData.mlssConcentration))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">F/M Ratio</TableCell>
                  <TableCell>{operationalData.fmRatio.toFixed(2)}</TableCell>
                  <TableCell>kg BOD/kg MLSS·d</TableCell>
                  <TableCell>0.05 - 0.15</TableCell>
                  <TableCell>
                    {getStatusBadge(getParameterStatus("F/M", operationalData.fmRatio))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sludge Volume Index (SVI)</TableCell>
                  <TableCell>{operationalData.svi}</TableCell>
                  <TableCell>mL/g</TableCell>
                  <TableCell>80 - 150 mL/g</TableCell>
                  <TableCell>
                    {getStatusBadge(getParameterStatus("SVI", operationalData.svi))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hydraulic Retention Time (HRT)</TableCell>
                  <TableCell>{operationalData.retentionTime.toFixed(1)}</TableCell>
                  <TableCell>hours</TableCell>
                  <TableCell>8 - 20 hours</TableCell>
                  <TableCell>
                    {getStatusBadge(getParameterStatus("SRT", operationalData.retentionTime))}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sludge Return Rate</TableCell>
                  <TableCell>{operationalData.sludgeReturnRate}</TableCell>
                  <TableCell>%</TableCell>
                  <TableCell>25 - 50%</TableCell>
                  <TableCell>
                    {getStatusBadge(operationalData.sludgeReturnRate >= 25 && operationalData.sludgeReturnRate <= 50 
                      ? "Optimal" 
                      : (operationalData.sludgeReturnRate >= 15 && operationalData.sludgeReturnRate < 25) || 
                        (operationalData.sludgeReturnRate > 50 && operationalData.sludgeReturnRate <= 70)
                      ? "Acceptable"
                      : "Suboptimal")}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Aeration Tank Temperature</TableCell>
                  <TableCell>{operationalData.temperature.toFixed(1)}</TableCell>
                  <TableCell>°C</TableCell>
                  <TableCell>15 - 30 °C</TableCell>
                  <TableCell>
                    {getStatusBadge(operationalData.temperature >= 15 && operationalData.temperature <= 30
                      ? "Optimal"
                      : (operationalData.temperature >= 10 && operationalData.temperature < 15) ||
                        (operationalData.temperature > 30 && operationalData.temperature <= 35)
                      ? "Acceptable"
                      : "Suboptimal")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis & Process Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <CircleDollarSign className="h-5 w-5 mr-2 text-blue-600" />
              Cost Analysis
            </CardTitle>
            <CardDescription>
              Operating cost breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <DonutChart 
                data={costDistribution}
                category="value"
                index="name"
                valueFormatter={(value) => `$${value.toLocaleString()}`}
                className="h-64"
              />
            </div>
            <div className="mt-4">
              <Separator className="my-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Cost Summary</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Daily Operating Cost:</span>
                      <span className="font-medium">${operationalData.operatingCost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Monthly Estimate:</span>
                      <span className="font-medium">${(operationalData.operatingCost * 30).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Cost per m³:</span>
                      <span className="font-medium">
                        ${(operationalData.operatingCost / (dailyData.reduce((sum, day) => sum + day.flowRate, 0) / dailyData.length)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Cost Optimization</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Current Usage:</span>
                      <span className="font-medium">100%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Potential Savings:</span>
                      <span className="font-medium text-emerald-600">12-18%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Optimized Cost:</span>
                      <span className="font-medium text-emerald-600">
                        ${Math.round(operationalData.operatingCost * 0.85)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-blue-600" />
              Process Optimization
            </CardTitle>
            <CardDescription>
              Recommendations for process improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-blue-600" />
                    Energy Optimization
                  </h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">High Priority</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Implement dissolved oxygen control strategy with variable frequency drives on blowers to maintain DO at 2.0-2.5 mg/L.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Potential savings:</span>
                  <span className="font-medium text-emerald-600">15-25% of aeration energy</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center">
                    <FlaskConical className="h-4 w-4 mr-2 text-emerald-600" />
                    Chemical Optimization
                  </h3>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Medium Priority</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Implement flow-paced chemical dosing with feedback control based on effluent quality parameters.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Potential savings:</span>
                  <span className="font-medium text-emerald-600">10-15% of chemical usage</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center">
                    <ArrowUpDown className="h-4 w-4 mr-2 text-amber-600" />
                    Sludge Management
                  </h3>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">Medium Priority</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Optimize sludge wasting rates to maintain SVI below 120 ml/g and MLSS concentration at 3,000-3,200 mg/L.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Expected benefits:</span>
                  <span className="font-medium text-emerald-600">Improved settling, reduced biosolids</span>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-600" />
                    Performance Monitoring
                  </h3>
                  <Badge variant="outline" className="bg-red-50 text-red-700">Critical</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Implement continuous monitoring for key process parameters with automated alerts for deviations from optimal ranges.
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Expected benefits:</span>
                  <span className="font-medium text-emerald-600">Enhanced stability, reduced compliance risks</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { LineChart, BarChart, DonutChart } from "@/components/ui/charts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Flask, 
  Beaker, 
  FileBarChart, 
  Microscope, 
  Drop,
  Droplets,
  Waves,
  ThermometerIcon,
  ScrollText,
  FileChart,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Download
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface WaterQualityParams {
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

interface TreatmentQualityMetricsProps {
  waterQualityParams: WaterQualityParams
  dailyData: DailyData[]
  monthlyData: MonthlyData[]
}

export default function TreatmentQualityMetrics({
  waterQualityParams,
  dailyData,
  monthlyData
}: TreatmentQualityMetricsProps) {
  // Generate water quality indicators based on standard ranges
  const getWaterQualityIndicator = (parameter: string, value: number) => {
    switch(parameter) {
      case "pH":
        if (value >= 6.5 && value <= 8.5) return "Excellent"
        if ((value >= 6.0 && value < 6.5) || (value > 8.5 && value <= 9.0)) return "Good"
        return "Poor"
      case "COD":
        if (value <= 50) return "Excellent"
        if (value <= 100) return "Good"
        return "Poor"
      case "BOD":
        if (value <= 10) return "Excellent"
        if (value <= 20) return "Good"
        return "Poor"
      case "TSS":
        if (value <= 15) return "Excellent"
        if (value <= 30) return "Good"
        return "Poor"
      case "TN":
        if (value <= 5) return "Excellent"
        if (value <= 15) return "Good"
        return "Poor"
      case "TP":
        if (value <= 1) return "Excellent"
        if (value <= 2) return "Good"
        return "Poor"
      case "FC":
        if (value <= 200) return "Excellent"
        if (value <= 1000) return "Good"
        return "Poor"
      case "Turbidity":
        if (value <= 2) return "Excellent"
        if (value <= 5) return "Good"
        return "Poor"
      case "DO":
        if (value >= 5) return "Excellent"
        if (value >= 4) return "Good"
        return "Poor"
      default:
        return "Unknown"
    }
  }
  
  // Function to get status badge color
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Excellent":
        return <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3 mr-1" /> 
          Excellent
        </Badge>
      case "Good":
        return <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
          <CheckCircle2 className="h-3 w-3 mr-1" /> 
          Good
        </Badge>
      case "Poor":
        return <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          <AlertTriangle className="h-3 w-3 mr-1" /> 
          Poor
        </Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  // Generate quality distribution data
  const qualityDistribution = [
    { name: "Excellent", value: 5, color: "#10b981" },
    { name: "Good", value: 3, color: "#3b82f6" },
    { name: "Poor", value: 1, color: "#f59e0b" }
  ]

  // Generate time series water quality simulation data
  const generateTimeSeriesData = () => {
    // Use daily data time points but generate synthetic quality data
    return dailyData.map((day, index) => {
      // Base the quality parameters partly on the efficiency
      const efficiencyFactor = day.efficiency / 100
      
      // Add some random variation
      const randomVariation = (Math.random() * 0.2) - 0.1 // -10% to +10%
      
      return {
        day: day.day,
        bod: Math.max(5, waterQualityParams.bodValue * (1 - (efficiencyFactor * 0.8)) * (1 + randomVariation)),
        cod: Math.max(20, waterQualityParams.codValue * (1 - (efficiencyFactor * 0.7)) * (1 + randomVariation)),
        tss: Math.max(5, waterQualityParams.tssValue * (1 - (efficiencyFactor * 0.75)) * (1 + randomVariation))
      }
    })
  }
  
  const timeSeriesData = generateTimeSeriesData()

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Water Quality Summary Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium flex items-center">
                <Beaker className="h-5 w-5 mr-2 text-blue-600" />
                Water Quality Parameters
              </CardTitle>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
            <CardDescription>
              Key water quality indicators for treated sewage effluent
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
                    <TableHead>Regulatory Limit</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">pH</TableCell>
                    <TableCell>{waterQualityParams.phValue.toFixed(1)}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>6.0 - 9.0</TableCell>
                    <TableCell>
                      {getStatusBadge(getWaterQualityIndicator("pH", waterQualityParams.phValue))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">BOD₅</TableCell>
                    <TableCell>{waterQualityParams.bodValue}</TableCell>
                    <TableCell>mg/L</TableCell>
                    <TableCell>≤ 20 mg/L</TableCell>
                    <TableCell>
                      {getStatusBadge(getWaterQualityIndicator("BOD", waterQualityParams.bodValue))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">COD</TableCell>
                    <TableCell>{waterQualityParams.codValue}</TableCell>
                    <TableCell>mg/L</TableCell>
                    <TableCell>≤ 100 mg/L</TableCell>
                    <TableCell>
                      {getStatusBadge(getWaterQualityIndicator("COD", waterQualityParams.codValue))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">TSS</TableCell>
                    <TableCell>{waterQualityParams.tssValue}</TableCell>
                    <TableCell>mg/L</TableCell>
                    <TableCell>≤ 30 mg/L</TableCell>
                    <TableCell>
                      {getStatusBadge(getWaterQualityIndicator("TSS", waterQualityParams.tssValue))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Nitrogen</TableCell>
                    <TableCell>{waterQualityParams.tnValue}</TableCell>
                    <TableCell>mg/L</TableCell>
                    <TableCell>≤ 15 mg/L</TableCell>
                    <TableCell>
                      {getStatusBadge(getWaterQualityIndicator("TN", waterQualityParams.tnValue))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Phosphorus</TableCell>
                    <TableCell>{waterQualityParams.tpValue}</TableCell>
                    <TableCell>mg/L</TableCell>
                    <TableCell>≤ 2 mg/L</TableCell>
                    <TableCell>
                      {getStatusBadge(getWaterQualityIndicator("TP", waterQualityParams.tpValue))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fecal Coliform</TableCell>
                    <TableCell>{waterQualityParams.fecalValue}</TableCell>
                    <TableCell>CFU/100ml</TableCell>
                    <TableCell>≤ 1000 CFU/100ml</TableCell>
                    <TableCell>
                      {getStatusBadge(getWaterQualityIndicator("FC", waterQualityParams.fecalValue))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Turbidity</TableCell>
                    <TableCell>{waterQualityParams.turbidity.toFixed(1)}</TableCell>
                    <TableCell>NTU</TableCell>
                    <TableCell>≤ 5 NTU</TableCell>
                    <TableCell>
                      {getStatusBadge(getWaterQualityIndicator("Turbidity", waterQualityParams.turbidity))}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Dissolved Oxygen</TableCell>
                    <TableCell>{waterQualityParams.dissolvedOxygen.toFixed(1)}</TableCell>
                    <TableCell>mg/L</TableCell>
                    <TableCell>≥ 4 mg/L</TableCell>
                    <TableCell>
                      {getStatusBadge(getWaterQualityIndicator("DO", waterQualityParams.dissolvedOxygen))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quality Distribution Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-600" />
              Quality Distribution
            </CardTitle>
            <CardDescription>
              Parameter quality status breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <DonutChart 
                data={qualityDistribution}
                category="value"
                index="name"
                valueFormatter={(value) => `${value} parameters`}
                className="h-64"
              />
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                  <span>Excellent</span>
                </div>
                <span className="font-medium">{qualityDistribution[0].value} parameters</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span>Good</span>
                </div>
                <span className="font-medium">{qualityDistribution[1].value} parameters</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span>Poor</span>
                </div>
                <span className="font-medium">{qualityDistribution[2].value} parameters</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Quality Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <FileChart className="h-5 w-5 mr-2 text-blue-600" />
            Water Quality Trends
          </CardTitle>
          <CardDescription>
            Daily key parameter variations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <LineChart 
              data={timeSeriesData}
              index="day"
              categories={["bod", "cod", "tss"]}
              colors={["emerald", "blue", "amber"]}
              valueFormatter={(value) => `${value.toFixed(1)} mg/L`}
              yAxisWidth={60}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
              <span>BOD₅ (mg/L)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>COD (mg/L)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span>TSS (mg/L)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Process Impact on Quality */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Flask className="h-5 w-5 mr-2 text-blue-600" />
              Treatment Process Impact
            </CardTitle>
            <CardDescription>
              Quality improvement at each treatment stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Primary Treatment</span>
                  <span className="text-sm text-gray-500">30-40% BOD removal</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Secondary Treatment</span>
                  <span className="text-sm text-gray-500">85-95% BOD removal</span>
                </div>
                <Progress value={90} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Tertiary Treatment</span>
                  <span className="text-sm text-gray-500">95-99% BOD removal</span>
                </div>
                <Progress value={97} className="h-2" />
              </div>
              
              <Separator className="my-4" />
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Influent Characteristics</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">BOD₅:</div>
                    <div>250-350 mg/L</div>
                    <div className="text-gray-500">COD:</div>
                    <div>400-600 mg/L</div>
                    <div className="text-gray-500">TSS:</div>
                    <div>200-400 mg/L</div>
                    <div className="text-gray-500">TN:</div>
                    <div>40-60 mg/L</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Effluent Quality</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-500">BOD₅:</div>
                    <div>{waterQualityParams.bodValue} mg/L</div>
                    <div className="text-gray-500">COD:</div>
                    <div>{waterQualityParams.codValue} mg/L</div>
                    <div className="text-gray-500">TSS:</div>
                    <div>{waterQualityParams.tssValue} mg/L</div>
                    <div className="text-gray-500">TN:</div>
                    <div>{waterQualityParams.tnValue} mg/L</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Microscope className="h-5 w-5 mr-2 text-blue-600" />
              Microbiological Analysis
            </CardTitle>
            <CardDescription>
              Pathogen removal efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart
                data={[
                  { 
                    pathogen: "Fecal Coliform", 
                    influent: 1000000, 
                    effluent: waterQualityParams.fecalValue
                  },
                  { 
                    pathogen: "E. coli", 
                    influent: 500000, 
                    effluent: waterQualityParams.fecalValue * 0.8
                  },
                  { 
                    pathogen: "Enterococci", 
                    influent: 100000, 
                    effluent: waterQualityParams.fecalValue * 0.3
                  }
                ]}
                index="pathogen"
                categories={["influent", "effluent"]}
                colors={["amber", "emerald"]}
                valueFormatter={(value) => 
                  value >= 1000000 
                    ? `${(value / 1000000).toFixed(1)}M CFU/100ml` 
                    : value >= 1000 
                    ? `${(value / 1000).toFixed(1)}K CFU/100ml` 
                    : `${value.toFixed(0)} CFU/100ml`
                }
                yAxisWidth={80}
                layout="vertical"
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Log Reduction Values</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {(Math.log10(1000000 / waterQualityParams.fecalValue)).toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Fecal Coliform Reduction</p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {(Math.log10(500000 / (waterQualityParams.fecalValue * 0.8))).toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">E. coli Reduction</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {(Math.log10(100000 / (waterQualityParams.fecalValue * 0.3))).toFixed(1)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enterococci Reduction</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
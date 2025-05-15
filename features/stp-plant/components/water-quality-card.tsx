"use client"

import { PieChart as PieChartIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WaterQualityCardProps {
  title: string
  phValue: number
  codValue: number
  bodValue: number
  tssValue: number
  month: string
}

export default function WaterQualityCard({
  title,
  phValue,
  codValue,
  bodValue,
  tssValue,
  month
}: WaterQualityCardProps) {
  // Parameters and limits
  const parameters = [
    { 
      name: "pH", 
      value: phValue, 
      min: 6, 
      max: 9, 
      unit: "", 
      description: "Measure of acidity or alkalinity"
    },
    { 
      name: "COD", 
      value: codValue, 
      min: 0, 
      max: 250, 
      unit: "mg/L", 
      description: "Chemical Oxygen Demand"
    },
    { 
      name: "BOD", 
      value: bodValue, 
      min: 0, 
      max: 30, 
      unit: "mg/L", 
      description: "Biological Oxygen Demand"
    },
    { 
      name: "TSS", 
      value: tssValue, 
      min: 0, 
      max: 45, 
      unit: "mg/L", 
      description: "Total Suspended Solids"
    }
  ]

  // Calculate parameter status
  const getStatus = (param: typeof parameters[0]) => {
    if (param.name === "pH") {
      if (param.value >= param.min && param.value <= param.max) {
        return "optimal"
      } else {
        return "critical"
      }
    } else {
      if (param.value <= param.max * 0.5) {
        return "optimal"
      } else if (param.value <= param.max) {
        return "warning"
      } else {
        return "critical"
      }
    }
  }

  // Get color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
      case "warning":
        return "text-amber-500 bg-amber-50 dark:bg-amber-900/20"
      case "critical":
        return "text-red-500 bg-red-50 dark:bg-red-900/20"
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20"
    }
  }

  // Get percentage for progress bar
  const getPercentage = (param: typeof parameters[0]) => {
    if (param.name === "pH") {
      // pH scale is typically 0-14, but we're focusing on 6-9 range
      const position = (param.value - param.min) / (param.max - param.min)
      return Math.max(0, Math.min(100, position * 100))
    } else {
      // For other parameters, percentage of max limit
      return Math.min(100, (param.value / param.max) * 100)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="p-2 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
            <PieChartIcon className="h-5 w-5" />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Water Quality Parameters for {month}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="parameters" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="limits">Regulatory Limits</TabsTrigger>
          </TabsList>
          <TabsContent value="parameters" className="mt-4 space-y-4">
            {parameters.map((param) => {
              const status = getStatus(param)
              const statusColor = getStatusColor(status)
              const percentage = getPercentage(param)
              
              return (
                <div key={param.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="font-medium">{param.name}</span>
                      <span className="text-gray-500 text-sm ml-2">{param.description}</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                      {param.value} {param.unit}
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className={`h-2.5 rounded-full ${
                        status === "optimal" 
                          ? "bg-emerald-500" 
                          : status === "warning" 
                          ? "bg-amber-500" 
                          : "bg-red-500"
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </TabsContent>
          <TabsContent value="limits" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-6 py-3">Parameter</th>
                    <th scope="col" className="px-6 py-3">Unit</th>
                    <th scope="col" className="px-6 py-3">Current</th>
                    <th scope="col" className="px-6 py-3">Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {parameters.map((param) => (
                    <tr key={param.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4 font-medium">{param.name}</td>
                      <td className="px-6 py-4">{param.unit || "NA"}</td>
                      <td className="px-6 py-4">{param.value}</td>
                      <td className="px-6 py-4">
                        {param.name === "pH" 
                          ? `${param.min} - ${param.max}` 
                          : `≤ ${param.max}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"

// Mock data for STP plant
const mockKPIData = {
  totalInflow: 12500,
  totalOutflow: 11200,
  efficiency: 89.6,
  utilization: 76.3,
  qualityIndex: 4.2,
  inflowChange: 5.2,
  outflowChange: 4.8,
  efficiencyChange: 1.5,
  utilizationChange: -2.1,
  qualityChange: 0.3,
}

// Mock data for Sankey diagram
const mockSankeyData = {
  nodes: [{ name: "Inlet" }, { name: "Treatment" }, { name: "Irrigation" }, { name: "Losses" }],
  links: [
    { source: 0, target: 1, value: 10000 },
    { source: 1, target: 2, value: 8500 },
    { source: 1, target: 3, value: 1500 },
  ],
}

// Mock data for daily efficiency
const generateDailyData = (month: string, days = 30) => {
  const result = []
  for (let i = 1; i <= days; i++) {
    const efficiency = 75 + Math.random() * 20
    const utilization = 65 + Math.random() * 25
    result.push({
      id: i,
      day: i,
      date: `${month} ${i}`,
      influentFlow: 400 + Math.random() * 100,
      effluentFlow: 350 + Math.random() * 80,
      efficiency,
      utilization,
      energyUsage: 200 + Math.random() * 50,
      chemicalUsage: 50 + Math.random() * 20,
    })
  }
  return result
}

// Mock data for monthly trends
const generateMonthlyData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((month) => {
    const efficiency = 75 + Math.random() * 20
    const utilization = 65 + Math.random() * 25
    return {
      month,
      efficiency,
      utilization,
      totalInflow: 10000 + Math.random() * 5000,
      totalOutflow: 9000 + Math.random() * 4000,
    }
  })
}

export function useSTPData(selectedMonth: string) {
  const [isLoading, setIsLoading] = useState(true)
  const [kpiData, setKPIData] = useState(mockKPIData)
  const [sankeyData, setSankeyData] = useState(mockSankeyData)
  const [dailyData, setDailyData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [rawData, setRawData] = useState<any[]>([])
  const [previousMonthRawData, setPreviousMonthRawData] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)

    setTimeout(() => {
      // Generate data based on selected month
      const days = selectedMonth === "February" ? 28 : 30
      const dailyData = generateDailyData(selectedMonth, days)
      const monthlyData = generateMonthlyData()

      setDailyData(dailyData)
      setMonthlyData(monthlyData)
      setRawData(dailyData)
      setPreviousMonthRawData(generateDailyData("Previous Month", days))

      // Update KPI data with some variation based on month
      const monthIndex = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ].indexOf(selectedMonth)
      const factor = 1 + (monthIndex / 12) * 0.2

      setKPIData({
        ...mockKPIData,
        totalInflow: Math.round(mockKPIData.totalInflow * factor),
        totalOutflow: Math.round(mockKPIData.totalOutflow * factor),
        efficiency: Number.parseFloat((mockKPIData.efficiency * (1 + (Math.random() * 0.1 - 0.05))).toFixed(1)),
        utilization: Number.parseFloat((mockKPIData.utilization * (1 + (Math.random() * 0.1 - 0.05))).toFixed(1)),
      })

      // Update Sankey data
      setSankeyData({
        nodes: mockSankeyData.nodes,
        links: [
          { source: 0, target: 1, value: Math.round(10000 * factor) },
          { source: 1, target: 2, value: Math.round(8500 * factor) },
          { source: 1, target: 3, value: Math.round(1500 * factor) },
        ],
      })

      setIsLoading(false)
    }, 500)
  }, [selectedMonth])

  return {
    isLoading,
    kpiData,
    sankeyData,
    dailyData,
    monthlyData,
    rawData,
    previousMonthRawData,
  }
}

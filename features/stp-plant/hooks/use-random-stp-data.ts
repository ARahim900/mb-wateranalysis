"use client"

import { useState, useEffect } from "react"

// Generate random data for STP Plant dashboard
export const useRandomSTPData = (selectedMonth: string) => {
  const [isLoading, setIsLoading] = useState(true)
  const [kpiData, setKpiData] = useState({
    totalInflow: 0,
    totalOutflow: 0,
    efficiency: 0,
    utilization: 0,
    qualityIndex: 0,
    inflowChange: 0,
    outflowChange: 0,
    efficiencyChange: 0,
    utilizationChange: 0,
    qualityChange: 0,
  })
  const [sankeyData, setSankeyData] = useState({
    nodes: [{ name: "Loading..." }],
    links: [],
  })
  const [dailyData, setDailyData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [rawData, setRawData] = useState([])
  const [previousMonthRawData, setPreviousMonthRawData] = useState([])

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true)

    setTimeout(() => {
      // Generate random data for month
      const daysInMonth = 30
      const totalInflow = Math.round(15000 + Math.random() * 5000)
      const totalOutflow = Math.round(totalInflow * (0.85 + Math.random() * 0.1))
      const efficiency = Number(((totalOutflow / totalInflow) * 100).toFixed(1))
      const utilization = Number(((totalInflow / (750 * daysInMonth)) * 100).toFixed(1))
      const qualityIndex = Number((7 + Math.random() * 2.5).toFixed(1))
      
      // Generate random changes (between -10% and +15%)
      const randomChange = () => Number((Math.random() * 25 - 10).toFixed(1))
      
      // Set KPI data
      setKpiData({
        totalInflow,
        totalOutflow,
        efficiency,
        utilization,
        qualityIndex,
        inflowChange: randomChange(),
        outflowChange: randomChange(),
        efficiencyChange: randomChange(),
        utilizationChange: randomChange(),
        qualityChange: randomChange(),
      })

      // Create Sankey data
      setSankeyData({
        nodes: [
          { name: "Inflow" },
          { name: "Tanker Discharge" },
          { name: "Direct Sewage" },
          { name: "Primary Treatment" },
          { name: "Secondary Treatment" },
          { name: "Tertiary Treatment" },
          { name: "TSE Output" },
          { name: "Losses" },
        ],
        links: [
          { source: 0, target: 3, value: totalInflow },
          { source: 1, target: 0, value: Math.round(totalInflow * 0.4) },
          { source: 2, target: 0, value: Math.round(totalInflow * 0.6) },
          { source: 3, target: 4, value: Math.round(totalInflow * 0.95) },
          { source: 3, target: 7, value: Math.round(totalInflow * 0.05) },
          { source: 4, target: 5, value: Math.round(totalInflow * 0.9) },
          { source: 4, target: 7, value: Math.round(totalInflow * 0.05) },
          { source: 5, target: 6, value: totalOutflow },
          { source: 5, target: 7, value: Math.round(totalInflow * 0.05) },
        ],
      })

      // Generate daily data
      const generateDailyData = () => {
        const result = []
        for (let i = 1; i <= daysInMonth; i++) {
          const dailyEfficiency = 80 + Math.random() * 15
          const dailyFlow = Math.round(400 + Math.random() * 300)
          const dailyQuality = 7 + Math.random() * 3
          
          result.push({
            day: i.toString(),
            efficiency: dailyEfficiency,
            flowRate: dailyFlow,
            qualityIndex: dailyQuality,
          })
        }
        return result
      }
      
      setDailyData(generateDailyData())

      // Generate monthly data
      const generateMonthlyData = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return months.map(month => ({
          month,
          efficiency: 75 + Math.random() * 20,
          target: 85,
          flowRate: 400 + Math.random() * 300,
        }))
      }
      
      setMonthlyData(generateMonthlyData())

      // Generate raw data
      const generateRawData = () => {
        const result = []
        for (let i = 1; i <= daysInMonth; i++) {
          const influentFlow = Math.round(400 + Math.random() * 300)
          const effluentFlow = Math.round(influentFlow * (0.85 + Math.random() * 0.1))
          const efficiency = Number(((effluentFlow / influentFlow) * 100).toFixed(1))
          
          result.push({
            id: i,
            date: `${i}/${selectedMonth.split("-")[1]}/${selectedMonth.split("-")[0]}`,
            influentFlow,
            effluentFlow,
            efficiency,
            energyUsage: Math.round(200 + Math.random() * 50),
            chemicalUsage: Math.round(50 + Math.random() * 20),
          })
        }
        return result
      }
      
      setRawData(generateRawData())
      setPreviousMonthRawData(generateRawData())

      setIsLoading(false)
    }, 1000)
  }, [selectedMonth])

  return {
    kpiData,
    sankeyData,
    dailyData,
    monthlyData,
    rawData,
    previousMonthRawData,
    isLoading,
  }
}

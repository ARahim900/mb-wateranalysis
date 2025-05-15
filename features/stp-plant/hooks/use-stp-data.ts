"use client"

import { useState, useEffect } from "react"
import { rawStpData } from "../data/stp-data"
import { parseData } from "../utils/data-parser"

export const useSTPData = (selectedMonth: string) => {
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
      const parsedData = parseData(rawStpData, selectedMonth)

      setKpiData(parsedData.kpiData)
      setSankeyData(parsedData.sankeyData)
      setDailyData(parsedData.dailyData)
      setMonthlyData(parsedData.monthlyData)
      setRawData(parsedData.rawData)
      setPreviousMonthRawData(parsedData.previousMonthRawData)

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

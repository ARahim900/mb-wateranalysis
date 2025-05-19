"use client"

import { useState, useEffect } from "react"
import { fetchCSVData } from "@/lib/csv-utils"

export interface STPData {
  date: string
  tankerTrips: number
  expectedTankerVolume: number
  directInlineSewage: number
  totalInletSewage: number
  totalTreatedWater: number
  totalTSEWater: number
  rawSewageInletFlow: string
  aerationDO: string
  rawSewagePH: string
  efficiency: number
  month: string
  day: number
}

// Helper function to ensure values are numbers
export function ensureNumber(value: any): number {
  if (value === undefined || value === null || value === "") return 0
  const parsed = Number.parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

export function useStpData() {
  const [data, setData] = useState<STPData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>("March") // Set a default month
  const [availableMonths, setAvailableMonths] = useState<string[]>(["March"]) // Initialize with a default

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const csvUrl =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2024%20-%20STP%20Master%20Database%20Daily%20Operation%20%26%20Maintenance-Master%20Data%20copy-6iqW6R9YR6DmVeVLM4rh9HpFdJxXJg.csv"
        const rawData = await fetchCSVData(csvUrl)

        if (rawData.length === 0) {
          throw new Error("No data available")
        }

        // Process the data
        const processedData: STPData[] = rawData
          .filter((item) => item["Date"] && item["Date"].trim() !== "")
          .map((item) => {
            // Parse date
            const dateParts = item["Date"]?.split("/") || []
            let day = 1
            let month = "March" // Default to March if parsing fails
            let monthNumber = 1

            if (dateParts.length === 3) {
              day = Number.parseInt(dateParts[0]) || 1
              monthNumber = Number.parseInt(dateParts[1]) || 1

              // Convert month number to name
              const monthNames = [
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
              ]
              month = monthNames[monthNumber - 1] || "March"
            }

            // Parse numeric values
            const tankerTrips = ensureNumber(item["Number of Tankers Trips:"])
            const expectedTankerVolume = ensureNumber(item["Expected Tanker Volume (m³) (20 m3)"])
            const directInlineSewage = ensureNumber(item["Direct In line Sewage (MB)"])
            const totalInletSewage = ensureNumber(item["Total Inlet Sewage Received from (MB+Tnk) -m³"])
            const totalTreatedWater = ensureNumber(item["Total Treated Water Produced - m³"])
            const totalTSEWater = ensureNumber(item["Total TSE Water Production"])

            // Calculate efficiency
            let efficiency = 0
            if (totalInletSewage > 0 && totalTreatedWater > 0) {
              efficiency = (totalTreatedWater / totalInletSewage) * 100
              // Cap efficiency at 100%
              efficiency = Math.min(efficiency, 100)
            }

            return {
              date: item["Date"] || "",
              tankerTrips,
              expectedTankerVolume,
              directInlineSewage,
              totalInletSewage,
              totalTreatedWater,
              totalTSEWater,
              rawSewageInletFlow: item["Raw Sewage Inlet Flow (31.25 m3/hr)"] || "",
              aerationDO: item["Aeration DO (2 -3 ppm)"] || "",
              rawSewagePH: item["Raw Sewage pH (6.5 - 8.0)"] || "",
              efficiency,
              month,
              day,
            }
          })

        // Get available months and set default if needed
        const months = [...new Set(processedData.map((item) => item.month))].filter(Boolean)
        setAvailableMonths(months.length > 0 ? months : ["March"])

        // Set the default selected month to the most recent month in the data
        if (processedData.length > 0 && selectedMonth === "March" && !months.includes("March")) {
          setSelectedMonth(months[months.length - 1] || "March")
        }

        setData(processedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        console.error("Error loading STP data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedMonth])

  // Filter data by selected month
  const filteredData = selectedMonth ? data.filter((item) => item.month === selectedMonth) : data

  // Calculate summary statistics
  const calculateSummary = () => {
    if (filteredData.length === 0) {
      // Return default values if no data
      return {
        totalInletSewage: 0,
        totalTreatedWater: 0,
        totalTSEWater: 0,
        avgEfficiency: 0,
        totalTankerTrips: 0,
        daysReported: 0,
      }
    }

    const totalInletSewage = filteredData.reduce((sum, item) => sum + item.totalInletSewage, 0)
    const totalTreatedWater = filteredData.reduce((sum, item) => sum + item.totalTreatedWater, 0)
    const totalTSEWater = filteredData.reduce((sum, item) => sum + item.totalTSEWater, 0)
    const avgEfficiency = filteredData.reduce((sum, item) => sum + item.efficiency, 0) / filteredData.length
    const totalTankerTrips = filteredData.reduce((sum, item) => sum + item.tankerTrips, 0)

    return {
      totalInletSewage,
      totalTreatedWater,
      totalTSEWater,
      avgEfficiency,
      totalTankerTrips,
      daysReported: filteredData.length,
    }
  }

  const summary = calculateSummary()

  return {
    data: filteredData,
    allData: data,
    isLoading,
    error,
    selectedMonth,
    setSelectedMonth,
    availableMonths,
    summary,
  }
}

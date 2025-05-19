"use client"

import { useState, useEffect } from "react"
import { fetchCSVData } from "@/lib/csv-utils"

export interface ContractorData {
  id: number
  contractName: string
  contractor: string
  startDate: string
  endDate: string
  value: number
  status: string
  department: string
  notes: string
  daysRemaining: number
}

export function useContractorData() {
  const [data, setData] = useState<ContractorData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const csvUrl =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Muscat%20Bay%20Contract%20Tracker%20-%20Contract%20Tracker-15DPbUX6pgoe67UQ9Szd9xQQn5VNOT.csv"
        const rawData = await fetchCSVData(csvUrl)

        if (rawData.length === 0) {
          throw new Error("No data available")
        }

        // Process the data
        const processedData: ContractorData[] = rawData.map((item, index) => {
          // Extract all fields from the CSV
          const contractName = item["Contract Name"] || ""
          const contractor = item["Contractor"] || ""
          const startDate = item["Start Date"] || ""
          const endDate = item["End Date"] || ""
          const valueStr = item["Contract Value (OMR)"] || "0"
          const value = Number.parseFloat(valueStr.replace(/[^\d.-]/g, "")) || 0
          const status = item["Status"] || "Unknown"
          const department = item["Department"] || "Unknown"
          const notes = item["Notes"] || ""

          // Calculate days remaining
          let daysRemaining = 0
          if (endDate) {
            const endDateParts = endDate.split("/")
            if (endDateParts.length === 3) {
              const endDateObj = new Date(
                Number.parseInt(endDateParts[2]),
                Number.parseInt(endDateParts[1]) - 1,
                Number.parseInt(endDateParts[0]),
              )
              const today = new Date()
              const diffTime = endDateObj.getTime() - today.getTime()
              daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            }
          }

          return {
            id: index + 1,
            contractName,
            contractor,
            startDate,
            endDate,
            value,
            status,
            department,
            notes,
            daysRemaining,
          }
        })

        setData(processedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred")
        console.error("Error loading contractor data:", err)
        // Set empty data array to prevent undefined errors
        setData([])
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return { data, isLoading, error }
}

"use client"

import { useState, useEffect } from "react"

export function useDashboardData<T>(endpoint: string, initialData: T, transformFn?: (data: any) => T) {
  const [data, setData] = useState<T>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be a fetch to an API endpoint
        // For now, we'll simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data based on endpoint
        let mockData
        if (endpoint.includes("electricity")) {
          mockData = getMockElectricityData()
        } else if (endpoint.includes("stp")) {
          mockData = getMockSTPData()
        } else if (endpoint.includes("contractors")) {
          mockData = getMockContractorData()
        } else {
          mockData = {}
        }

        setData(transformFn ? transformFn(mockData) : mockData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [endpoint, transformFn])

  return { data, isLoading, error }
}

// Mock data functions
function getMockElectricityData() {
  return {
    summary: {
      totalConsumption: 1245,
      peakDemand: 78,
      monthlyCost: 3450,
      efficiencyScore: 87,
      consumptionChange: -1.8,
      costChange: -0.5,
      efficiencyChange: 1.2,
    },
    breakdown: [
      { name: "Common Areas", value: 420, percentage: 33.7 },
      { name: "Residential", value: 380, percentage: 30.5 },
      { name: "Commercial", value: 245, percentage: 19.7 },
      { name: "Facilities", value: 200, percentage: 16.1 },
    ],
    trend: [
      { month: "Jan", consumption: 1320, cost: 3600 },
      { month: "Feb", consumption: 1280, cost: 3520 },
      { month: "Mar", consumption: 1350, cost: 3700 },
      { month: "Apr", consumption: 1290, cost: 3550 },
      { month: "May", consumption: 1245, cost: 3450 },
    ],
    peakHours: [
      { hour: "00:00", demand: 45 },
      { hour: "04:00", demand: 32 },
      { hour: "08:00", demand: 56 },
      { hour: "12:00", demand: 72 },
      { hour: "16:00", demand: 78 },
      { hour: "20:00", demand: 65 },
    ],
  }
}

function getMockSTPData() {
  return {
    summary: {
      currentFlow: 32.5,
      efficiency: 94.2,
      status: "Operational",
      capacityUtilization: 65,
      flowChange: 1.2,
      efficiencyChange: 0.5,
    },
    parameters: {
      pH: 7.2,
      bod: 12,
      cod: 45,
      tss: 18,
      tn: 8.5,
      tp: 1.2,
    },
    flowTrend: [
      { time: "00:00", flow: 28 },
      { time: "04:00", flow: 24 },
      { time: "08:00", flow: 30 },
      { time: "12:00", flow: 35 },
      { time: "16:00", flow: 33 },
      { time: "20:00", flow: 29 },
    ],
    alerts: [
      { id: 1, type: "warning", message: "High TSS levels detected", timestamp: "2025-05-14T14:32:00Z" },
      { id: 2, type: "info", message: "Scheduled maintenance completed", timestamp: "2025-05-13T09:15:00Z" },
      { id: 3, type: "success", message: "System efficiency optimized", timestamp: "2025-05-12T16:45:00Z" },
    ],
  }
}

function getMockContractorData() {
  return {
    summary: {
      activeContractors: 8,
      ongoingProjects: 12,
      completedThisMonth: 3,
      pendingApprovals: 5,
      completionChange: 50,
    },
    projectStatusBreakdown: [
      { name: "On Schedule", value: 7, percentage: 58.3 },
      { name: "Delayed", value: 3, percentage: 25 },
      { name: "At Risk", value: 2, percentage: 16.7 },
    ],
    contractors: [
      { id: 1, name: "Alpha Construction", activeProjects: 3, rating: 4.8, status: "active" },
      { id: 2, name: "Beta Maintenance", activeProjects: 2, rating: 4.5, status: "active" },
      { id: 3, name: "Gamma Engineering", activeProjects: 1, rating: 4.2, status: "active" },
      { id: 4, name: "Delta Services", activeProjects: 2, rating: 4.7, status: "active" },
      { id: 5, name: "Epsilon Landscaping", activeProjects: 1, rating: 4.4, status: "active" },
    ],
    recentActivities: [
      {
        id: 1,
        date: "2025-05-14",
        contractor: "Alpha Construction",
        description: "Completed phase 1 of building maintenance",
        status: "Completed",
      },
      {
        id: 2,
        date: "2025-05-13",
        contractor: "Beta Maintenance",
        description: "Started electrical system upgrade",
        status: "In Progress",
      },
      {
        id: 3,
        date: "2025-05-12",
        contractor: "Gamma Engineering",
        description: "Submitted proposal for water system enhancement",
        status: "Pending Approval",
      },
      {
        id: 4,
        date: "2025-05-11",
        contractor: "Delta Services",
        description: "Conducted site inspection",
        status: "Completed",
      },
    ],
  }
}

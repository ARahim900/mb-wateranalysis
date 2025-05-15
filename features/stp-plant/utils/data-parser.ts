// Data structure for STP Plant records
export interface STPRecord {
  date: string
  tankersCount: number
  expectedTankerVolume: number
  directInlineSewage: number
  totalInletSewage: number
  totalTreatedWater: number
  totalTSEWaterOutput: number
  efficiency: number
  utilizationRate: number
}

// Helper function to calculate percentage change
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

// Parse the raw data into structured format
export function parseStpData(rawData: string): STPRecord[] {
  const lines = rawData.trim().split("\n")
  // Skip the header line
  const dataLines = lines.slice(1)

  return dataLines.map((line) => {
    const columns = line.split("\t").map((col) => col.trim())

    // Parse date to standard format (YYYY-MM-DD)
    const dateParts = columns[0].split("/")
    const formattedDate = `${dateParts[2]}-${dateParts[1].padStart(2, "0")}-${dateParts[0].padStart(2, "0")}`

    const tankersCount = Number.parseInt(columns[1])
    const expectedTankerVolume = Number.parseInt(columns[2])
    const directInlineSewage = Number.parseInt(columns[3])
    const totalInletSewage = Number.parseInt(columns[4])
    const totalTreatedWater = Number.parseInt(columns[5])
    const totalTSEWaterOutput = Number.parseInt(columns[6])

    // Calculate efficiency (treated water output / total inlet sewage)
    const efficiency = totalInletSewage > 0 ? (totalTreatedWater / totalInletSewage) * 100 : 0

    // Calculate utilization rate (total treated water / plant capacity)
    // Assuming plant capacity is 750 m³/day
    const utilizationRate = (totalTreatedWater / 750) * 100

    return {
      date: formattedDate,
      tankersCount,
      expectedTankerVolume,
      directInlineSewage,
      totalInletSewage,
      totalTreatedWater,
      totalTSEWaterOutput,
      efficiency,
      utilizationRate,
    }
  })
}

// Group data by month
export function groupDataByMonth(data: STPRecord[]): Record<string, STPRecord[]> {
  const groupedData: Record<string, STPRecord[]> = {}

  data.forEach((record) => {
    const month = record.date.substring(0, 7) // YYYY-MM format
    if (!groupedData[month]) {
      groupedData[month] = []
    }
    groupedData[month].push(record)
  })

  return groupedData
}

// Calculate monthly aggregates
export interface MonthlyAggregate {
  month: string
  avgTankersCount: number
  totalTankerVolume: number
  totalDirectSewage: number
  totalInletSewage: number
  totalTreatedWater: number
  totalIrrigationOutput: number
  avgEfficiency: number
  avgUtilizationRate: number
  daysInMonth: number
}

export function calculateMonthlyAggregates(groupedData: Record<string, STPRecord[]>): MonthlyAggregate[] {
  return Object.entries(groupedData)
    .map(([month, records]) => {
      const daysInMonth = records.length

      // Calculate totals
      const totalTankerVolume = records.reduce((sum, record) => sum + record.expectedTankerVolume, 0)
      const totalDirectSewage = records.reduce((sum, record) => sum + record.directInlineSewage, 0)
      const totalInletSewage = records.reduce((sum, record) => sum + record.totalInletSewage, 0)
      const totalTreatedWater = records.reduce((sum, record) => sum + record.totalTreatedWater, 0)
      const totalIrrigationOutput = records.reduce((sum, record) => sum + record.totalTSEWaterOutput, 0)

      // Calculate averages
      const avgTankersCount = records.reduce((sum, record) => sum + record.tankersCount, 0) / daysInMonth
      const avgEfficiency = records.reduce((sum, record) => sum + record.efficiency, 0) / daysInMonth
      const avgUtilizationRate = records.reduce((sum, record) => sum + record.utilizationRate, 0) / daysInMonth

      return {
        month,
        avgTankersCount,
        totalTankerVolume,
        totalDirectSewage,
        totalInletSewage,
        totalTreatedWater,
        totalIrrigationOutput,
        avgEfficiency,
        avgUtilizationRate,
        daysInMonth,
      }
    })
    .sort((a, b) => a.month.localeCompare(b.month))
}

// Format month for display (YYYY-MM to Month YYYY)
export function formatMonth(month: string): string {
  const date = new Date(month + "-01")
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

// Get month options for selector
export function getMonthOptions(data: STPRecord[]): { value: string; label: string }[] {
  const months = Array.from(new Set(data.map((record) => record.date.substring(0, 7))))
  return months.sort().map((month) => ({
    value: month,
    label: formatMonth(month),
  }))
}

// New function to parse data for enhanced components
export function parseData(rawInputData: string, selectedMonth: string) {
  // Parse the raw data
  const allData = parseStpData(rawInputData)

  // Group data by month
  const groupedData = groupDataByMonth(allData)

  // Calculate monthly aggregates
  const monthlyAggregates = calculateMonthlyAggregates(groupedData)

  // Get the selected month data
  const selectedMonthData = groupedData[selectedMonth] || []

  // Get the selected month aggregate
  const selectedMonthAggregate = monthlyAggregates.find((agg) => agg.month === selectedMonth)

  // Find the previous month aggregate for comparison
  const currentMonthIndex = monthlyAggregates.findIndex((agg) => agg.month === selectedMonth)
  const previousMonthAggregate = currentMonthIndex > 0 ? monthlyAggregates[currentMonthIndex - 1] : null

  // Calculate KPI data
  const kpiData = {
    totalInflow: selectedMonthAggregate?.totalInletSewage || 0,
    totalOutflow: selectedMonthAggregate?.totalTreatedWater || 0,
    efficiency: selectedMonthAggregate?.avgEfficiency || 0,
    utilization: selectedMonthAggregate?.avgUtilizationRate || 0,
    qualityIndex: 8.7, // Placeholder value
    inflowChange: previousMonthAggregate
      ? calculatePercentageChange(
          selectedMonthAggregate?.totalInletSewage || 0,
          previousMonthAggregate.totalInletSewage,
        )
      : 0,
    outflowChange: previousMonthAggregate
      ? calculatePercentageChange(
          selectedMonthAggregate?.totalTreatedWater || 0,
          previousMonthAggregate.totalTreatedWater,
        )
      : 0,
    efficiencyChange: previousMonthAggregate
      ? calculatePercentageChange(selectedMonthAggregate?.avgEfficiency || 0, previousMonthAggregate.avgEfficiency)
      : 0,
    utilizationChange: previousMonthAggregate
      ? calculatePercentageChange(
          selectedMonthAggregate?.avgUtilizationRate || 0,
          previousMonthAggregate.avgUtilizationRate,
        )
      : 0,
    qualityChange: 1.2, // Placeholder value
  }

  // Create Sankey data
  const sankeyData = {
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
      { source: 0, target: 3, value: selectedMonthAggregate?.totalInletSewage || 0 },
      { source: 1, target: 0, value: selectedMonthAggregate?.totalTankerVolume || 0 },
      { source: 2, target: 0, value: selectedMonthAggregate?.totalDirectSewage || 0 },
      { source: 3, target: 4, value: (selectedMonthAggregate?.totalInletSewage || 0) * 0.95 },
      { source: 3, target: 7, value: (selectedMonthAggregate?.totalInletSewage || 0) * 0.05 },
      { source: 4, target: 5, value: (selectedMonthAggregate?.totalInletSewage || 0) * 0.9 },
      { source: 4, target: 7, value: (selectedMonthAggregate?.totalInletSewage || 0) * 0.05 },
      { source: 5, target: 6, value: selectedMonthAggregate?.totalIrrigationOutput || 0 },
      { source: 5, target: 7, value: (selectedMonthAggregate?.totalInletSewage || 0) * 0.05 },
    ],
  }

  // Create daily data
  const dailyData = selectedMonthData.map((record) => ({
    day: new Date(record.date).getDate().toString(),
    efficiency: record.efficiency,
    flowRate: record.totalInletSewage,
    qualityIndex: 7 + Math.random() * 3, // Placeholder value
  }))

  // Create monthly data for trends
  const monthlyData = monthlyAggregates.map((agg) => ({
    month: formatMonth(agg.month).substring(0, 3),
    efficiency: agg.avgEfficiency,
    target: 85, // Placeholder target value
    flowRate: agg.totalInletSewage / agg.daysInMonth,
  }))

  // Create raw data for table
  const tableData = selectedMonthData.map((record, index) => ({
    id: index + 1,
    date: new Date(record.date).toLocaleDateString(),
    influentFlow: record.totalInletSewage,
    effluentFlow: record.totalTreatedWater,
    efficiency: record.efficiency,
    energyUsage: 200 + Math.random() * 50, // Placeholder value
    chemicalUsage: 50 + Math.random() * 20, // Placeholder value
  }))

  // Create previous month raw data for comparison
  const previousMonthData = previousMonthAggregate ? groupedData[previousMonthAggregate.month] || [] : []

  const previousMonthTableData = previousMonthData.map((record, index) => ({
    id: index + 1,
    date: new Date(record.date).toLocaleDateString(),
    influentFlow: record.totalInletSewage,
    effluentFlow: record.totalTreatedWater,
    efficiency: record.efficiency,
    energyUsage: 190 + Math.random() * 50, // Placeholder value
    chemicalUsage: 48 + Math.random() * 20, // Placeholder value
  }))

  return {
    kpiData,
    sankeyData,
    dailyData,
    monthlyData,
    tableData,
    previousMonthTableData,
  }
}

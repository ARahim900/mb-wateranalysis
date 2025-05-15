import type React from "react"
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react"

interface DataRow {
  id: string | number
  date: string
  influentFlow?: number
  effluentFlow?: number
  efficiency?: number
  energyUsage?: number
  chemicalUsage?: number
  [key: string]: any
}

interface EnhancedDataTableProps {
  data: DataRow[]
  previousData?: DataRow[]
  title?: string
}

// Helper function to safely format numbers
const safeFormat = (value: number | undefined | null, decimals = 1): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return "N/A"
  }
  return value.toFixed(decimals)
}

export const EnhancedDataTable: React.FC<EnhancedDataTableProps> = ({ data, previousData, title = "Raw Data" }) => {
  // Function to calculate percentage change
  const calculateChange = (current: number | undefined | null, previous: number | undefined | null) => {
    if (current === undefined || current === null || previous === undefined || previous === null || previous === 0) {
      return null
    }
    return ((current - previous) / previous) * 100
  }

  // Function to get trend indicator
  const getTrendIndicator = (change: number | null) => {
    if (change === null) return { icon: <MinusIcon className="h-4 w-4 text-gray-400" />, color: "text-gray-400" }
    if (change > 0) return { icon: <ArrowUpIcon className="h-4 w-4 text-green-500" />, color: "text-green-500" }
    if (change < 0) return { icon: <ArrowDownIcon className="h-4 w-4 text-red-500" />, color: "text-red-500" }
    return { icon: <MinusIcon className="h-4 w-4 text-gray-400" />, color: "text-gray-400" }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Influent Flow (m³)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Effluent Flow (m³)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Efficiency (%)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Energy Usage (kWh)
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Chemical Usage (kg)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => {
              const prevRow = previousData ? previousData[index] : undefined

              const influentChange = calculateChange(row.influentFlow, prevRow?.influentFlow)
              const effluentChange = calculateChange(row.effluentFlow, prevRow?.effluentFlow)
              const efficiencyChange = calculateChange(row.efficiency, prevRow?.efficiency)
              const energyChange = calculateChange(row.energyUsage, prevRow?.energyUsage)
              const chemicalChange = calculateChange(row.chemicalUsage, prevRow?.chemicalUsage)

              const influentTrend = getTrendIndicator(influentChange)
              const effluentTrend = getTrendIndicator(effluentChange)
              const efficiencyTrend = getTrendIndicator(efficiencyChange)
              const energyTrend = getTrendIndicator(energyChange)
              const chemicalTrend = getTrendIndicator(chemicalChange)

              return (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{safeFormat(row.influentFlow)}</span>
                      <span className={influentTrend.color}>
                        {influentTrend.icon}
                        {influentChange !== null && (
                          <span className="ml-1 text-xs">{safeFormat(Math.abs(influentChange))}</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{safeFormat(row.effluentFlow)}</span>
                      <span className={effluentTrend.color}>
                        {effluentTrend.icon}
                        {effluentChange !== null && (
                          <span className="ml-1 text-xs">{safeFormat(Math.abs(effluentChange))}</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{safeFormat(row.efficiency)}</span>
                      <span className={efficiencyTrend.color}>
                        {efficiencyTrend.icon}
                        {efficiencyChange !== null && (
                          <span className="ml-1 text-xs">{safeFormat(Math.abs(efficiencyChange))}</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{safeFormat(row.energyUsage)}</span>
                      <span className={energyTrend.color}>
                        {energyTrend.icon}
                        {energyChange !== null && (
                          <span className="ml-1 text-xs">{safeFormat(Math.abs(energyChange))}</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{safeFormat(row.chemicalUsage)}</span>
                      <span className={chemicalTrend.color}>
                        {chemicalTrend.icon}
                        {chemicalChange !== null && (
                          <span className="ml-1 text-xs">{safeFormat(Math.abs(chemicalChange))}</span>
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {data.length === 0 && <div className="text-center py-8 text-gray-500">No data available</div>}
    </div>
  )
}

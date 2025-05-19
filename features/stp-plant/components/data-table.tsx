"use client"

import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"
import type { STPData } from "../hooks/use-stp-data"
import { ensureNumber } from "../hooks/use-stp-data"
import { exportToCSV } from "@/lib/export-utils"
import { useToast } from "@/hooks/use-toast"

interface DataTableProps {
  data: STPData[]
}

export function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { addToast } = useToast()

  // Process data for display
  const tableData = useMemo(() => {
    return data
      .map((item) => {
        const totalInlet = ensureNumber(item.totalInletSewage)
        const totalTreated = ensureNumber(item.totalTreatedWater)
        const efficiency = totalInlet > 0 ? (totalTreated / totalInlet) * 100 : 0

        return {
          ...item,
          efficiency,
          formattedDate: new Date(item.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
        }
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [data])

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return tableData

    const term = searchTerm.toLowerCase()
    return tableData.filter(
      (item) =>
        item.formattedDate.toLowerCase().includes(term) ||
        item.tankerTrips.toString().includes(term) ||
        item.totalInletSewage.toString().includes(term) ||
        item.totalTreatedWater.toString().includes(term),
    )
  }, [tableData, searchTerm])

  // Export data to CSV
  const handleExport = () => {
    const exportData = filteredData.map((item) => ({
      Date: item.formattedDate,
      Tanker_Trips: item.tankerTrips,
      Tanker_Volume_m3: item.expectedTankerVolume,
      Direct_Sewage_m3: item.directInlineSewage,
      Total_Inlet_m3: item.totalInletSewage,
      Treated_Water_m3: item.totalTreatedWater,
      TSE_Output_m3: item.totalTSEWater,
      Efficiency_Pct: item.efficiency.toFixed(1),
    }))

    exportToCSV(exportData, `STP_Data_Export_${new Date().toISOString().split("T")[0]}`)
    addToast("Export successful", "Data has been exported to CSV", "success")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search data..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="max-h-[500px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Tanker Trips</TableHead>
                <TableHead className="text-right">Tanker Volume (m³)</TableHead>
                <TableHead className="text-right">Direct Sewage (m³)</TableHead>
                <TableHead className="text-right">Total Inlet (m³)</TableHead>
                <TableHead className="text-right">Treated Water (m³)</TableHead>
                <TableHead className="text-right">TSE Output (m³)</TableHead>
                <TableHead className="text-right">Efficiency (%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.formattedDate}</TableCell>
                    <TableCell className="text-right">{item.tankerTrips}</TableCell>
                    <TableCell className="text-right">{item.expectedTankerVolume.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.directInlineSewage.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.totalInletSewage.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.totalTreatedWater.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.totalTSEWater.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          item.efficiency >= 90
                            ? "text-green-500"
                            : item.efficiency >= 80
                              ? "text-green-400"
                              : item.efficiency >= 70
                                ? "text-yellow-500"
                                : "text-red-500"
                        }
                      >
                        {item.efficiency.toFixed(1)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {filteredData.length} of {tableData.length} records
      </div>
    </div>
  )
}

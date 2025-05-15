"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Download,
  Calendar,
  ChevronDown,
  ChevronUp,
  GanttChartSquare
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface EnhancedDataTableProps {
  data: any[]
  previousData: any[]
}

export function EnhancedDataTable({ data, previousData }: EnhancedDataTableProps) {
  const [sortField, setSortField] = useState<string>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filter, setFilter] = useState<"all" | "above-avg" | "below-avg">("all")
  const [currentTab, setCurrentTab] = useState<"current" | "previous">("current")

  // Calculate average efficiency for filtering
  const avgEfficiency =
    data.reduce((acc, record) => acc + record.efficiency, 0) / data.length

  // Sort and filter data
  const sortedData = [...(currentTab === "current" ? data : previousData)].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1
    } else {
      return a[sortField] < b[sortField] ? 1 : -1
    }
  })

  const filteredData = sortedData.filter((record) => {
    if (filter === "all") return true
    if (filter === "above-avg") return record.efficiency >= avgEfficiency
    if (filter === "below-avg") return record.efficiency < avgEfficiency
    return true
  })

  // Handle sort toggle
  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Handle data export
  const exportData = () => {
    const headers = ["Date", "Influent Flow (m³)", "Effluent Flow (m³)", "Efficiency (%)", "Energy Usage (kWh)", "Chemical Usage (kg)"]
    const csvData = [
      headers.join(","),
      ...filteredData.map(record => 
        [
          record.date, 
          record.influentFlow, 
          record.effluentFlow, 
          record.efficiency,
          record.energyUsage,
          record.chemicalUsage
        ].join(",")
      )
    ].join("\n")
    
    const blob = new Blob([csvData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `stp-data-${new Date().toLocaleDateString()}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <CardTitle className="text-lg font-medium">STP Plant Data Records</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex border rounded-md">
              <Button 
                variant={currentTab === "current" ? "default" : "ghost"} 
                className="h-9 rounded-r-none"
                onClick={() => setCurrentTab("current")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Current
              </Button>
              <Button 
                variant={currentTab === "previous" ? "default" : "ghost"} 
                className="h-9 rounded-l-none"
                onClick={() => setCurrentTab("previous")}
              >
                <GanttChartSquare className="h-4 w-4 mr-2" />
                Previous Month
              </Button>
            </div>
            <Select value={filter} onValueChange={(val: any) => setFilter(val)}>
              <SelectTrigger className="w-40 h-9">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="above-avg">Above Avg Efficiency</SelectItem>
                <SelectItem value="below-avg">Below Avg Efficiency</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] cursor-pointer" onClick={() => toggleSort("date")}>
                  <div className="flex items-center">
                    Date
                    {sortField === "date" && (
                      sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => toggleSort("influentFlow")}>
                  <div className="flex items-center justify-end">
                    Influent Flow (m³)
                    {sortField === "influentFlow" && (
                      sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => toggleSort("effluentFlow")}>
                  <div className="flex items-center justify-end">
                    Effluent Flow (m³)
                    {sortField === "effluentFlow" && (
                      sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => toggleSort("efficiency")}>
                  <div className="flex items-center justify-end">
                    Efficiency (%)
                    {sortField === "efficiency" && (
                      sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => toggleSort("energyUsage")}>
                  <div className="flex items-center justify-end">
                    Energy (kWh)
                    {sortField === "energyUsage" && (
                      sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => toggleSort("chemicalUsage")}>
                  <div className="flex items-center justify-end">
                    Chemicals (kg)
                    {sortField === "chemicalUsage" && (
                      sortDirection === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No records matching the current filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell className="text-right">{record.influentFlow}</TableCell>
                    <TableCell className="text-right">{record.effluentFlow}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          record.efficiency >= avgEfficiency
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {record.efficiency}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{record.energyUsage}</TableCell>
                    <TableCell className="text-right">{record.chemicalUsage}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
          <div>
            Showing {filteredData.length} of {currentTab === "current" ? data.length : previousData.length} records
          </div>
          <div>
            Average Efficiency: <span className="font-medium">{avgEfficiency.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

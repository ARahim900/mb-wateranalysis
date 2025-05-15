"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import type { STPRecord } from "../utils/data-parser"

interface DataTableProps {
  data: STPRecord[]
}

export function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof STPRecord
    direction: "ascending" | "descending"
  }>({
    key: "date",
    direction: "ascending",
  })

  // Filter data based on search term
  const filteredData = data.filter((record) => {
    if (!searchTerm) return true

    const searchTermLower = searchTerm.toLowerCase()
    const date = new Date(record.date).toLocaleDateString()

    return (
      date.includes(searchTerm) ||
      record.tankersCount.toString().includes(searchTerm) ||
      record.expectedTankerVolume.toString().includes(searchTerm) ||
      record.directInlineSewage.toString().includes(searchTerm) ||
      record.totalInletSewage.toString().includes(searchTerm) ||
      record.totalTreatedWater.toString().includes(searchTerm) ||
      record.totalTSEWaterOutput.toString().includes(searchTerm)
    )
  })

  // Sort data based on sort config
  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  // Handle sort click
  const handleSort = (key: keyof STPRecord) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "ascending" ? "descending" : "ascending",
    })
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="col-span-3">
      <CardContent className="p-6">
        <SectionHeader
          title="Daily STP Plant Data"
          description="Detailed daily operational data"
          actions={
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          }
        />
        <div className="overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("date")}>
                  Date {sortConfig.key === "date" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("tankersCount")}>
                  Tankers {sortConfig.key === "tankersCount" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("expectedTankerVolume")}
                >
                  Tanker Volume (m³){" "}
                  {sortConfig.key === "expectedTankerVolume" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("directInlineSewage")}>
                  Direct Sewage (m³){" "}
                  {sortConfig.key === "directInlineSewage" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("totalInletSewage")}>
                  Total Inlet (m³){" "}
                  {sortConfig.key === "totalInletSewage" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("totalTreatedWater")}>
                  Treated Water (m³){" "}
                  {sortConfig.key === "totalTreatedWater" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("totalTSEWaterOutput")}
                >
                  Irrigation Output (m³){" "}
                  {sortConfig.key === "totalTSEWaterOutput" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("efficiency")}>
                  Efficiency (%) {sortConfig.key === "efficiency" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((record) => (
                <TableRow key={record.date}>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>{record.tankersCount}</TableCell>
                  <TableCell>{record.expectedTankerVolume}</TableCell>
                  <TableCell>{record.directInlineSewage}</TableCell>
                  <TableCell>{record.totalInletSewage}</TableCell>
                  <TableCell>{record.totalTreatedWater}</TableCell>
                  <TableCell>{record.totalTSEWaterOutput}</TableCell>
                  <TableCell>{record.efficiency.toFixed(1)}%</TableCell>
                </TableRow>
              ))}
              {sortedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

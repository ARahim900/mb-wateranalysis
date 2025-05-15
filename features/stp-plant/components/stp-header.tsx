"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Download, Filter, RefreshCcw } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface STPHeaderProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
}

export function STPHeader({ selectedMonth, onMonthChange }: STPHeaderProps) {
  // Define available months for dropdown
  const months = [
    { value: "2024-07", label: "July 2024" },
    { value: "2024-08", label: "August 2024" },
    { value: "2024-09", label: "September 2024" },
    { value: "2024-10", label: "October 2024" },
    { value: "2024-11", label: "November 2024" },
    { value: "2024-12", label: "December 2024" },
    { value: "2025-01", label: "January 2025" },
    { value: "2025-02", label: "February 2025" },
    { value: "2025-03", label: "March 2025" },
    { value: "2025-04", label: "April 2025" },
    { value: "2025-05", label: "May 2025" },
  ]

  // Handle export data (demonstration purpose, would connect to actual export functionality)
  const handleExportData = () => {
    alert('Export functionality would be implemented here')
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-8">
      <div>
        <h1 className="text-2xl font-bold">STP Plant Analysis</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Water treatment performance and monitoring
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center">
          <Calendar className="mr-2 h-4 w-4 text-gray-500" />
          <Select value={selectedMonth} onValueChange={onMonthChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={handleExportData}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  )
}

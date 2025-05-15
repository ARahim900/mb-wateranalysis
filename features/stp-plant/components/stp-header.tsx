"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface STPHeaderProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
}

export function STPHeader({ selectedMonth, onMonthChange }: STPHeaderProps) {
  const months = [
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

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">STP Plant Analysis</h1>
        <p className="text-gray-500">Comprehensive analysis of sewage treatment plant operations</p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Select Month:</span>
        <Select value={selectedMonth} onValueChange={onMonthChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

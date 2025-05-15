"use client"

import type React from "react"
import { CalendarDays } from "lucide-react"

interface STPHeaderProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
}

export const STPHeader: React.FC<STPHeaderProps> = ({ selectedMonth, onMonthChange }) => {
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

  const currentYear = new Date().getFullYear()

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">STP Plant Analysis</h1>
        <p className="text-gray-500 mt-1">Comprehensive analysis of sewage treatment plant performance</p>
      </div>

      <div className="flex items-center mt-4 md:mt-0 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <CalendarDays className="h-5 w-5 text-gray-500 mr-2" />
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
          className="bg-transparent text-gray-700 font-medium focus:outline-none"
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month} {currentYear}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

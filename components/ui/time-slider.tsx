"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TimeSliderProps {
  dates: string[]
  currentDate: string
  onChange: (date: string) => void
  className?: string
}

export function TimeSlider({ dates, currentDate, onChange, className = "" }: TimeSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const index = dates.findIndex((date) => date === currentDate)
    if (index !== -1) {
      setCurrentIndex(index)
    }
  }, [currentDate, dates])

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      onChange(dates[newIndex])
    }
  }

  const handleNext = () => {
    if (currentIndex < dates.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      onChange(dates[newIndex])
    }
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        aria-label="Previous month"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="relative w-full h-2 bg-gray-200 rounded-full">
        <div
          className="absolute inset-y-0 left-0 bg-[#8ACCD5] rounded-full"
          style={{
            width: `${(currentIndex / (dates.length - 1)) * 100}%`,
          }}
        />

        <div className="absolute -top-8 left-0 right-0 flex justify-between px-2">
          <span className="text-xs text-muted-foreground">{dates[0]}</span>
          <span className="text-xs text-muted-foreground">{dates[dates.length - 1]}</span>
        </div>

        <div
          className="absolute -top-8 transform -translate-x-1/2"
          style={{ left: `${(currentIndex / (dates.length - 1)) * 100}%` }}
        >
          <span className="text-xs font-medium bg-[#4E4456] text-white px-2 py-1 rounded">{dates[currentIndex]}</span>
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={currentIndex === dates.length - 1}
        aria-label="Next month"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

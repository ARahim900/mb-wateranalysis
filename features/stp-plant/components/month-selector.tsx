"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface MonthSelectorProps {
  options: { value: string; label: string }[]
  value: string | null
  onChange: (value: string) => void
}

export function MonthSelector({ options, value, onChange }: MonthSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get current selected option
  const selectedOption = options.find((option) => option.value === value)

  // Get current index
  const currentIndex = options.findIndex((option) => option.value === value)

  // Handle previous month
  const handlePrevious = () => {
    if (currentIndex > 0) {
      onChange(options[currentIndex - 1].value)
    }
  }

  // Handle next month
  const handleNext = () => {
    if (currentIndex < options.length - 1) {
      onChange(options[currentIndex + 1].value)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrevious}
          disabled={currentIndex <= 0}
          className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          className="relative bg-white rounded-lg shadow-sm px-4 py-2 cursor-pointer min-w-40 text-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-medium">{selectedOption?.label || "Select Month"}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex >= options.length - 1}
          className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  option.value === value ? "bg-gray-100 font-medium" : ""
                }`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

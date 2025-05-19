"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"

interface ExportButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export function ExportButton({ onClick, label = "Export to CSV", className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleClick = async () => {
    setIsExporting(true)
    try {
      await onClick()
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={isExporting} className={className}>
      <Download className="mr-2 h-4 w-4" />
      {isExporting ? "Exporting..." : label}
    </Button>
  )
}

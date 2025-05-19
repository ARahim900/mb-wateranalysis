import type React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface DashboardHeaderProps {
  title: string
  subtitle: string
  children?: React.ReactNode
  className?: string
}

export function DashboardHeader({ title, subtitle, children, className }: DashboardHeaderProps) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `#4E4456`,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Muscat Bay Logo" width={48} height={48} className="h-12 w-auto" />
            <div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              <p className="text-purple-100 mt-1">{subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">{children}</div>
        </div>
      </div>
    </div>
  )
}

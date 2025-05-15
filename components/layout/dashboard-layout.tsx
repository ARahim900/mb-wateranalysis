"use client"

import type React from "react"
import { MainNavigation } from "./main-navigation"
import { Footer } from "./footer"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
  onBack?: () => void
}

export function DashboardLayout({ children, title, subtitle, showBackButton = false, onBack }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavigation />

      {/* Header */}
      <div className="bg-[#4E4456] pt-16 pb-6 px-6">
        <div className="container mx-auto">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={onBack}
                className="mr-4 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                aria-label="Go back"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">{title}</h1>
              {subtitle && <p className="text-purple-100 mt-1">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">{children}</main>

      <Footer />
    </div>
  )
}

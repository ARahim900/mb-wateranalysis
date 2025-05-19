"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { BarChart3, Droplets, Zap, Factory, Users, ChevronLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChartPlaceholder } from "@/components/ui/chart-placeholder"

// Define the main color palette
const colors = {
  primary: "#4E4456", // Muscat Bay logo color - dark purple/aubergine
  accent: "#8ACCD5", // Teal/Light Blue accent
  success: "#50C878", // Success Green
  warning: "#FFB347", // Warning Orange
  danger: "#FF6B6B", // Danger Red
  electricityAccent: "#F8B84E", // Electricity accent (orange)
}

interface LandingPageProps {
  onSelectSection?: (sectionId: string) => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectSection = () => {} }) => {
  const [viewMode, setViewMode] = useState<"Realtime" | "Monthly">("Monthly")

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-[#4E4456] text-white flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b border-gray-700">
          <Image src="/logo.png" alt="Muscat Bay Logo" width={32} height={32} className="h-8 w-8" />
          <h1 className="text-xl font-semibold">Muscat Bay</h1>
          <ChevronLeft className="ml-auto h-5 w-5 text-gray-400" />
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onSelectSection("dashboard")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-[#3D3545] rounded-md font-medium"
              >
                <BarChart3 className="h-5 w-5" />
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectSection("waterAnalysis")}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#3D3545] rounded-md"
              >
                <Droplets className="h-5 w-5" />
                Water Analysis
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectSection("electricityAnalysis")}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#3D3545] rounded-md"
              >
                <Zap className="h-5 w-5" />
                Electricity Analysis
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectSection("stpPlant")}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#3D3545] rounded-md"
              >
                <Factory className="h-5 w-5" />
                STP Plant
              </button>
            </li>
            <li>
              <button
                onClick={() => onSelectSection("contractorTracker")}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#3D3545] rounded-md"
              >
                <Users className="h-5 w-5" />
                Contractor Tracker
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-[#4E4456] font-medium">A</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-gray-400">admin@muscatbay.com</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-[#4E4456] text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Muscat Bay Dashboard</h1>
            <p className="text-gray-300">Utility Management System Overview</p>
          </div>
          <div className="bg-white rounded-md flex overflow-hidden">
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium",
                viewMode === "Realtime" ? "bg-[#4E4456] text-white" : "bg-white text-gray-700",
              )}
              onClick={() => setViewMode("Realtime")}
            >
              Realtime
            </button>
            <button
              className={cn(
                "px-4 py-2 text-sm font-medium",
                viewMode === "Monthly" ? "bg-[#4E4456] text-white" : "bg-white text-gray-700",
              )}
              onClick={() => setViewMode("Monthly")}
            >
              Monthly
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">System Performance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Water Analytics Card */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold text-gray-800">Water Analytics</h3>
                      <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        L1
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Water supply and consumption metrics</p>

                    <div className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Total Loss</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">7.6</span>
                        <span className="text-sm">%</span>
                      </div>
                      <p className="text-xs text-green-600">Within target</p>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Supply:</p>
                        <p className="font-medium">34,915 m³</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Consumption:</p>
                        <p className="font-medium">32,264 m³</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Electricity Management Card */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-5 w-5 text-amber-500" />
                      <h3 className="font-semibold text-gray-800">Electricity Management</h3>
                      <span className="ml-auto px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                        92%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Power consumption and distribution</p>

                    <div className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Current Usage</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">78,479</span>
                        <span className="text-sm">kWh</span>
                      </div>
                      <p className="text-xs text-red-600 flex items-center">
                        <span>↓ 26.7%</span>
                        <span className="ml-1">vs last period</span>
                      </p>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                    </div>

                    <div className="text-sm">
                      <p className="text-gray-500">Efficiency: 92% | Peak: 14,971 kWh</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* STP Plant Card */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Factory className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold text-gray-800">STP Plant</h3>
                      <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded">
                        High
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Sewage treatment performance</p>

                    <div className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Efficiency</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">105.3</span>
                        <span className="text-sm">%</span>
                      </div>
                      <p className="text-xs text-red-600 flex items-center">
                        <span>↓ 6.9%</span>
                        <span className="ml-1">decrease</span>
                      </p>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500">Daily Flow: 16.9 m³/day</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Monthly: 506 m³</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contractor Tracker Card */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-5 w-5 text-cyan-500" />
                      <h3 className="font-semibold text-gray-800">Contractor Tracker</h3>
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-cyan-100 text-cyan-800">
                        <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Contractor agreements and status</p>

                    <div className="mb-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Active Contracts</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">5</span>
                      </div>
                      <p className="text-xs text-amber-600">2 contracts expiring soon</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="bg-green-100 rounded p-2 text-center">
                        <p className="text-xs text-gray-600">Active:</p>
                        <p className="font-medium text-green-700">5</p>
                      </div>
                      <div className="bg-amber-100 rounded p-2 text-center">
                        <p className="text-xs text-gray-600">Expiring:</p>
                        <p className="font-medium text-amber-700">2</p>
                      </div>
                      <div className="bg-red-100 rounded p-2 text-center">
                        <p className="text-xs text-gray-600">Expired:</p>
                        <p className="font-medium text-red-700">0</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Water Supply vs Consumption Chart */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-1">Water Supply vs Consumption</h3>
                <p className="text-sm text-gray-500 mb-4">Trend analysis with loss percentage</p>
                <ChartPlaceholder type="line" height={250} />
              </CardContent>
            </Card>

            {/* Electricity Consumption Chart */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-1">Electricity Consumption</h3>
                <p className="text-sm text-gray-500 mb-4">Monthly consumption patterns</p>
                <ChartPlaceholder type="bar" height={250} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

export default LandingPage

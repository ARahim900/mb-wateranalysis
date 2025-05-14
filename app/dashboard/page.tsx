"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import ModernDonutChart from "@/components/modern-donut-chart";

// Define the base color and generate a color palette
const BASE_COLOR = "#4E4456";
const SECONDARY_COLOR = "#8A7A94";
const ACCENT_COLOR = "#8ACCD5";
const SUCCESS_COLOR = "#50C878";
const WARNING_COLOR = "#FFB347";
const DANGER_COLOR = "#FF6B6B";
const INFO_COLOR = "#5BC0DE";
const NEUTRAL_COLOR = "#ADB5BD";

// Dashboard card component
const DashboardCard = ({ title, value, unit, trend, className, icon, onClick, isActive }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
      className={`rounded-lg overflow-hidden cursor-pointer ${isActive ? 'ring-2 ring-[#8ACCD5]' : ''}`}
      onClick={onClick}
    >
      <Card className={`overflow-hidden h-full ${className}`}>
        <div className="h-2" style={{ background: `linear-gradient(to right, ${BASE_COLOR}, ${ACCENT_COLOR})` }} aria-hidden="true"></div>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-600 text-sm font-medium uppercase tracking-wider">{title}</h3>
            {icon && (
              <span className="text-gray-400" aria-hidden="true">
                {icon}
              </span>
            )}
          </div>
          <div className="mt-2 flex items-baseline">
            <p className="text-3xl font-bold" style={{ color: BASE_COLOR }}>
              {value}
            </p>
            <p className="ml-2 text-sm text-gray-500">{unit}</p>
          </div>
          {trend && (
            <div className="mt-3 flex items-center">
              <span
                className={`text-xs font-medium ${Number.parseFloat(trend.toString()) >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {Number.parseFloat(trend.toString()) >= 0 ? "↑" : "↓"} {Math.abs(Number.parseFloat(trend.toString()))}%
              </span>
              <span className="text-gray-400 text-xs ml-2">vs previous month</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Module navigation card component
const ModuleCard = ({ title, icon, description, color, onClick, isActive }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
      whileTap={{ y: 0 }}
      className={`bg-white rounded-lg overflow-hidden cursor-pointer ${isActive ? 'ring-2 ring-[#8ACCD5]' : ''}`}
      onClick={onClick}
    >
      <div className="h-2" style={{ background: color }} aria-hidden="true"></div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-full" style={{ background: `${color}20` }}>
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: BASE_COLOR }}>{title}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </motion.div>
  );
};

// Main Dashboard Component
export default function DashboardPage() {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState('overview');
  
  // Mock data for electrical consumption summary
  const electricalSummary = {
    totalConsumption: 28864,
    highestConsumer: "Pumping Station 01",
    trend: 16.4,
    monthlyAverage: 2405
  };
  
  // Mock data for STP monitoring summary
  const stpSummary = {
    totalSewageProcessed: 468,
    treatmentEfficiency: 90.8,
    trend: 5.2,
    averageInflow: 220
  };
  
  // Mock data for contract tracker summary
  const contractSummary = {
    activeContracts: 15,
    totalValue: "230,450",
    expiringContracts: 3,
    trend: -2.1
  };

  // Sample electrical consumption data
  const electricalMonthlyData = [
    { month: "Apr", consumption: 6582 },
    { month: "May", consumption: 7103 },
    { month: "Jun", consumption: 6429 },
    { month: "Jul", consumption: 6891 },
    { month: "Aug", consumption: 6580 },
    { month: "Sep", consumption: 10450 },
    { month: "Oct", consumption: 12688 },
    { month: "Nov", consumption: 6935 },
    { month: "Dec", consumption: 7241 },
    { month: "Jan", consumption: 6550 },
    { month: "Feb", consumption: 7612 },
    { month: "Mar", consumption: 8614 },
  ];

  // Sample STP data
  const stpMonthlyData = [
    { month: "Apr", inflow: 200, outflow: 180 },
    { month: "May", inflow: 220, outflow: 200 },
    { month: "Jun", inflow: 240, outflow: 210 },
    { month: "Jul", inflow: 260, outflow: 240 },
    { month: "Aug", inflow: 280, outflow: 250 },
    { month: "Sep", inflow: 300, outflow: 270 },
    { month: "Oct", inflow: 320, outflow: 290 },
    { month: "Nov", inflow: 280, outflow: 260 },
    { month: "Dec", inflow: 260, outflow: 235 },
    { month: "Jan", inflow: 240, outflow: 220 },
    { month: "Feb", inflow: 220, outflow: 200 },
    { month: "Mar", inflow: 200, outflow: 180 },
  ];

  // Contract distribution data
  const contractDistributionData = [
    { name: "Maintenance", value: 55, percentage: 55 },
    { name: "Utilities", value: 20, percentage: 20 },
    { name: "Security", value: 15, percentage: 15 },
    { name: "Other", value: 10, percentage: 10 },
  ];

  // Electrical consumption by type
  const electricalByTypeData = [
    { name: "Pumping Stations", value: 45, percentage: 45 },
    { name: "Common Areas", value: 30, percentage: 30 },
    { name: "Infrastructure", value: 15, percentage: 15 },
    { name: "Other", value: 10, percentage: 10 },
  ];

  // Navigate to modules
  const navigateToModule = (module) => {
    if (module === 'water') {
      // Navigate to existing water analysis module
      router.push('/water-analysis');
    } else {
      router.push(`/${module}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with solid background */}
      <div
        className="relative overflow-hidden"
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
              <img src="/logo.png" alt="Muscat Bay Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-3xl font-bold text-white">Muscat Bay Utility Management</h1>
                <p className="text-purple-100 mt-1">Central Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Main content */}
        {activeModule === 'overview' && (
          <>
            {/* Module Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <ModuleCard 
                title="Water Analysis" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={ACCENT_COLOR}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>} 
                description="Comprehensive water usage monitoring and distribution analytics"
                color={ACCENT_COLOR}
                onClick={() => navigateToModule('water')}
              />
              <ModuleCard 
                title="Electrical Analysis" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={SUCCESS_COLOR}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>} 
                description="Electrical consumption reports and efficiency metrics" 
                color={SUCCESS_COLOR}
                onClick={() => navigateToModule('electrical')}
              />
              <ModuleCard 
                title="STP Monitoring" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={INFO_COLOR}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>} 
                description="Sewage treatment plant performance and operations data" 
                color={INFO_COLOR}
                onClick={() => navigateToModule('stp')}
              />
              <ModuleCard 
                title="Contractor Tracker" 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={WARNING_COLOR}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>} 
                description="Contract management and service provider performance" 
                color={WARNING_COLOR}
                onClick={() => navigateToModule('contracts')}
              />
            </div>

            {/* Key summary statistics */}
            <h2 className="text-2xl font-bold mb-6" style={{ color: BASE_COLOR }}>Key Metrics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <DashboardCard
                title="Total Water Supply"
                value="34,915"
                unit="m³"
                trend={-20.5}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>}
              />
              <DashboardCard
                title="Electrical Consumption"
                value={electricalSummary.totalConsumption.toLocaleString()}
                unit="kWh"
                trend={electricalSummary.trend}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>}
              />
              <DashboardCard
                title="STP Efficiency"
                value={stpSummary.treatmentEfficiency}
                unit="%"
                trend={stpSummary.trend}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>}
              />
              <DashboardCard
                title="Active Contracts"
                value={contractSummary.activeContracts}
                unit=""
                trend={contractSummary.trend}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>}
              />
            </div>

            {/* Chart row - show a sample of each module data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="overflow-hidden">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Electrical Consumption Trends</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={electricalMonthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="consumption" name="Consumption (kWh)" fill={SUCCESS_COLOR} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">STP Inflow vs Outflow</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stpMonthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="inflow" name="Inflow (m³)" stroke={INFO_COLOR} />
                        <Line type="monotone" dataKey="outflow" name="Treated Output (m³)" stroke={ACCENT_COLOR} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="overflow-hidden">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Electrical Consumption by Type</h3>
                  <div className="h-64">
                    <ModernDonutChart
                      data={electricalByTypeData}
                      colors={[SUCCESS_COLOR, INFO_COLOR, ACCENT_COLOR, WARNING_COLOR]}
                      title=""
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">Contract Distribution</h3>
                  <div className="h-64">
                    <ModernDonutChart
                      data={contractDistributionData}
                      colors={[WARNING_COLOR, ACCENT_COLOR, INFO_COLOR, SUCCESS_COLOR]}
                      title=""
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      <div className="bg-white border-t mt-6">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">Muscat Bay Utility Management System © 2025</p>
            <div className="text-sm font-medium" style={{ color: "#4E4456" }}>
              Last updated: May 15, 2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

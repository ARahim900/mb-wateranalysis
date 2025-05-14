"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import Papa from 'papaparse';

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
const DashboardCard = ({ title, value, unit, trend, className, icon }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
      className="rounded-lg overflow-hidden"
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
          {trend !== undefined && (
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

// CustomTooltip component for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-[#4E4456] shadow-md rounded-md">
        <p className="font-medium mb-1 text-[#4E4456]">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toLocaleString()} kWh
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Main Electrical Analysis Component
export default function ElectricalAnalysisPage() {
  const router = useRouter();
  const [electricalData, setElectricalData] = useState([]);
  const [summary, setSummary] = useState({
    totalConsumption: 0,
    highestConsumer: "",
    trend: 0,
    monthlyAverage: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Function to load and parse the CSV data
    const loadElectricalData = async () => {
      try {
        const response = await fetch('/Electrical Consumptions 2024Electrical Consumptions 2024 1.csv');
        const csvData = await response.text();
        
        // Parse the CSV data
        Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setElectricalData(results.data);
            
            // Calculate summary statistics
            const totalConsumption = calculateTotalConsumption(results.data);
            const highestConsumer = findHighestConsumer(results.data);
            const trend = calculateTrend(results.data);
            const monthlyAverage = totalConsumption / 12;
            
            setSummary({
              totalConsumption,
              highestConsumer: highestConsumer.Name,
              trend,
              monthlyAverage
            });
            
            setLoading(false);
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
            setLoading(false);
          }
        });
      } catch (error) {
        console.error("Error loading electrical data:", error);
        setLoading(false);
      }
    };
    
    loadElectricalData();
  }, []);

  // Function to calculate total electrical consumption
  const calculateTotalConsumption = (data) => {
    let total = 0;
    data.forEach(item => {
      // Sum up all monthly consumption values
      ['Apr-24', 'May-24', 'June-24', 'July-24', 'August-24', 'September-24', 'October-24',
       'November-24', 'December-24', 'January-25', 'February-25', 'March-25'].forEach(month => {
        total += item[month] || 0;
      });
    });
    return total;
  };

  // Function to find the highest consumer
  const findHighestConsumer = (data) => {
    return data.reduce((maxConsumer, currentItem) => {
      const currentTotal = ['Apr-24', 'May-24', 'June-24', 'July-24', 'August-24', 'September-24', 
                           'October-24', 'November-24', 'December-24', 'January-25', 'February-25', 'March-25']
                           .reduce((sum, month) => sum + (currentItem[month] || 0), 0);
      
      const maxTotal = ['Apr-24', 'May-24', 'June-24', 'July-24', 'August-24', 'September-24', 
                        'October-24', 'November-24', 'December-24', 'January-25', 'February-25', 'March-25']
                        .reduce((sum, month) => sum + (maxConsumer[month] || 0), 0);
      
      return currentTotal > maxTotal ? currentItem : maxConsumer;
    }, data[0] || {});
  };

  // Function to calculate trend (% change from previous period)
  const calculateTrend = (data) => {
    // Calculate total for the last quarter (Jan-Mar 2025)
    const currentPeriod = data.reduce((sum, item) => {
      return sum + (item['January-25'] || 0) + (item['February-25'] || 0) + (item['March-25'] || 0);
    }, 0);
    
    // Calculate total for the previous quarter (Oct-Dec 2024)
    const previousPeriod = data.reduce((sum, item) => {
      return sum + (item['October-24'] || 0) + (item['November-24'] || 0) + (item['December-24'] || 0);
    }, 0);
    
    // Calculate percentage change
    return previousPeriod > 0 ? ((currentPeriod - previousPeriod) / previousPeriod * 100).toFixed(1) : 0;
  };

  // Create monthly consumption data for charts
  const prepareMonthlyData = () => {
    const months = ['Apr-24', 'May-24', 'June-24', 'July-24', 'August-24', 'September-24', 
                   'October-24', 'November-24', 'December-24', 'January-25', 'February-25', 'March-25'];
    
    return months.map(month => {
      const shortMonth = month.split('-')[0];
      const consumption = electricalData.reduce((sum, item) => sum + (item[month] || 0), 0);
      return {
        month: shortMonth,
        consumption: consumption
      };
    });
  };

  // Create consumption by type data for charts
  const prepareConsumptionByType = () => {
    const typeMap = {};
    
    electricalData.forEach(item => {
      const type = item.Type || 'Other';
      const consumption = ['Apr-24', 'May-24', 'June-24', 'July-24', 'August-24', 'September-24', 
                          'October-24', 'November-24', 'December-24', 'January-25', 'February-25', 'March-25']
                          .reduce((sum, month) => sum + (item[month] || 0), 0);
      
      if (typeMap[type]) {
        typeMap[type] += consumption;
      } else {
        typeMap[type] = consumption;
      }
    });
    
    const totalConsumption = Object.values(typeMap).reduce((sum, val) => sum + val, 0);
    
    return Object.entries(typeMap).map(([name, value]) => {
      return {
        name,
        value,
        percentage: totalConsumption > 0 ? ((value / totalConsumption) * 100).toFixed(1) : 0
      };
    });
  };

  // Generate top consumers data
  const prepareTopConsumers = () => {
    return electricalData
      .map(item => {
        const total = ['Apr-24', 'May-24', 'June-24', 'July-24', 'August-24', 'September-24', 
                      'October-24', 'November-24', 'December-24', 'January-25', 'February-25', 'March-25']
                      .reduce((sum, month) => sum + (item[month] || 0), 0);
        return {
          name: item.Name,
          type: item.Type,
          meterAccount: item['Meter Account No.'],
          total
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  };

  // Get month-over-month trends
  const prepareMonthlyTrends = () => {
    const months = ['Apr-24', 'May-24', 'June-24', 'July-24', 'August-24', 'September-24', 
                   'October-24', 'November-24', 'December-24', 'January-25', 'February-25', 'March-25'];
    
    const monthlyTotals = months.map(month => {
      return electricalData.reduce((sum, item) => sum + (item[month] || 0), 0);
    });
    
    return months.map((month, index) => {
      const shortMonth = month.split('-')[0];
      const current = monthlyTotals[index];
      const previous = index > 0 ? monthlyTotals[index - 1] : null;
      
      const percentChange = previous ? ((current - previous) / previous * 100).toFixed(1) : 0;
      
      return {
        month: shortMonth,
        consumption: current,
        percentChange: Number(percentChange)
      };
    });
  };

  // Prepare data for visualizations
  const monthlyData = prepareMonthlyData();
  const consumptionByType = prepareConsumptionByType();
  const topConsumers = prepareTopConsumers();
  const monthlyTrends = prepareMonthlyTrends();

  // Get the quarter totals for comparison
  const getQuarterTotals = () => {
    const q1_2025 = electricalData.reduce((sum, item) => {
      return sum + (item['January-25'] || 0) + (item['February-25'] || 0) + (item['March-25'] || 0);
    }, 0);
    
    const q4_2024 = electricalData.reduce((sum, item) => {
      return sum + (item['October-24'] || 0) + (item['November-24'] || 0) + (item['December-24'] || 0);
    }, 0);
    
    const q3_2024 = electricalData.reduce((sum, item) => {
      return sum + (item['July-24'] || 0) + (item['August-24'] || 0) + (item['September-24'] || 0);
    }, 0);
    
    const q2_2024 = electricalData.reduce((sum, item) => {
      return sum + (item['April-24'] || 0) + (item['May-24'] || 0) + (item['June-24'] || 0);
    }, 0);
    
    return [
      { name: 'Q2 2024', value: q2_2024 },
      { name: 'Q3 2024', value: q3_2024 },
      { name: 'Q4 2024', value: q4_2024 },
      { name: 'Q1 2025', value: q1_2025 },
    ];
  };

  const quarterTotals = getQuarterTotals();

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
                <h1 className="text-3xl font-bold text-white">Electrical Consumption Analysis</h1>
                <p className="text-purple-100 mt-1">Muscat Bay Utility Management</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <TabsList className="flex overflow-x-auto h-auto">
              <TabsTrigger
                value="overview"
                className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="trends"
                className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
              >
                Consumption Trends
              </TabsTrigger>
              <TabsTrigger
                value="breakdown"
                className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
              >
                Consumption Breakdown
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
              >
                Reports
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: BASE_COLOR }}>Electrical Analysis</h2>
              <p className="text-gray-500">Period: April 2024 - March 2025</p>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8ACCD5]"></div>
            </div>
          ) : (
            <>
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <DashboardCard
                    title="Total Consumption"
                    value={summary.totalConsumption.toLocaleString()}
                    unit="kWh"
                    trend={summary.trend}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>}
                  />
                  <DashboardCard
                    title="Monthly Average"
                    value={summary.monthlyAverage.toLocaleString()}
                    unit="kWh"
                    trend={3.8}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>}
                  />
                  <DashboardCard
                    title="Highest Consumer"
                    value={summary.highestConsumer}
                    unit=""
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>}
                  />
                  <DashboardCard
                    title="Peak Month"
                    value="October"
                    unit="2024"
                    trend={24.2}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2 overflow-hidden">
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Consumption Trends</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="consumption" name="Consumption (kWh)" fill={SUCCESS_COLOR} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Consumption by Type</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={consumptionByType}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {consumptionByType.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={[SUCCESS_COLOR, INFO_COLOR, ACCENT_COLOR, WARNING_COLOR][index % 4]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="overflow-hidden">
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Top 5 Consumers</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meter Account</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Consumption</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {topConsumers.map((consumer, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{consumer.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consumer.type}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consumer.meterAccount}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" style={{ color: SUCCESS_COLOR }}>{consumer.total.toLocaleString()} kWh</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {((consumer.total / summary.totalConsumption) * 100).toFixed(1)}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="overflow-hidden">
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Monthly Consumption</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="consumption" name="Consumption (kWh)" stroke={SUCCESS_COLOR} strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Month-over-Month Change</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyTrends.slice(1)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar 
                              dataKey="percentChange" 
                              name="% Change" 
                              fill={ACCENT_COLOR}
                              minPointSize={5}
                            >
                              {monthlyTrends.slice(1).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.percentChange >= 0 ? SUCCESS_COLOR : DANGER_COLOR} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="overflow-hidden">
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Quarterly Comparison</h3>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={quarterTotals} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="value" name="Consumption (kWh)" fill={INFO_COLOR} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="breakdown" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="overflow-hidden">
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Consumption by Type</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={consumptionByType}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {consumptionByType.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={[SUCCESS_COLOR, INFO_COLOR, ACCENT_COLOR, WARNING_COLOR][index % 4]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="overflow-hidden">
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Consumption Distribution</h3>
                      <div className="space-y-4">
                        {consumptionByType.map((type, index) => {
                          const percentage = (type.value / summary.totalConsumption) * 100;
                          return (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700">{type.name}</span>
                                <span className="text-sm font-medium text-gray-700">{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                  className="h-2.5 rounded-full" 
                                  style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: [SUCCESS_COLOR, INFO_COLOR, ACCENT_COLOR, WARNING_COLOR][index % 4]
                                  }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500">{type.value.toLocaleString()} kWh</div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="overflow-hidden">
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Consumption by Location</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                          <tr>
                            <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
                            <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Type</th>
                            <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Q2 2024</th>
                            <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Q3 2024</th>
                            <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Q4 2024</th>
                            <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Q1 2025</th>
                            <th className="py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {electricalData.slice(0, 10).map((item, index) => {
                            const q2_2024 = (item['Apr-24'] || 0) + (item['May-24'] || 0) + (item['June-24'] || 0);
                            const q3_2024 = (item['July-24'] || 0) + (item['August-24'] || 0) + (item['September-24'] || 0);
                            const q4_2024 = (item['October-24'] || 0) + (item['November-24'] || 0) + (item['December-24'] || 0);
                            const q1_2025 = (item['January-25'] || 0) + (item['February-25'] || 0) + (item['March-25'] || 0);
                            const total = q2_2024 + q3_2024 + q4_2024 + q1_2025;
                            
                            return (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm text-gray-900">{item.Name}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{item.Type}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{q2_2024.toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{q3_2024.toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{q4_2024.toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm text-gray-900">{q1_2025.toLocaleString()}</td>
                                <td className="px-4 py-3 text-sm font-medium" style={{ color: SUCCESS_COLOR }}>{total.toLocaleString()}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-6">
                <Card className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-700">Electrical Consumption Report</h3>
                      <button className="bg-[#8ACCD5] text-white px-4 py-2 rounded hover:bg-[#7ABBC5] transition-colors">
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          Export Report
                        </span>
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-medium text-gray-800 mb-4">Executive Summary</h4>
                        <p className="text-gray-700 mb-4">
                          Total electrical consumption for the period April 2024 to March 2025 was <strong>{summary.totalConsumption.toLocaleString()} kWh</strong>, 
                          with a monthly average of <strong>{summary.monthlyAverage.toLocaleString()} kWh</strong>. 
                          The current quarter (Q1 2025) shows a <strong>{summary.trend > 0 ? 'increase' : 'decrease'} of {Math.abs(summary.trend)}%</strong> compared to the previous quarter.
                        </p>
                        <p className="text-gray-700">
                          The highest consumption was recorded in <strong>October 2024</strong>, and the top consumer was <strong>{summary.highestConsumer}</strong>.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-md font-medium text-gray-800 mb-3">Key Findings</h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Pumping stations account for {consumptionByType.find(t => t.name === 'PS')?.percentage || '45'}% of total consumption</li>
                            <li>October 2024 had the highest consumption at {monthlyData.find(m => m.month === 'October')?.consumption.toLocaleString() || '12,688'} kWh</li>
                            <li>Q1 2025 showed a {summary.trend > 0 ? 'positive' : 'negative'} trend compared to Q4 2024</li>
                            <li>Average daily consumption: {(summary.totalConsumption / 365).toFixed(0)} kWh</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-md font-medium text-gray-800 mb-3">Recommendations</h4>
                          <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            <li>Review high consumption at {summary.highestConsumer} for potential energy efficiency measures</li>
                            <li>Investigate the peak consumption in October 2024 to identify potential optimization</li>
                            <li>Consider installing sub-meters at high-consumption locations for more detailed monitoring</li>
                            <li>Develop an energy efficiency plan targeting the top 5 consumers</li>
                          </ul>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-md font-medium text-gray-800 mb-3">Quarterly Comparison</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-200">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Quarter</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Consumption (kWh)</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">% Change</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">% of Total</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {quarterTotals.map((quarter, index) => {
                                const prevValue = index > 0 ? quarterTotals[index - 1].value : null;
                                const percentChange = prevValue ? ((quarter.value - prevValue) / prevValue * 100).toFixed(1) : 'N/A';
                                const percentOfTotal = ((quarter.value / summary.totalConsumption) * 100).toFixed(1);
                                
                                return (
                                  <tr key={index}>
                                    <td className="px-4 py-2 text-sm text-gray-900">{quarter.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{quarter.value.toLocaleString()} kWh</td>
                                    <td className="px-4 py-2 text-sm">
                                      {prevValue ? (
                                        <span className={Number(percentChange) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                          {Number(percentChange) >= 0 ? '+' : ''}{percentChange}%
                                        </span>
                                      ) : 'N/A'}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{percentOfTotal}%</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>

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

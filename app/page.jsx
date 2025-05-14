'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { DropletIcon, ZapIcon, ActivityIcon, ScrollTextIcon, PlusIcon, LineChartIcon } from 'lucide-react';
import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, PieChart, Pie, Cell } from 'recharts';

// Sample data for dashboard visualizations
const waterQualityData = [
  { name: 'Jan', ph: 7.2, tds: 320, temperature: 25, alkalinity: 150 },
  { name: 'Feb', ph: 7.3, tds: 310, temperature: 24, alkalinity: 155 },
  { name: 'Mar', ph: 7.1, tds: 315, temperature: 25, alkalinity: 152 },
  { name: 'Apr', ph: 7.2, tds: 325, temperature: 26, alkalinity: 148 },
  { name: 'May', ph: 7.3, tds: 330, temperature: 27, alkalinity: 145 },
];

const electricalData = [
  { name: 'Jan', consumption: 4200 },
  { name: 'Feb', consumption: 3800 },
  { name: 'Mar', consumption: 4000 },
  { name: 'Apr', consumption: 4300 },
  { name: 'May', consumption: 4800 },
];

const stpData = [
  { name: 'Jan', inflow: 120, outflow: 118, efficiency: 98.3 },
  { name: 'Feb', inflow: 125, outflow: 122, efficiency: 97.6 },
  { name: 'Mar', inflow: 130, outflow: 127, efficiency: 97.7 },
  { name: 'Apr', inflow: 128, outflow: 125, efficiency: 97.7 },
  { name: 'May', inflow: 135, outflow: 132, efficiency: 97.8 },
];

const contractsData = [
  { name: 'Maintenance', value: 123000 },
  { name: 'Utilities', value: 87000 },
  { name: 'Services', value: 65000 },
  { name: 'Landscaping', value: 52000 },
];

const COLORS = ['#047857', '#0e7490', '#6366f1', '#d946ef'];

// Modules configuration
const modules = [
  {
    id: 'water-analysis',
    name: 'Water Analysis',
    description: 'Monitor water quality parameters and analyze trends',
    icon: <DropletIcon className="h-12 w-12 text-blue-600" />,
    color: 'border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100',
    link: '/water',
    stats: [
      { name: 'Samples', value: '128', trend: '+12% from last month' },
      { name: 'Avg pH', value: '7.2', trend: 'Within optimal range' },
      { name: 'Avg TDS', value: '320', trend: '5% lower than standard' },
    ]
  },
  {
    id: 'electrical-analysis',
    name: 'Electrical Analysis',
    description: 'Track electrical consumption and identify optimization opportunities',
    icon: <ZapIcon className="h-12 w-12 text-green-600" />,
    color: 'border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100',
    link: '/electrical-analysis',
    stats: [
      { name: 'Consumption', value: '56,000 kWh', trend: '+12% from last year' },
      { name: 'Peak Demand', value: '820 kW', trend: '+5% from last month' },
      { name: 'Efficiency', value: '87%', trend: '+2% from baseline' },
    ]
  },
  {
    id: 'stp-monitoring',
    name: 'STP Monitoring',
    description: 'Monitor sewage treatment plant performance and water recycling',
    icon: <ActivityIcon className="h-12 w-12 text-teal-600" />,
    color: 'border-teal-200 hover:border-teal-300 bg-teal-50 hover:bg-teal-100',
    link: '/stp-monitoring',
    stats: [
      { name: 'Inflow', value: '132 m³/day', trend: '+5% from last week' },
      { name: 'Efficiency', value: '97.8%', trend: '+0.2% from last month' },
      { name: 'Recycled', value: '129 m³/day', trend: '98% of outflow' },
    ]
  },
  {
    id: 'contract-tracker',
    name: 'Contract Tracker',
    description: 'Manage service provider contracts and track renewals',
    icon: <ScrollTextIcon className="h-12 w-12 text-purple-600" />,
    color: 'border-purple-200 hover:border-purple-300 bg-purple-50 hover:bg-purple-100',
    link: '/contract-tracker',
    stats: [
      { name: 'Total', value: '7', trend: 'Across all categories' },
      { name: 'Value', value: 'OMR 327,000', trend: 'Annual contract value' },
      { name: 'Renewals', value: '2', trend: 'Due within 60 days' },
    ]
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="flex h-16 items-center px-4 md:px-6">
          <h1 className="text-xl font-semibold">Muscat Bay Utility Management</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm">
              <LineChartIcon className="mr-2 h-4 w-4" />
              Reports
            </Button>
            <Button size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              New
            </Button>
          </div>
        </div>
      </header>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">May 2024</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {modules.map((module) => (
                <Link key={module.id} href={module.link}>
                  <Card className={`cursor-pointer transition-all ${module.color}`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <CardTitle className="text-xl font-bold">{module.name}</CardTitle>
                      {module.icon}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{module.description}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {module.stats.map((stat, index) => (
                          <div key={index}>
                            <p className="text-xs text-muted-foreground">{stat.name}</p>
                            <p className="text-sm font-medium">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Water Quality Parameters</CardTitle>
                  <CardDescription>Key water quality indicators from the last 5 months</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={waterQualityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tds" fill="#0e7490" name="TDS (ppm)" />
                      <Bar dataKey="alkalinity" fill="#6366f1" name="Alkalinity (mg/L)" />
                      <Line type="monotone" dataKey="ph" stroke="#047857" name="pH" />
                      <Line type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature (°C)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Electrical Consumption</CardTitle>
                  <CardDescription>Monthly electricity usage in kWh</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <Bar data={electricalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="consumption" fill="#047857" name="Consumption (kWh)" />
                    </Bar>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>STP Performance</CardTitle>
                  <CardDescription>Monthly inflow and outflow rates</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={stpData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="inflow" fill="#0e7490" name="Inflow (m³/day)" />
                      <Bar dataKey="outflow" fill="#047857" name="Outflow (m³/day)" />
                      <Line type="monotone" dataKey="efficiency" stroke="#6366f1" name="Efficiency (%)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Contracts by Category</CardTitle>
                  <CardDescription>Distribution of contract values</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={contractsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {contractsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `OMR ${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Water Consumption</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48,500 m³</div>
                  <p className="text-xs text-muted-foreground">+1.2% from last year</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Energy Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">OMR 6,720</div>
                  <p className="text-xs text-muted-foreground">+8% from last year</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Water Recycled</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18,920 m³</div>
                  <p className="text-xs text-muted-foreground">39% of total consumption</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">OMR 327,000 total value</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Integrated Utility Analysis</CardTitle>
                <CardDescription>Comprehensive year-to-date performance across all utilities</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={500}>
                  <Line margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="waterConsumption" stroke="#0ea5e9" name="Water Consumption (m³)" />
                    <Line type="monotone" dataKey="electricalConsumption" stroke="#047857" name="Electrical Consumption (kWh)" />
                    <Line type="monotone" dataKey="recycledWater" stroke="#6366f1" name="Recycled Water (m³)" />
                    <Line type="monotone" dataKey="contractCosts" stroke="#d946ef" name="Contract Costs (OMR)" />
                  </Line>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

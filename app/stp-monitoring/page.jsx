'use client';

import { useState } from 'react';
import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, DownloadIcon, FilterIcon, AlertTriangleIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// Sample data - replace with actual data loaded from CSV
const weeklyData = [
  { day: 'Mon', inflow: 120, outflow: 118, efficiency: 98.3 },
  { day: 'Tue', inflow: 125, outflow: 122, efficiency: 97.6 },
  { day: 'Wed', inflow: 130, outflow: 127, efficiency: 97.7 },
  { day: 'Thu', inflow: 128, outflow: 125, efficiency: 97.7 },
  { day: 'Fri', inflow: 135, outflow: 132, efficiency: 97.8 },
  { day: 'Sat', inflow: 140, outflow: 137, efficiency: 97.9 },
  { day: 'Sun', inflow: 132, outflow: 129, efficiency: 97.7 },
];

const qualityParameters = [
  { name: 'pH', value: 7.2, min: 6.5, max: 8.5, status: 'normal' },
  { name: 'TSS', value: 12, min: 0, max: 30, status: 'normal' },
  { name: 'BOD', value: 15, min: 0, max: 30, status: 'normal' },
  { name: 'COD', value: 48, min: 0, max: 100, status: 'normal' },
  { name: 'TN', value: 8, min: 0, max: 10, status: 'warning' },
  { name: 'TP', value: 1.2, min: 0, max: 2, status: 'normal' },
];

const maintenanceData = [
  { name: 'Filter Cleaning', scheduled: '2024-05-18', lastPerformed: '2024-05-01', status: 'upcoming' },
  { name: 'Pump Inspection', scheduled: '2024-05-20', lastPerformed: '2024-04-20', status: 'upcoming' },
  { name: 'Chemical Refill', scheduled: '2024-05-16', lastPerformed: '2024-05-02', status: 'urgent' },
  { name: 'Sensor Calibration', scheduled: '2024-05-30', lastPerformed: '2024-04-30', status: 'normal' },
  { name: 'Tank Cleaning', scheduled: '2024-06-15', lastPerformed: '2024-03-15', status: 'normal' },
];

const usageData = [
  { name: 'Irrigation', value: 65 },
  { name: 'Toilet Flushing', value: 25 },
  { name: 'Cooling Towers', value: 10 },
];

const COLORS = ['#047857', '#0e7490', '#6366f1', '#d946ef'];

export default function STPMonitoring() {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'warning':
        return 'text-amber-500';
      case 'urgent':
        return 'text-red-500';
      case 'upcoming':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getProgressColor = (value, min, max) => {
    const threshold = max * 0.8;
    if (value <= threshold) return 'bg-green-600';
    if (value <= max) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/">
            <Button variant="ghost" className="h-8 w-8 p-0 mr-4">
              <ArrowLeftIcon className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
          </Link>
          <h1 className="text-lg font-semibold">STP Monitoring</h1>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="outline" size="sm" className="h-8">
              <FilterIcon className="h-3.5 w-3.5 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <DownloadIcon className="h-3.5 w-3.5 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Sewage Treatment Plant Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">May 2024</Button>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Inflow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">132 m³/day</div>
              <p className="text-xs text-muted-foreground">+5% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Treatment Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">97.8%</div>
              <p className="text-xs text-muted-foreground">+0.2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recycled Water</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">129 m³/day</div>
              <p className="text-xs text-muted-foreground">98% of outflow</p>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-800">Alerts</CardTitle>
              <AlertTriangleIcon className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-amber-800 font-medium">2 Maintenance Tasks Due</div>
              <p className="text-xs text-amber-700">Chemical refill required</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="water-quality">Water Quality</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="recycled-water">Recycled Water</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Flow Rates</CardTitle>
                <CardDescription>Inflow and outflow rates with treatment efficiency</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" domain={[96, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="inflow" fill="#0e7490" name="Inflow (m³/day)" />
                    <Bar yAxisId="left" dataKey="outflow" fill="#047857" name="Outflow (m³/day)" />
                    <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#6366f1" name="Efficiency (%)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="water-quality" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {qualityParameters.map((param, index) => (
                <Card key={index} className={param.status === 'warning' ? 'border-amber-200' : ''}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{param.name}</CardTitle>
                    <span className={`text-sm font-medium ${getStatusColor(param.status)}`}>
                      {param.value} {param.name === 'pH' ? '' : 'mg/L'}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xs text-muted-foreground mb-2">
                      Acceptable range: {param.min} - {param.max} {param.name === 'pH' ? '' : 'mg/L'}
                    </div>
                    <div className="mt-4 h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(param.value, param.min, param.max)}`}
                        style={{
                          width: `${((param.value - param.min) / (param.max - param.min)) * 100}%`,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Water Quality Trends</CardTitle>
                <CardDescription>Historical water quality parameter measurements</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={400}>
                  <Line margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pH" stroke="#0e7490" name="pH" />
                    <Line type="monotone" dataKey="TSS" stroke="#047857" name="TSS (mg/L)" />
                    <Line type="monotone" dataKey="BOD" stroke="#6366f1" name="BOD (mg/L)" />
                    <Line type="monotone" dataKey="COD" stroke="#d946ef" name="COD (mg/L)" />
                  </Line>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="maintenance" className="space-y-4">
            <div className="grid gap-4">
              {maintenanceData.map((task, index) => (
                <Card key={index} className={task.status === 'urgent' ? 'border-red-200 bg-red-50' : ''}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{task.name}</CardTitle>
                    <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Scheduled Date</p>
                        <p className="font-medium">{new Date(task.scheduled).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Performed</p>
                        <p className="font-medium">{new Date(task.lastPerformed).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="recycled-water" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recycled Water Usage</CardTitle>
                  <CardDescription>Distribution of treated water by application</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={usageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {usageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Recycled Water Quality</CardTitle>
                  <CardDescription>Key parameters of recycled water</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Turbidity</span>
                        <span className="text-sm text-green-600">1.2 NTU</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-600" style={{ width: '24%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Threshold: 5 NTU</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Residual Chlorine</span>
                        <span className="text-sm text-green-600">0.8 mg/L</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-600" style={{ width: '80%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Threshold: 1.0 mg/L</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">E. coli</span>
                        <span className="text-sm text-green-600">None detected</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-green-600" style={{ width: '0%' }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Threshold: 0 CFU/100mL</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Recycled Water Production</CardTitle>
                <CardDescription>Total volume of recycled water generated</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={300}>
                  <Bar margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="production" fill="#047857" name="Production (m³)" />
                    <Bar dataKey="target" fill="#6366f1" name="Target (m³)" />
                  </Bar>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

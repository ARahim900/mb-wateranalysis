'use client';

import { useState } from 'react';
import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, DownloadIcon, FilterIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// Sample data - replace with actual data loaded from CSV
const monthlyData = [
  { name: 'Jan', consumption: 4200, peak: 2400, off_peak: 1800 },
  { name: 'Feb', consumption: 3800, peak: 2100, off_peak: 1700 },
  { name: 'Mar', consumption: 4000, peak: 2300, off_peak: 1700 },
  { name: 'Apr', consumption: 4300, peak: 2500, off_peak: 1800 },
  { name: 'May', consumption: 4800, peak: 2800, off_peak: 2000 },
  { name: 'Jun', consumption: 5200, peak: 3100, off_peak: 2100 },
  { name: 'Jul', consumption: 5600, peak: 3300, off_peak: 2300 },
  { name: 'Aug', consumption: 5800, peak: 3400, off_peak: 2400 },
  { name: 'Sep', consumption: 5200, peak: 3100, off_peak: 2100 },
  { name: 'Oct', consumption: 4800, peak: 2800, off_peak: 2000 },
  { name: 'Nov', consumption: 4200, peak: 2400, off_peak: 1800 },
  { name: 'Dec', consumption: 4000, peak: 2300, off_peak: 1700 },
];

const facilityData = [
  { name: 'Main Building', consumption: 2800, percentage: 35 },
  { name: 'Residential Area A', consumption: 1600, percentage: 20 },
  { name: 'Residential Area B', consumption: 1200, percentage: 15 },
  { name: 'STP Plant', consumption: 800, percentage: 10 },
  { name: 'Common Areas', consumption: 800, percentage: 10 },
  { name: 'Others', consumption: 800, percentage: 10 },
];

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  load: Math.random() * 300 + 100,
  temperature: Math.random() * 10 + 30,
}));

export default function ElectricalAnalysis() {
  const [activeTab, setActiveTab] = useState('overview');

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
          <h1 className="text-lg font-semibold">Electrical Analysis</h1>
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
          <h2 className="text-3xl font-bold tracking-tight">Electrical Consumption Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline">2024</Button>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Consumption</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">56,000 kWh</div>
              <p className="text-xs text-muted-foreground">+12% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Peak Demand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">820 kW</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">OMR 6,720</div>
              <p className="text-xs text-muted-foreground">+8% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+2% from baseline</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="by-facility">By Facility</TabsTrigger>
            <TabsTrigger value="hourly-load">Hourly Load</TabsTrigger>
            <TabsTrigger value="trends">Trends & Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Electrical Consumption</CardTitle>
                <CardDescription>Breakdown of total consumption, peak and off-peak usage for 2024</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="consumption" fill="#047857" name="Total Consumption (kWh)" />
                    <Line type="monotone" dataKey="peak" stroke="#0e7490" name="Peak Usage (kWh)" />
                    <Line type="monotone" dataKey="off_peak" stroke="#6366f1" name="Off-Peak Usage (kWh)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="by-facility" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Consumption by Facility</CardTitle>
                <CardDescription>Distribution of electrical usage across different facilities</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={400}>
                  <Bar data={facilityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
            <div className="grid gap-4 md:grid-cols-2">
              {facilityData.map((facility, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{facility.name}</CardTitle>
                    <span className="text-sm font-medium text-muted-foreground">{facility.percentage}%</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{facility.consumption} kWh</div>
                    <div className="mt-4 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${facility.percentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="hourly-load" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Load Profile</CardTitle>
                <CardDescription>24-hour load profile with temperature correlation</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={hourlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="load" fill="#047857" name="Load (kW)" />
                    <Line yAxisId="right" type="monotone" dataKey="temperature" stroke="#ef4444" name="Temperature (°C)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Long-term Consumption Trends</CardTitle>
                <CardDescription>Year-on-year comparison of electrical usage</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={400}>
                  <Line margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="2022" stroke="#6366f1" name="2022" />
                    <Line type="monotone" dataKey="2023" stroke="#0e7490" name="2023" />
                    <Line type="monotone" dataKey="2024" stroke="#047857" name="2024" />
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

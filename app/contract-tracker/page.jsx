'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, DownloadIcon, FilterIcon, AlertTriangleIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Line } from 'recharts';

// Sample data - replace with actual data loaded from CSV
const contractsData = [
  {
    id: 'CT001',
    provider: 'Al Mouj Services',
    service: 'STP Maintenance',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    value: 34500,
    status: 'active',
  },
  {
    id: 'CT002',
    provider: 'Green Tech Oman',
    service: 'Landscaping Services',
    startDate: '2023-11-01',
    endDate: '2024-10-31',
    value: 52000,
    status: 'active',
  },
  {
    id: 'CT003',
    provider: 'PowerLogic LLC',
    service: 'Electrical Maintenance',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    value: 18500,
    status: 'expiring',
  },
  {
    id: 'CT004',
    provider: 'Muscat Water Solutions',
    service: 'Water Quality Testing',
    startDate: '2024-02-10',
    endDate: '2024-08-10',
    value: 12000,
    status: 'active',
  },
  {
    id: 'CT005',
    provider: 'Smart Building Systems',
    service: 'BMS Maintenance',
    startDate: '2023-12-15',
    endDate: '2024-06-15',
    value: 28000,
    status: 'expiring',
  },
  {
    id: 'CT006',
    provider: 'Eco Clean Services',
    service: 'Waste Management',
    startDate: '2023-10-01',
    endDate: '2024-05-15',
    value: 14500,
    status: 'expired',
  },
  {
    id: 'CT007',
    provider: 'United Facility Solutions',
    service: 'HVAC Maintenance',
    startDate: '2024-04-01',
    endDate: '2025-03-31',
    value: 42000,
    status: 'active',
  },
];

const upcomingRenewals = contractsData.filter(
  contract => {
    const today = new Date();
    const endDate = new Date(contract.endDate);
    const diffTime = Math.abs(endDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60 && contract.status !== 'expired';
  }
).sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

const categoriesData = [
  { name: 'Maintenance', value: 123000 },
  { name: 'Utilities', value: 87000 },
  { name: 'Services', value: 65000 },
  { name: 'Landscaping', value: 52000 },
];

const COLORS = ['#047857', '#0e7490', '#6366f1', '#d946ef'];

const monthlySpendData = [
  { month: 'Jan', value: 18500 },
  { month: 'Feb', value: 19200 },
  { month: 'Mar', value: 20500 },
  { month: 'Apr', value: 20800 },
  { month: 'May', value: 21200 },
  { month: 'Jun', value: 19800 },
  { month: 'Jul', value: 20100 },
  { month: 'Aug', value: 21000 },
  { month: 'Sep', value: 22500 },
  { month: 'Oct', value: 23100 },
  { month: 'Nov', value: 24000 },
  { month: 'Dec', value: 24800 },
];

export default function ContractTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all-contracts');

  const filteredContracts = contractsData.filter(
    contract =>
      contract.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'expiring':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Expiring Soon</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
          <h1 className="text-lg font-semibold">Contract Tracker</h1>
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
          <h2 className="text-3xl font-bold tracking-tight">Contract Management</h2>
          <Button className="bg-primary">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Contract
          </Button>
        </div>
        <Separator />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contractsData.length}</div>
              <p className="text-xs text-muted-foreground">Across all service categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Annual Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">OMR {contractsData.reduce((sum, contract) => sum + contract.value, 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total contract value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contractsData.filter(c => c.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground">{Math.round((contractsData.filter(c => c.status === 'active').length / contractsData.length) * 100)}% of total</p>
            </CardContent>
          </Card>
          <Card className={upcomingRenewals.length > 0 ? 'border-amber-200 bg-amber-50' : ''}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
              {upcomingRenewals.length > 0 && <AlertTriangleIcon className="h-4 w-4 text-amber-500" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingRenewals.length}</div>
              <p className="text-xs text-muted-foreground">Within next 60 days</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex items-center space-x-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contracts by provider, service or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 md:w-80 lg:w-96"
          />
        </div>
        <Tabs defaultValue="all-contracts" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all-contracts">All Contracts</TabsTrigger>
            <TabsTrigger value="renewals">Upcoming Renewals</TabsTrigger>
            <TabsTrigger value="analysis">Cost Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="all-contracts" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Service Provider</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Value (OMR)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContracts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                          No contracts found matching your search criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredContracts.map((contract) => (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">{contract.id}</TableCell>
                          <TableCell>{contract.provider}</TableCell>
                          <TableCell>{contract.service}</TableCell>
                          <TableCell>{formatDate(contract.startDate)}</TableCell>
                          <TableCell>{formatDate(contract.endDate)}</TableCell>
                          <TableCell>{contract.value.toLocaleString()}</TableCell>
                          <TableCell>{getStatusBadge(contract.status)}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex items-center justify-between py-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredContracts.length} of {contractsData.length} contracts
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="renewals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contracts Expiring in the Next 60 Days</CardTitle>
                <CardDescription>Review and prepare for upcoming contract renewals</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Service Provider</TableHead>
                      <TableHead>Service Type</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Days Remaining</TableHead>
                      <TableHead>Value (OMR)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingRenewals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                          No upcoming contract renewals within the next 60 days.
                        </TableCell>
                      </TableRow>
                    ) : (
                      upcomingRenewals.map((contract) => {
                        const today = new Date();
                        const endDate = new Date(contract.endDate);
                        const diffTime = Math.abs(endDate - today);
                        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                        return (
                          <TableRow key={contract.id}>
                            <TableCell className="font-medium">{contract.id}</TableCell>
                            <TableCell>{contract.provider}</TableCell>
                            <TableCell>{contract.service}</TableCell>
                            <TableCell>{formatDate(contract.endDate)}</TableCell>
                            <TableCell>
                              <span className={daysRemaining <= 30 ? 'text-red-600 font-medium' : 'text-amber-600'}>
                                {daysRemaining} days
                              </span>
                            </TableCell>
                            <TableCell>{contract.value.toLocaleString()}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" className="mr-2">
                                Extend
                              </Button>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analysis" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Contracts by Category</CardTitle>
                  <CardDescription>Distribution of contract values by service category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoriesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoriesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `OMR ${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Spend</CardTitle>
                  <CardDescription>Contract-related expenditures by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <Bar data={monthlySpendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => `OMR ${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="value" name="Monthly Spend" fill="#047857" />
                    </Bar>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Contract Value</CardTitle>
                <CardDescription>Trend analysis of contract spending over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <Line margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `OMR ${value.toLocaleString()}`} />
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
